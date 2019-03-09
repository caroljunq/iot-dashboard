import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  sites: String[] = ['site-key'];

  constructor(
    private angularFireDatabase: AngularFireDatabase,
  ) {
    console.log('init AngularFireDatabase');
    const list = angularFireDatabase.object('/').valueChanges();
    list.subscribe(
      (val) => console.log({val}),
      (err) => console.error(err),
      () => console.log('complete'),
    );
  }
}
