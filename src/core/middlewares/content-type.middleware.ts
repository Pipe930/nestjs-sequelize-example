import { Injectable, NestMiddleware, UnsupportedMediaTypeException } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {

    const contentType = req.headers['content-type'];

    if(!contentType || !contentType.includes('application/json')) throw new UnsupportedMediaTypeException("El servidor solo acepta contenido en formato JSON");

    next();
  }
}
