import _ from "lodash";
import UsersService from '../services/users-service';
import Response from '../../global/helpers/response-helper';
import { RandomError } from '../../global/helpers/errors';


export default class UsersController {
	static async get(req, res, next) {
		try {
			const { user } = res.locals;

			let usersRes = [];
			if (user.role === "admin") {
				usersRes = await UsersService.getUsers();
			}

			res.json(Response.defaultResponse({ users: usersRes.data.users }));
		} catch (e) {
			next(e);
		}
	}

	static async getOne(req, res, next) {
		try {
			const usersRes = await UsersService.getUserByID(req.params.userId);

			return res.json(Response.defaultResponse({ users: usersRes.data.users }));
		} catch (e) {
			next(e)
		}
	}


	static async post(req, res, next) {
		try {
			const signupRes = await UsersService.signupUser(req.body);

			return res.json(Response.defaultResponse(signupRes.data));
		} catch (e) {
			next(e)
		}
	}


	static async put(req, res, next) {
		const { userId } = req.params;
		const { data: { users: [user] } } = await UsersService.getUserByID(userId);

		try {
			const whitelistedFields = _.pick(req.body, [
				"displayName",
				"username",
				"fullName",
				"email",
				"password",
				"profilePicture"
			]);

			const { data: { users } } = await UsersService.updateUser(whitelistedFields, user);

			res.json(Response.defaultResponse({ users }));
		} catch (e) {
			next(e);
		}
	}


	static async delete(req, res, next) {
		const { userId } = req.params;
		const { user } = res.locals;

		try {
			if (user.id !== parseInt(userId)) {
				throw new RandomError("Not allowed to delete this user");
			}
			await UsersService.deleteUser(userId);

			res.sendStatus(200);
		} catch (e) {
			next(e);
		}
	}

	static async postApproval(req, res, next) {
		const { userId } = req.params;

		try {
			await UsersService.approveUser(userId);

			res.sendStatus(200);
		} catch (e) {
			next(e);
		}
	}
}
