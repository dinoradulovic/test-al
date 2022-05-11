import UsersService from '../../users/services/users-service';

export default class EmailVerificationsController {
  static async post(req, res, next) {
    try {
      await UsersService.verifyEmail(req.body);

      res.sendStatus(200);
    } catch (e) {
      next(e)
    }
  }
}
