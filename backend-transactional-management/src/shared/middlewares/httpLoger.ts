import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    morgan('combine', {
      stream: { write: (str: string) => Logger.error(str) },
    });
    next();
  }
}