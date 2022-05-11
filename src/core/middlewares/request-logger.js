import morgan from "morgan";
import chalk from 'chalk';

import { logger } from "../../features/global/helpers/loggers";
import config from "../../core/config";
const { env } = config;

export function requestLogger() {
    return morgan((tokens, req, res) => {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (env === "development" || env === "test") {
            return [
                chalk.hex('#ff4757')('🍄  Incoming Request --> '),
                chalk.hex('#34ace0')(tokens.method(req, res)),
                chalk.hex('#ff5252')(tokens.url(req, res)),
                chalk.hex('#f78fb3')('@ ' + tokens.date(req, res)),
                chalk.yellow(tokens['remote-addr'](req, res)),
                chalk.hex('#fffa65')('from ' + tokens.referrer(req, res)),
                chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
                chalk.hex('#ffb142')("IP address: ", ip)
            ].join(' ');
        } else if (env === "production" || env === "staging") {
            return [
                '🍄  Incoming Request -->',
                tokens.method(req, res),
                tokens.url(req, res),
                '@ ' + tokens.date(req, res),
                tokens['remote-addr'](req, res),
                'from ' + tokens.referrer(req, res),
                tokens['user-agent'](req, res),
                "IP address: ", ip
            ].join(' ');
        }
    }, { immediate: true, "stream": logger.stream });
}


export function responseLogger() {
    return morgan(function (tokens, req, res) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (env === "development" || env === "test") {
            return [
                chalk.hex('#ff4757')('🍄  Request finished -->'),
                chalk.hex('#34ace0')(tokens.method(req, res)),
                chalk.hex('#ffb142')(tokens.status(req, res)),
                chalk.hex('#ff5252')(tokens.url(req, res)),
                chalk.hex('#2ed573')(tokens['response-time'](req, res) + ' ms'),
                chalk.hex('#f78fb3')('@ ' + tokens.date(req, res)),
                chalk.yellow(tokens['remote-addr'](req, res)),
                chalk.hex('#fffa65')('from ' + tokens.referrer(req, res)),
                chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
                chalk.hex('#ffb142')("IP address: ", ip)
            ].join(' ');
        } else if (env === "production" || env === "staging") {
            return [
                '🍄  Request finished -->',
                tokens.method(req, res),
                tokens.status(req, res),
                tokens.url(req, res),
                tokens['response-time'](req, res) + ' ms',
                '@ ' + tokens.date(req, res),
                tokens['remote-addr'](req, res),
                'from ' + tokens.referrer(req, res),
                tokens['user-agent'](req, res),
                "IP address: ", ip
            ].join(' ');
        }
    }, { "stream": logger.stream });
}
