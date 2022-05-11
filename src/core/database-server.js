import db, { SequelizeConnection } from "../db/init-db-connection";
import { logger } from "../features/global/helpers/loggers";

export default class DatabaseServer {
  constructor(options, onDone) {
    this.connect(options)
    this.onDone = onDone;
  }

  async testConnection() {
    return await db.sequelize.authenticate();
  }

  async connect(config) {
    try {
      
      const seqeulizeConnection = new SequelizeConnection(
        config.database,
        config.username,
        config.password, {
          // host and dialect are required as a third argument when initializing Sequelize
          host: config.host,
          dialect: config.dialect,
          pool: {
            max: 30,
            min: 0,
            acquire: 30000,
            idle: 10000
          },
          operatorsAliases: false, // to prevent deprecation warning logging when initializing 
          logging: function (str) {
            logger.debug("Sequalize " + str);
          }
        });



      seqeulizeConnection.setupModels();
      await this.testConnection();

      logger.info('Testing database connection success. Database is successfully connected');
      this.onDone();
    } catch (err) {
      
      logger.error("Error connecting to database: ", err);
    }
  }
}
