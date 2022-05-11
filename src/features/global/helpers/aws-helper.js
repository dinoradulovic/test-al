import AWS from "aws-sdk";


export default class AWSHelper {
  // TODO https://stackoverflow.com/questions/46442365/how-to-allow-only-a-specific-user-to-access-a-content-on-amazon-s3

  static async checkBucketExists(bucketName) {
    const s3 = new AWS.S3();
    const params = { Bucket: bucketName };

    try {
      await s3.headBucket(params).promise();
      return true;
    } catch (err) {
      if (err.statusCode === 404) return false;
      throw err;
    }
  }

  static async doesObjectExist(bucketName, path) {
    try {
      const s3 = new AWS.S3();
      var params = {
        Bucket: bucketName,
        Key: path
      };

      await s3.headObject(params).promise();
      return true;
    } catch (err) {
      if (err.code === 'NotFound') return false;
      throw err
    }
  }

  async listAllKeys(bucket) {
    // TODO not finished yet. Also still not used.
    const s3 = new AWS.S3();
    var allKeys = [];

    var params = { Bucket: bucket };

    try {
      const data = await s3.listObjectsV2(params).promise();

      var contents = data.Contents;
      contents.forEach((content) => allKeys.push(content.Key));

      if (data.IsTruncated) {
        params.ContinuationToken = data.NextContinuationToken;
        listAllKeys();
      }

    } catch (err) {
      console.log(err, err.stack); // an error occurred
    }

    return allKeys;
  }

  async getObject(bucket, key) {
    // TODO not finished yet. Also still not used.

    const s3 = new AWS.S3();

    const params = { Bucket: bucket, Key: key }

    try {
      return await s3.getObject(params).promise();
    } catch (e) {

    }
  }

  static async upload(params) {
    const s3 = new AWS.S3();

    return await s3.upload(params).promise();
  }

  static convertS3AccessPath(s3ProtocolPath) {
    // This function converts S3 protocol format to path-style format 
    // Some AWS services, return S3:// format instead of path-style
    // More info here: 
    // https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingBucket.html

    let s3ProtocolPathSplitted = s3ProtocolPath.split("/");
    let s3ProtocolPathTrimmed = s3ProtocolPathSplitted.splice(2, s3ProtocolPathSplitted.length);
    const s3Path = `https://${s3ProtocolPathTrimmed.shift()}.s3-ap-southeast-1.amazonaws.com/${s3ProtocolPathTrimmed.join("/")}`;

    return s3Path;
  }

}
