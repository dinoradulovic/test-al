'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			role: {
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING
			},
			password: {
				type: Sequelize.STRING
			},
			profilePicture: {
				type: Sequelize.STRING
			},
			fullName: {
				type: Sequelize.STRING
			},
			username: {
				type: Sequelize.STRING
			},
			displayName: {
				type: Sequelize.STRING
			},
			approved: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			emailVerified: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			emailVerificationToken: Sequelize.STRING,
			passwordResetToken: Sequelize.STRING,
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('users');
	}
};
