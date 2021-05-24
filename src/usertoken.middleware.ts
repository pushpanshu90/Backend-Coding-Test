import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import firebase from 'firebase';
import { initializeApp } from './Common/InitializeFirebaseApp';

@Injectable()
export class UserTokenMiddleWare implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (firebase.apps.length === 0) {
        await initializeApp();
      }
      let token = req.headers.authorization;
      token = new String(req.headers.authorization).split(' ')[1];
      const verifiedToken = await admin.auth().verifyIdToken(token);
      console.log(verifiedToken);
      if (!(verifiedToken.role === 'admin' || verifiedToken.role === 'user')) {
        throw new Error('Nor an admin or a User');
      }
      next();
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `Error: ${err.message}`,
        },
        401,
      );
    }
  }
}
