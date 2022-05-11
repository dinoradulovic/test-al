import dotenv from "dotenv";

dotenv.config();

export default {
  env: process.env.NODE_ENV,
  databaseConfig: {
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
  },
  appConfig: {
    port: process.env.API_APPLICATION_PORT,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    clientMainAppDomainName: process.env.CLIENT_MAIN_APP_DOMAIN_NAME,
    nodemailerTransportUser: process.env.NODEMAILER_TRANSPORT_USER,
    nodemailerTransportPassword: process.env.NODEMAILER_TRANSPORT_PASSWORD,
    s3UploadsBucket: process.env.S3_UPLOADS_BUCKET,
    s3profilePicturesPath: process.env.S3_PROFILE_PICTURES_PATH,
    s3ProfilePictureFileName: process.env.S3_PROFILE_PICTURE_FILE_NAME,
  }
}