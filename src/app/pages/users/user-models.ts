import { AngularFireAuth } from '@angular/fire/auth';
import { StoredUser } from 'app/@core/iot-dash/iot-dash-models';

export interface DashUser {
  storedUser: StoredUser;
  authUser: firebase.User;
}

export { StoredUser } from 'app/@core/iot-dash/iot-dash-models';
