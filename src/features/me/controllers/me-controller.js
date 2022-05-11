import _ from "lodash";
import Response from '../../global/helpers/response-helper';
import UsersService from '../../users/services/users-service';
import UploadService from "../../uploads/services/upload-service";

export default class MeController {
	static async get(req, res, next) {
		const { user } = res.locals;

		res.json(Response.defaultResponse({ users: [user] }));
	}

	static async put(req, res, next) {
		const { user } = res.locals;

		try {
			const upload = await UploadService.prepareProfilePicUpload(user.id);
			await upload(req, res);

			const updateParams = req.body;
			if (req.file) updateParams.profilePicture = req.file.location;

			const whitelistedFields = _.pick(req.body, [
				"displayName",
				"username",
				"fullName",
				"email",
				"password",
				"profilePicture"
			]);

			const updatedUserRes = await UsersService.updateUser(whitelistedFields, user);

			if (updatedUserRes.hasErrors) next(updatedUserRes.error);
			else res.json(Response.defaultResponse({ users: updatedUserRes.data.users }));

		} catch (e) {
			next(e);
		}
	}
}
