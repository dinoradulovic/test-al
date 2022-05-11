/**
 * Handle 404 errors
 * https://expressjs.com/en/starter/faq.html [How do I handle 404 responses?]
*/
import chalk from "chalk";
import boxen from "boxen";
import config from "../../core/config";
import { logger } from "../../features/global/helpers/loggers";
import Response from "../../features/global/helpers/response-helper";
const { env } = config;

function logError(err) {
    if (env === 'development') {
        logger.error("err", err)

        logger.error(boxen('Handled inside the Global Error Handler:',
            { padding: 1, margin: 1, borderStyle: "double", borderColor: "red" }));
        logger.error("Error Name: ");
        logger.error(chalk.red(err.name));
        logger.error("Error type description: ");
        logger.error(chalk.red(err.message));
        logger.error("Our stack trace: ");
        logger.error(err.stack + "\n");
    } else if (env === 'production' || env === 'staging') {
        logger.error("Yo, one of our own Error has been thrown!!!", {
            errorName: err.name,
            errorTypeDescription: err.message,
            ourStackTrace: err.stack
        });
    }
}

function handleNativeError(err) {
    const nativeJsErrorTypes = [EvalError, RangeError, ReferenceError, SyntaxError, URIError, TypeError];
    const isNativeJsError = nativeJsErrorTypes.some((errType) => {
        return err instanceof errType;
    });

    if (isNativeJsError) {
        err.status = 500;
    }
}

export default function setupGlobalErrorHandler(app) {
    app.use((err, req, res, next) => {
        handleNativeError(err);
        res.status(err.status || 500);
        logError(err);
        res.json(Response.defaultError(err));
    });
}