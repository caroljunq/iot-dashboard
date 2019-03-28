import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { DashUser, StoredUser } from './user-models';

export const ACL = {
  anom: {
    view: 'fake',
    login: '*',
  },
  guest: {
    view: 'fake',
  },
  user: {
    view: '*',
  },
  admin: {
    parent: 'user',
    create: '*',
    edit: '*',
    remove: '*',
  },
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  user$: Observable<DashUser>;
  role$: Observable<string | string[]>;

  constructor(
    protected angularFireDatabase: AngularFireDatabase,
    protected angularFireAuth: AngularFireAuth,
    protected router: Router,
  ) {
    this.user$ = this.angularFireAuth.authState.pipe(
      // tap(v => console.log('[UsersService] authState', v)),
      switchMap((authUser: firebase.User) => {
        if (!authUser) {
          return of(null);
        }
        return this.angularFireDatabase.object(`users/${authUser.uid}`).valueChanges().pipe(
          map((storedUser: StoredUser) => ({
            storedUser,
            authUser,
          })),
        );
      }),
      distinctUntilChanged(),
      // tap(v => console.log('[UsersService] user$', v)),
      shareReplay(1),
    );
    this.role$ = this.user$.pipe(
      map(user => {
        if (!user) {
          return 'anom';
        }
        if (user.storedUser.isAdmin) {
          return 'admin';
        }
        if (user.storedUser.isValid) {
          return 'user';
        }
        return 'guest';
      }),
    );
  }

  getUser(id: string): Observable<StoredUser> {
    return this.angularFireDatabase.object<StoredUser>(`users/${id}`).valueChanges();
  }
  getRole(): Observable<string | string[]> {
    return this.role$;
  }

  googleLogin() {
    return this.oAuthLogin(new auth.GoogleAuthProvider());
  }

  protected async oAuthLogin(provider: auth.AuthProvider): Promise<void> {
    try {
      const credential = await this.angularFireAuth.auth.signInWithPopup(provider);
      const baseStoreUser: StoredUser = {
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: credential.user.displayName,
        photoURL: credential.user.photoURL,
      };
      const userRef = this.angularFireDatabase.object<StoredUser>(`users/${credential.user.uid}`);
      const storedUser = await userRef.valueChanges().toPromise();
      if (storedUser) {
        await userRef.update(baseStoreUser);
      } else {
        await userRef.set({
          ...baseStoreUser,
          isAdmin: false,
          isValid: false,
        });
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject();
    } finally {
      // console.log('[UsersService] End oAuthLogin');
    }
  }

  updateUser(user: StoredUser): Promise<void> {
    // Sets user data to firestore on login
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userRef = this.angularFireDatabase.object<StoredUser>(`users/${user.uid}`);
    return userRef.update(user);
  }

  signOut() {
    this.angularFireAuth.auth.signOut().then(() => this.router.navigate(['/']));
  }
}
