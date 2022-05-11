import express from 'express';
import cors from 'cors';
import _ from 'lodash';
import bodyParser from "body-parser";
import { requestLogger, responseLogger } from './request-logger';
import { RandomError } from '../../features/global/helpers/errors';

export function routeNotFoundMiddleware(app) {
    app.use((req, res, next) => {
        const error = new RandomError("Route Not Found");
        error.status = 404;
        return next(error);
    });
}


export default function setupRandomMiddlewares(app) {
    app.use(express.json()); // accepts json body
    app.use(bodyParser.text());
    app.use(requestLogger());
    app.use(responseLogger());
    app.use(cors());
}