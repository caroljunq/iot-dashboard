import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { DashUser, StoredUser } from './user-models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  user$: Observable<DashUser>;

  constructor(
    protected angularFireDatabase: AngularFireDatabase,
    protected angularFireAuth: AngularFireAuth,
    private router: Router,
  ) {
    //// Get auth data, then get firestore user document || null
    this.user$ = this.getUser();
  }

  private getUser(): Observable<DashUser> {
    return this.angularFireAuth.authState.pipe(switchMap((authUser: firebase.User) => {
        if (!authUser) {
          return of(null);
        }
        // return this.afs.doc<DashUser>(`users/${user.uid}`).valueChanges()
        return this.angularFireDatabase.object(`users/${authUser.uid}`).valueChanges().pipe(
          map((storedUser: StoredUser) => ({
            storedUser,
            authUser,
          })),
        );
      }),
    );
  }

  googleLogin() {
    return this.oAuthLogin(new auth.GoogleAuthProvider());
  }

  private oAuthLogin(provider: auth.AuthProvider): Promise<void> {
    return this.angularFireAuth.auth.signInWithPopup(provider).then((credential) => {
      const userRef = this.angularFireDatabase.object<StoredUser>(`users/${credential.user.uid}`);

      const data: StoredUser = {
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName,
        photoURL: credential.user.photoURL,
      };

      return userRef.set(data);
    });
  }

  updateUserData(user: DashUser): Promise<void> {
    // Sets user data to firestore on login
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userRef = this.angularFireDatabase.object(`users/${user.authUser.uid}`);
    return userRef.update(user.storedUser);
  }

  signOut() {
    this.angularFireAuth.auth.signOut().then(() => this.router.navigate(['/']));
  }
}
