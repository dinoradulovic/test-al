import multer from 'multer';
import multerS3 from "multer-s3";
import util from "util";
import AWS from "aws-sdk";

import { RandomError } from '../../global/helpers/errors';
import { logger } from "../../global/helpers/loggers";
import AWSHelper from '../../global/helpers/aws-helper';

export default class MulterS3Service {
  static async initializeMulterUpload(bucketName, objectPath, fieldName, allowedExtensions) {
    const bucketExists = await AWSHelper.checkBucketExists(bucketName);
    if (!bucketExists) throw new RandomError(`Bucket: ${bucketName} doesn't exist`);

    const s3 = new AWS.S3();

    return util.promisify(multer({
      storage: multerS3({
        s3,
        bucket: bucketName,
        acl: 'public-read',
        cacheControl: 'no-cache',
        contentDisposition: 'inline',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        serverSideEncryption: 'AES256',
        key: (req, file, cb) => {
          const fileExtension = file.originalname.split('.')[file.originalname.split('.').length - 1];
    
          if (allowedExtensions.indexOf(fileExtension) === -1) {
            const error = new RandomError(`Wrong file type, it should be: ${allowedExtensions.join(',')}`);
            cb(error);
          } else {
            logger.info(`Uploading to: ${objectPath}.${fileExtension}`);
            cb(null, `${objectPath}.${fileExtension}`);
          }
        }
      })
    }).single(fieldName));
  }
}
