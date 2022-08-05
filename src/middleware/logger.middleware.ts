import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl, body, query } = request;
      const { statusCode, statusMessage } = response;
      const bodyString = JSON.stringify(body);
      const queryString = JSON.stringify(query);

      const message = `${method} ${originalUrl} ${bodyString} ${queryString} ${statusCode} ${statusMessage}}`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });

    next();
  }
}
