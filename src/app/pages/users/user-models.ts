import { AngularFireAuth } from '@angular/fire/auth';

export interface DashUser {
  storedUser: StoredUser;
  authUser: firebase.User;
}

export interface StoredUser {
  uid: string;
  displayName: string;
  photoURL: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
}