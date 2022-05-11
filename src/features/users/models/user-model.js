import Sequelize, { Model } from "sequelize";


export default class UserModel extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        role: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: Sequelize.STRING,
        password: {
          type: Sequelize.STRING,
          select: false
        },
        username: Sequelize.STRING,
        profilePicture: Sequelize.STRING,
        fullName: Sequelize.STRING,
        displayName: Sequelize.STRING,
        approved: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        emailVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        emailVerificationToken: {
          type: Sequelize.STRING,
          select: false
        },
        passwordResetToken: {
          type: Sequelize.STRING,
          select: false
        }
      },
      {
        modelName: "User",
        tableName: "users",
        sequelize
      }
    );
  }

  toJSON() {
    const user = Object.assign({}, this.dataValues);

    delete user.password;
    delete user.emailVerificationToken;
    delete user.passwordResetToken;
    return user;
  }
}

