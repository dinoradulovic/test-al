import UsersService from '../features/users/services/users-service';

class Authenticator {
  static async createSession(email, password) {
    const session = new Authenticator(email);
    await session.authenticate(email, password);
    return session;
  }

  constructor(email) {
    this.jwt = "";
    this.user = {};
    this.name = email;
  }

  async authenticate(email, password) {
    const loginRes = await UsersService.loginUser(email, password);
    this.jwt = loginRes.data.token;
    this.user = loginRes.data.users[0];
  }

  static async createUser({ email, password, role, fullName }) {
    const session = new Authenticator(email);
    await session.signup(email, password, role, fullName);
    return session;
  }

  async signup(email, password, role, fullName) {
    const signupRes = await UsersService.signupUser({ email, password, role, fullName });

    this.jwt = signupRes.data.token;
    this.user = signupRes.data.users[0];
  }

  logOut() {
    UserSessions.logOut(this.name);
  }
}


export let loggedInUsers = {}


export class UserSessions {
  static async logoutAll() {
    loggedInUsers = {};
  }

  static getUser(email) {
    return loggedInUsers[email];
  }

  static async login(email, password) {
    const session = await Authenticator.createSession(email, password);

    loggedInUsers[email] = session;
    return session;
  }

  static async signupAndLogin(userParams) {
    const session = await Authenticator.createUser(userParams);

    loggedInUsers[session.user.email] = session.user;
    return session;
  }


  static logOut(name) {
    if (!loggedInUsers[name]) {
      throw new Error("User not logged in");
    }

    delete loggedInUsers[name];
    return true;
  }
}
