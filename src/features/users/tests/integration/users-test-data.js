export const TESTS = {
	SHOULD_SIGNUP_USER: "should signup user",
	SHOULD_RETURN_USER_ALREADY_EXIST_ERROR: "should return error if user already exist",
	SHOULD_RETURN_USER: "should return existing user",
	SHOULD_UPDATE_USER: "should update user",
	SHOULD_DELETE_USER: "should delete user",
	SHOULD_NOT_ALLOW_TO_DELETE_OTHER_USERS: "should not allow to delete other users"
}

export const TEST_DATA = {
	[TESTS.SHOULD_SIGNUP_USER]: [
		{
			role: "creator",
			email: "user-0@test.com",
			password: "user-0-password",
			fullName: "John Smith"
		}
	],
	[TESTS.SHOULD_RETURN_USER_ALREADY_EXIST_ERROR]: [
		{
			role: "creator",
			email: "user-1@test.com",
			password: "user-1-password",
			fullName: "John Smith"
		}
	],
	[TESTS.SHOULD_RETURN_USER]: [
		{
			role: "admin",
			email: "user-1@test.com",
			password: "user-1-password",
			fullName: "John Smith"
		}
	],
	[TESTS.SHOULD_UPDATE_USER]: [
		{
			role: "admin",
			email: "user-1@test.com",
			password: "user-1-password",
			fullName: "John Smith"
		},
		{
			fullName: "Adam Smith"
		}
	],
	[TESTS.SHOULD_DELETE_USER]: [
		{
			role: "admin",
			email: "user-1@test.com",
			password: "user-1-password",
			fullName: "John Smith"
		},
		{
			email: "user-2@test.com",
			password: "user-2-password"
		}
	]
}
