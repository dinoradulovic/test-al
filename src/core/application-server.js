import express from "express";
import http from "http";

import { logger } from "../features/global/helpers/loggers";
import { setupRouting } from "./routing/routes";
import setupRandomMiddlewares, { routeNotFoundMiddleware } from "./middlewares/random-middlewares";
import setupGlobalErrorHandler from "./middlewares/global-error-handler";

export default class ApplicationServer {
  constructor(port, onDone) {
    const app = express();
    this.onDone = onDone;

    app.set('port', port); // Set port
    this.port = port;

    //  Setup middlewares per request
    //  
    //   |
    //   |
    //   |
    //   |
    //   |
    //   V
    //
    setupRandomMiddlewares(app);
    setupRouting(app); // router-level middlewares
    routeNotFoundMiddleware(app);
    setupGlobalErrorHandler(app);

    this.server = http.createServer(app); // Create HTTP server.
    this.server.listen(port); // Listen on provided port, on all network interfaces.
    this.server.on('error', (e) => this.onError(e));
    this.server.on('listening', () => this.onListening());
  }

  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    logger.error("HTTP Server Error");

    var bind = typeof this.port === 'string'
      ? 'Pipe ' + this.port
      : 'Port ' + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'ECONNREFUSED':
        logger.error("ECONNREFUSED thrown");
        process.exit(1);
        break;
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  onListening() {
    var addr = this.server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    logger.info(`Application Server Listening on ${bind}`);
    this.onDone();
  }
}