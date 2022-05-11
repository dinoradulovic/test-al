import bcrypt from 'bcryptjs';
import _ from "lodash";
import crypto from "crypto";
import { differenceInMilliseconds, parseISO, addDays } from 'date-fns'
import db from '../../../db/init-db-connection';
import Response from '../../global/helpers/response-helper';
import { RandomError } from '../../global/helpers/errors';
import UserSessionsService from '../../user-sessions/services/users-sessions-service';
import ORM from '../../global/helpers/orm';
import MailService from '../../email/services/mail-service';

// TODO move to datetime lib
function tokenExpired(userCreatedDate) {
	const expirationDay = addDays(new Date(userCreatedDate), 5);

	var diff = differenceInMilliseconds(new Date(), expirationDay);
	return diff >= 0;
}

export default class UsersService {
	static async getUsers() {
		try {
			const users = await ORM.findAll("User", { order: [['id', 'DESC']] });

			return Response.defaultResponse({ users });;
		} catch (e) {
			return Response.defaultError(e);
		}
	}

	static async getUserByID(userId) {
		const users = await ORM.findAll("User", {
			where: { id: userId }
		});

		if (!users.length) {
			throw new RandomError("DatabaseError: User not found");
		}

		return Response.defaultResponse({ users });;
	}

	static async getUserByToken(token) {
		const jwtPayload = await UserSessionsService.decodeToken(token);
		const user = await UsersService.findUserById(jwtPayload.id);

		return Response.defaultResponse({ user });
	}

	static async isUserNameAvailable(username) {
		const users = await ORM.findAll("User", { where: { username } });

		if (users.length) return false;

		return true;
	}

	static async generateUsername(fullName) {
		const fullNameTrimmed = fullName.replace(/\s/g, "");
		const username = fullNameTrimmed;
		while (!await UsersService.isUserNameAvailable(username)) {
			// https://www.codegrepper.com/code-examples/javascript/generate+unique+username+in+JavaScript
			username = fullNameTrimmed + '_' + Math.random().toString(36).substr(2, 9);
		};

		return username.toLowerCase();
	}

	static async findOrCreate(userParams) {
		let { role, email, password, fullName } = userParams;

		const hashedPassword = bcrypt.hashSync(password, 8);
		const emailVerificationToken = crypto.randomBytes(32).toString("hex");

		const fieldsToFindBy = { email };
		const fieldsToAdd = {
			role,
			emailVerificationToken,
			password: hashedPassword
		};

		if (role === "creator") {
			fieldsToAdd.fullName = fullName;
			fieldsToAdd.username = await UsersService.generateUsername(fullName);
		}

		const [user, created] = await ORM.findOrCreate("User", fieldsToFindBy, fieldsToAdd);

		if (!created) {
			throw new RandomError('Database Error: User already exist.');
		}

		// await MailService.sendVerificationEmail({
		// 	to: email,
		// 	emailVerificationToken,
		// 	userId: user.id
		// });

		return user;
	}

	static async findUserById(userId) {
		const users = await ORM.findAll("User", { where: { id: userId } });

		if (!users.length) {
			throw new RandomError("That user doesn't exist");
		}

		return users[0];
	}

	static async signupUser(userParams) {
		const user = await UsersService.findOrCreate(userParams);
		const token = await UserSessionsService.createToken(user.id);

		return Response.defaultResponse({
			token,
			users: [user]
		});
	}

	static async loginUser(email, password) {
		let user = await db.User.findOne({ where: { email } });
		if (!user) throw new RandomError('DatabaseError: User not found');

		const passwordIsValid = bcrypt.compareSync(password, user.password);
		if (!passwordIsValid) throw new RandomError('DatabaseError: Incorrect password');

		if (!user.emailVerified) throw new RandomError('Email not verified');

		const token = await UserSessionsService.createToken(user.id);

		return Response.defaultResponse({
			token,
			users: [user.toJSON()]
		});
	}

	static async updateUser(updateParams, user) {
		const { id, role: userType, } = user;

		if (updateParams.password) {
			updateParams.password = bcrypt.hashSync(updateParams.password, 8);
		}

		if (userType === "creator" && updateParams.username) {
			if (!await UsersService.isUserNameAvailable(updateParams.username)) {
				throw new RandomError("Validation Error: 'Username is taken.'");
			};
		};

		const updatedUser = await ORM.update("User", {
			where: { id },
			fields: updateParams
		});

		return Response.defaultResponse({ users: [updatedUser] });
	}

	static async deleteUser(userId) {
		await ORM.delete("User", userId);

		return Response.defaultResponse({});
	}

	static async verifyEmail({ emailVerificationToken }) {
		const [user] = await db["User"].findAll({
			where: {
				emailVerificationToken
			}
		});

		if (!user) throw new RandomError('DatabaseError: User not found');

		const tokenIsExpired = tokenExpired(user.createdAt);
		if (tokenIsExpired) {
			throw new RandomError('Email verification token has expired');
		}

		user.emailVerificationToken = null;
		user.emailVerified = true;
		user.save();

		return Response.defaultResponse({ users: [user] });
	}

	static async sendResetPasswordEmail({ email }) {
		const [user] = await db["User"].findAll({
			where: {
				email
			}
		});

		if (!user) throw new RandomError('DatabaseError: User not found');

		const passwordResetToken = crypto.randomBytes(32).toString("hex");

		user.passwordResetToken = passwordResetToken;
		user.save();

		await MailService.sendPasswordResetEmail({
			to: email,
			passwordResetToken,
			userId: user.id
		});
	}

	static async updatePasswordUsingToken({ passwordResetToken, password }) {
		const [user] = await db["User"].findAll({
			where: {
				passwordResetToken
			}
		});

		if (!user) throw new RandomError('DatabaseError: User not found');

		user.password = bcrypt.hashSync(password, 8);;
		user.save();
	};

	static async approveUser(userId) {
		const [user] = await db["User"].findAll({
			where: {
				id: userId
			}
		});

		if (!user) throw new RandomError('DatabaseError: User not found');

		user.approved = true;
		user.save();

		return true;
	}
}
