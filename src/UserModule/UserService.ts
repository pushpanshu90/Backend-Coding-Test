import { Injectable, HttpStatus } from '@nestjs/common';
import { Users } from '../Models/UserModel';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { APIResponse } from '../Common/APIResponse';
import { initializeApp } from 'src/Common/InitializeFirebaseApp';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>) {}

  async addUser(body): Promise<object> {
    try {
      console.log(body);
      checkInitialConditions(body);
      const user = addInitialValues(body);
      await this.userRepo.save(user);
      const savedUserValue = await this.userRepo.save(user);
      return APIResponse(true, savedUserValue);
    } catch (err) {
      //return err;
      return APIResponse(false, err.message);
    }
  }
  async createUserFirebase(body): Promise<object> {
    try {
      const { displayName, password, email, role, dob } = body;
      if (!displayName || !password || !email || !role || !dob) {
        return new Error('Missing Field');
      }
      const { uid } = await admin.auth().createUser({
        displayName,
        password,
        email,
      });
      await admin.auth().setCustomUserClaims(uid, { role });
      const result = await this.addUser(body);
      return result;
    } catch (err) {
      return err.message;
    }
  }
  async loginUser(body): Promise<object> {
    try {
      const email = body.email;
      const password = body.password;
      const currentUser = firebase.auth().currentUser;
      if (firebase.apps.length === 0) await initializeApp();

      if (currentUser) {
        console.log('Signing out');
        await firebase.auth().signOut();
      }
      console.log(`Email: ${email}`);
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const tokenResponse = {
        token: await user.user.getIdToken(),
      };
      return APIResponse(true, tokenResponse);
    } catch (err) {
      return APIResponse(false, `Wrong Creds : ${err.message}`);
    }
  }
}

function addInitialValues(body): Users {
  const user = new Users();
  user.setDob(body.dob);
  user.setName(body.displayName);
  user.setMetadata(body.role);
  return user;
}

function checkInitialConditions(body): void {
  const momentfunction = moment(body.dob, 'DD/MM/YYYY', true);
  if (!body) {
    throw new Error('User data empty');
  }

  if (
    !body.displayName &&
    typeof body.displayName === 'string' &&
    body.displayName.length >= 100
  ) {
    throw new Error('User must have a name and shoulb be in a proper format');
  }

  if (!(body.dob && momentfunction.isValid())) {
    throw new Error('User should have dob');
  }
}
