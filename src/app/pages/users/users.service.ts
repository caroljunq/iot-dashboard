import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap, shareReplay, distinctUntilChanged, take, startWith } from 'rxjs/operators';
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
    edit: 'user',
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
        if (user.storedUser.isActive) {
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

  async emailUserCreate(rawUser: {email: string, password: string, fullName: string}): Promise<DashUser> {
    try {
      const credential: auth.UserCredential =
      await this.angularFireAuth.auth.createUserWithEmailAndPassword(rawUser.email, rawUser.password);
      const user: StoredUser = {
        uid: credential.user.uid,
        displayName: rawUser.fullName,
        email: rawUser.email,
        photoURL: null,
      };
      await this.createUser(user);
      setTimeout(
        // wait 10ms for user$ to reach AuthGuard
        () => this.router.navigate(['/']),
        10,
      );
      return Promise.resolve(await this.getUserFormCredential(credential));
    } catch (e) {
      console.error('[UsersService.login]', e);
      return Promise.reject();
    }
  }

  googleLogin(): Promise<DashUser> {
    return this.login(
      () => this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()),
    );
  }
  emailLogin(email: string, password: string): Promise<DashUser> {
    return this.login(
      () => this.angularFireAuth.auth.signInWithEmailAndPassword(email, password),
    );
  }
  protected async login(credentialFn: () => Promise<auth.UserCredential>): Promise<DashUser> {
    try {
      const credential: auth.UserCredential = await credentialFn();
      const user = await this.getUserFormCredential(credential);
      setTimeout(
        // wait 10ms for user$ to reach AuthGuard
        () => this.router.navigate(['/']),
        10,
      );
      return Promise.resolve(user);
    } catch (e) {
      console.error('[UsersService.login]', e);
      return Promise.reject();
    }
  }

  protected async getUserFormCredential(credential: auth.UserCredential): Promise<DashUser> {
    const storedUser = await this.getUser(credential.user.uid).pipe(take(1)).toPromise();
    const authUser: firebase.User = credential.user;
    if (!storedUser) {
      await this.createUser({
        uid: credential.user.uid,
        displayName: credential.user.displayName,
        photoURL: credential.user.photoURL,
        email: credential.user.email,
        isAdmin: false,
        isActive: false,
      });
    }
    return Promise.resolve({storedUser, authUser});
  }

  createUser(user: StoredUser): Promise<void> {
    const userRef = this.angularFireDatabase.object<StoredUser>(`users/${user.uid}`);
    return userRef.set(user);
  }
  updateUser(user: StoredUser): Promise<void> {
    // const allowedFields = [ 'uid', 'displayName', 'photoURL', 'name', 'email', 'isActive', 'isAdmin'];
    // user = <StoredUser>Object.entries(user).map(
    //   i => ({k: i[0], v: i[1]}),
    // ).filter(
    //   i => allowedFields.includes(i.k)
    // ).reduce(
    //   (acc, i) => ({...acc, [i.k]: i.v}),
    //   {},
    // );
    user = {
      'uid': user.uid || '',
      'displayName': user.displayName || '',
      'photoURL': user.photoURL || '',
      'email': user.email || '',
      'isActive': user.isActive || false,
      'isAdmin': user.isAdmin || false,
    };
    const userRef = this.angularFireDatabase.object<StoredUser>(`users/${user.uid}`);
    return userRef.update(user);
  }

  signOut() {
    this.angularFireAuth.auth.signOut().then(() => this.router.navigate(['/']));
  }

  getUsersList(): Observable<StoredUser[]> {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        if (!user.storedUser.isAdmin) {
          return of([user.storedUser]);
        }
        return this.angularFireDatabase.list<StoredUser>(`users`).valueChanges().pipe(
          map(
            list => list.map(item => ({
              ...item,
              isCurrentUser: item.uid === user.storedUser.uid,
            })).sort((a, b) => {
              if (a.isCurrentUser) return -1;
              if (b.isCurrentUser) return 1;
              if (a.isActive && !b.isActive) return -1;
              if (!a.isActive && b.isActive) return 1;
              return a.displayName.localeCompare(b.displayName);
            }),
          ),
          startWith([user.storedUser]),
        );
      }),
    );
  }
}
