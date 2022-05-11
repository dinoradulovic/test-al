import { RandomError } from '../helpers/errors';
import { userTypes } from "../../global/constants/constants";

export async function onlyAdmin(req, res, next) {
  const { role } = res.locals.user;

  if (role === userTypes.admin) next();
  else {
    const error = new RandomError("User Type: " + role + " is not allowed to access this endpoint.");
    error.status = 403;
    next(error);
  }
}
