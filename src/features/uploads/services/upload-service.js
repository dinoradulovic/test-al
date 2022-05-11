import config from '../../../core/config';
import MulterS3Service from "./multer-s3-service";

export default class ImageUploadService {
  static async prepareProfilePicUpload(userId) {
    const {
      s3UploadsBucket,
      s3profilePicturesPath,
      s3ProfilePictureFileName } = config.appConfig;
    let userProfilePicS3Path = `${s3profilePicturesPath}/${userId}/${s3ProfilePictureFileName}-`;

    // need this timestamp to avoid browser caching <img /> tag when uploading images multiple times in a row
    userProfilePicS3Path += (+new Date()).toString();

    return await MulterS3Service.initializeMulterUpload(s3UploadsBucket, userProfilePicS3Path, 'profilePicture', ['png', 'jpg', 'jpeg']);
  }
}
