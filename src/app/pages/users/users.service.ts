import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map, tap, shareReplay, distinctUntilChanged, take, startWith } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { NbGlobalLogicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

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

// One-at-a-Time Decorator
function oneAtaTimeFn<V>() {
  let isRunning = false;
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    if (typeof original === 'function') {
      descriptor.value = function(...args): V {
        if (isRunning) {
          throw new Error('Already called');
          // return;
        }
        isRunning = true;
        const result = original.apply(this, args);
        // console.log('Result: ', {propertyKey, key, args, result });
        isRunning = false;
        return result;
      };
    }
    return descriptor;
  };
}

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
    protected toastrService: NbToastrService,
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
        isActive: false,
        isAdmin: false,
      };
      await this.createUser(user);
      setTimeout(
        // wait 10ms for user$ to reach AuthGuard
        () => this.router.navigate(['/']),
        10,
      );
      const dashUser = await this.getUserFormCredential(credential);
      this.showToast('Cadastro Realizado.', 'SUCCESS', NbToastStatus.SUCCESS);
      return Promise.resolve(dashUser);
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
      return Promise.reject(e);
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
  async updateUser(user: StoredUser): Promise<void> {
    try {
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
        uid:          user.uid || '',
        displayName:  user.displayName || '',
        photoURL:     user.photoURL || '',
        email:        user.email || '',
        isActive:     user.isActive || false,
        isAdmin:      user.isAdmin || false,
      };
      const userRef = this.angularFireDatabase.object<StoredUser>(`users/${user.uid}`);
      await userRef.update(user);
      this.showToast('Cadastro Atualizado.', 'Sucesso', NbToastStatus.SUCCESS);
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      this.showToast('Erro ao atualizar cadastro.', 'Erro', NbToastStatus.DANGER);
      return Promise.reject(error);
    }
  }

  signOut() {
    this.angularFireAuth.auth.signOut().then(() => this.router.navigate(['/users/login']));
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
              if (!a) return -1;
              if (!b) return 1;
              if (a.isCurrentUser) return -1;
              if (b.isCurrentUser) return 1;
              if (a.isActive && !b.isActive) return -1;
              if (!a.isActive && b.isActive) return 1;
              if (!a.displayName) return -1;
              if (!b.displayName) return 1;
              return a.displayName.localeCompare(b.displayName);
            }),
          ),
          startWith([user.storedUser]),
        );
      }),
    );
  }

  async emailForgotPassword(email: string): Promise<void> {
    await this.angularFireAuth.auth.sendPasswordResetEmail(email/*, actionCodeSettings*/);
    this.showToast('Email enviado.', 'SUCCESS', NbToastStatus.SUCCESS);
    return Promise.resolve();
  }

  showToast(message: string, title: string, status: NbToastStatus) {
    // toast config
    const destroyByClick = false;
    const duration = 4000;
    const hasIcon = true;
    const position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;
    const preventDuplicates = false;
    const config = {
      status: status,
      destroyByClick: destroyByClick,
      duration: duration,
      hasIcon: hasIcon,
      position: position,
      preventDuplicates: preventDuplicates,
    };
    this.toastrService.show(message, title, config);
  }
}
