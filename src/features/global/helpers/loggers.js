import winston from "winston";
import config from "../../../core/config";
const { createLogger, format, transports } = winston;
const { env, appConfig } = config;

const logger = createLogger({});

if (env === 'development' || env === 'production') {
  logger.add(new transports.Console({
    level: 'debug',
    format: format.combine(
      format.errors({ stack: true }),
      format.splat(),
      format.colorize(),
      format.simple()
    )
  }));
} else if (env === "test") {
  logger.add(new transports.File({
    filename: './src/testing/logs/testing.log',
    options: { flags: 'w' },
    level: 'debug',
    format: format.combine(
      format.errors({ stack: true }),
      format.splat(),
      format.colorize(),
      format.simple()
    )
  }));
} 

logger.stream = {
  write: function (message, encoding) {
    /*
      Morgan adds a newline in the end of the stream.
      That's why we remove the last character from the message
      More Info:
      https://stackoverflow.com/questions/40602106/how-to-remove-empty-lines-that-are-being-generated-in-a-log-file-from-morgan-log
    */
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
};


export { logger }
