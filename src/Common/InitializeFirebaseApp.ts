import firebase from 'firebase';
import { appConfig } from '../FirebaseConfig/firebase.config';
export async function initializeApp(): Promise<void> {
  console.log('Initializing App ..');

  await firebase.initializeApp({ ...appConfig });
}
