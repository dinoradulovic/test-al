import UsersService from '../../users/services/users-service';
import { RandomError } from '../helpers/errors';
import { logger } from "../helpers/loggers";

export async function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  try {
    if (!token) throw new RandomError("No token provided");

    const userRes = await UsersService.getUserByToken(token);
    res.locals.user = userRes.data.user;
    next();

  } catch (e) {
    e.status = 401;
    next(e);
  }
}
