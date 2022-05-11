import config from "../core/config";
import ApplicationServer from '../core/application-server';
import DatabaseServer from '../core/database-server';
import { normalizePort } from '../features/global/helpers/misc-helpers';
import { logger } from "../features/global/helpers/loggers";

const { databaseConfig, appConfig, env } = config;

function connectToDB({ databaseConfig }) {
  return new Promise((resolve, reject) => {
    function onConnectionsSuccess() {
      resolve();
    }

    console.log("DID WE GET IT ",
      databaseConfig.name,
      databaseConfig.username,
      databaseConfig.password,
      databaseConfig.host,
      databaseConfig.dialect)

    new DatabaseServer({
      database: databaseConfig.name,
      username: databaseConfig.username,
      password: databaseConfig.password,
      host: databaseConfig.host,
      dialect: databaseConfig.dialect
    }, onConnectionsSuccess);
  });
};


function createAPPserver({ appConfig }) {
  return new Promise((resolve, reject) => {
    function onAPPServerCreated() {
      resolve();
    }

    var port = normalizePort(appConfig.port);
    new ApplicationServer(port, onAPPServerCreated);
  });
}

export function init() {
  try {
    return new Promise(async (resolve, reject) => {
      await connectToDB({ databaseConfig });
      await createAPPserver({ appConfig });
      resolve();
    });

  } catch (err) {
    logger.error("Problem while initializing the app...", err.message);
  }
}
