import UsersService from '../../users/services/users-service';
import Response from '../../global/helpers/response-helper';
import { RandomError } from '../../global/helpers/errors';

export default class PasswordResetController {
  static async post(req, res, next) {
    try {
      await UsersService.updatePasswordUsingToken(req.body);

      res.sendStatus(200);
    } catch (e) {
      next(e)
    }
  }
}
