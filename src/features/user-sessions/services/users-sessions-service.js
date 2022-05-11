import jwt from "jsonwebtoken";
import config from "../../../core/config";

export default class UserSessionsService {
  static async createToken(id) {
    const { appConfig: { jwtSecretKey } } = config;
    // expires in 1 month
    var token = jwt.sign({ id }, jwtSecretKey, {
      expiresIn: 60 * 60 * 24 * 30
    });

    return token;
  }

  static async decodeToken(token) {
    const { appConfig: { jwtSecretKey } } = config;
    token = token.slice(7, token.length).trimLeft();

    const decoded = await jwt.verify(token, jwtSecretKey);

    return decoded;
  }
}