'use strict';

const bcrypt = require("bcryptjs");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const password = bcrypt.hashSync("Awesometoken#@1", 8);

    const admin = {
      role: "admin",
      email: "admin-1@test.com",
      password: password,
      fullName: "",
      username: "",
      displayName: "",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return queryInterface.bulkInsert('users', [
      admin
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
