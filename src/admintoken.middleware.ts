import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import firebase from 'firebase';
import { initializeApp } from './Common/InitializeFirebaseApp';

@Injectable()
export class AdminTokenMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (firebase.apps.length === 0) {
        await initializeApp();
      }
      let req_token = req.headers.authorization;
      const token = new String(req_token).split(' ')[1];
      const verifiedToken = await admin.auth().verifyIdToken(token);
      if (!(verifiedToken.role === 'admin')) {
        throw new Error('Not an admin');
      }
      next();
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `Error : ${err.message}`,
        },
        401,
      );
    }
  }
}
