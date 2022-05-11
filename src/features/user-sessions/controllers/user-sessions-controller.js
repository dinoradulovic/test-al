import UsersService from '../../users/services/users-service';
import Response from '../../global/helpers/response-helper';

export default class UserSessionsController {
    static async post(req, res, next) {
        const { email, password } = req.body;

        try {
            const loginRes = await UsersService.loginUser(email, password);

            res.json(Response.defaultResponse({
                userSessions: [loginRes.data]
            }));
        } catch (e) {
            next(e)
        }
    }
}
