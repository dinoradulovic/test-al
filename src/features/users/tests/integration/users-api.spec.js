import { TESTS, TEST_DATA } from "./users-test-data";
import { testGet, testPost, testPut, testDelete } from '../../../../testing/assert-request-helpers';
import { UserSessions } from "../../../../testing/auth-test-helpers";
import { responseData } from "./users-response-structure";
import db from "../../../../db/init-db-connection";

const {
	SHOULD_SIGNUP_USER,
	SHOULD_RETURN_USER_ALREADY_EXIST_ERROR,
	SHOULD_RETURN_USER,
	SHOULD_UPDATE_USER,
	SHOULD_DELETE_USER
} = TESTS;

describe('Resource ** users **', function () {
	describe('POST /users', function () {
		it(SHOULD_SIGNUP_USER, async function () {
			const res = await testPost({
				route: '/users',
				body: TEST_DATA[SHOULD_SIGNUP_USER][0],
				validateResResources: { users: Array.from(responseData) }
			});

			res.body.data.should.have.property('users');
		});

		it(SHOULD_RETURN_USER_ALREADY_EXIST_ERROR, async function () {
			await UserSessions.signupAndLogin(TEST_DATA[SHOULD_RETURN_USER_ALREADY_EXIST_ERROR][0]);

			const res = await testPost({
				route: '/users',
				body: TEST_DATA[SHOULD_RETURN_USER_ALREADY_EXIST_ERROR][0],
				status: 500
			});

			res.body.data.should.be.empty;
			res.body.hasErrors.should.be.true;
			res.body.error.errorMessage.should.equal("Database Error: User already exist.");
		});

		after(async function () {
			await db.User.destroy({ truncate: true, restartIdentity: true, cascade: true });
		});
	});

	describe('GET /users/:id', function () {
		it(SHOULD_RETURN_USER, async function () {
			const { user, jwt } = await UserSessions.signupAndLogin(TEST_DATA[SHOULD_RETURN_USER][0]);

			await testGet({
				route: `/users/${user.id}`,
				jwt,
				validateResResources: { users: Array.from(responseData) }
			});
		});
		after(async function () {
			await db.User.destroy({ truncate: true, restartIdentity: true, cascade: true });
		});
	})

	describe('PUT /users/:id', function () {
		it(SHOULD_UPDATE_USER, async function () {
			const { user, jwt } = await UserSessions.signupAndLogin(TEST_DATA[SHOULD_UPDATE_USER][0]);

			const { body: { data: { users: [updatedUser] } } } = await testPut({
				route: `/users/${user.id}`,
				body: TEST_DATA[SHOULD_UPDATE_USER][1],
				jwt
			});

			updatedUser.fullName.should.not.be.equal(user.fullName);
		})
		after(async function () {
			await db.User.destroy({ truncate: true, restartIdentity: true, cascade: true });
		});
	});

	describe('DELETE /users/:id', function () {
		it(SHOULD_DELETE_USER, async function () {
			const { user: { id: userId }, jwt } = await UserSessions.signupAndLogin(TEST_DATA[SHOULD_DELETE_USER][0]);

			await testDelete({
				route: `/users/${userId}`,
				jwt
			});

			const res = await testPost({
				route: '/user-sessions',
				body: TEST_DATA[SHOULD_DELETE_USER][1],
				status: 500
			});

			res.body.error.errorMessage.should.equal("DatabaseError: User not found");
		});

		after(async function () {
			await db.User.destroy({ truncate: true, restartIdentity: true, cascade: true });
		});
	});

	after(async function () {
		await db.User.destroy({ truncate: true, restartIdentity: true, cascade: true });
	});
})
