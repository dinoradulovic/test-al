import config from "../../core/config";
const { databaseConfig } = config;
import Sequelize from "sequelize";


export const development = {
  database: databaseConfig.name,
  username: databaseConfig.username,
  password: databaseConfig.password,
  host: databaseConfig.host,
  dialect: databaseConfig.dialect,
  "operatorsAliases": Sequelize.Op
}

export const test = {
  database: databaseConfig.name,
  username: databaseConfig.username,
  password: databaseConfig.password,
  host: databaseConfig.host,
  dialect: databaseConfig.dialect,
  "operatorsAliases": Sequelize.Op
}

export const staging = {
  database: databaseConfig.name,
  username: databaseConfig.username,
  password: databaseConfig.password,
  host: databaseConfig.host,
  dialect: databaseConfig.dialect,
  "operatorsAliases": Sequelize.Op
}

export const production = {
  database: databaseConfig.name,
  username: databaseConfig.username,
  password: databaseConfig.password,
  host: databaseConfig.host,
  dialect: databaseConfig.dialect,
  "operatorsAliases": Sequelize.Op
}
