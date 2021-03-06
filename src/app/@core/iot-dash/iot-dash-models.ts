export interface StoredUser {
  uid: string;
  isActive: boolean;
  isAdmin: boolean;
  name?: string;
  // google auth
  displayName: string;
  photoURL?: string;
  // email auth
  email?: string;
  // internal
  isCurrentUser?: boolean;
  color?: string;
}

export interface TimedValue<T> {
  key?: string;
  value: T;
  timestamp: number;
}
export interface Device {
  key: string;
  name: string;
  isActor: boolean;
  isActive: boolean;
  // ------ SENSOR -------
  // Umidade: 20 - 80
  // Temperatura: 15 - 25
  type: string | 'Temperatura' | 'Umidade';
  unit: string | 'ºC' | '%';
  max: number;
  min: number;
}
export interface Site {
  key: string;
  name: string;
  devices: {[key: string]: string};
}
export interface UserSite {
  [userUid: string]: {
    [siteKey: string]: string,
  };
}

export interface UserSites {
  [userUid: string]: {
    [siteKey: string]: string,
  };
}

export interface RootData {
  users: {[key: string]: StoredUser};
  devices: {[key: string]: Device};
  deviceData: {[deviceKey: string]: {[key: string]: TimedValue<number>}};
  sites: {[key: string]: Site};
  userSites: UserSites;
}
export enum ROOT_DATA {
  users = 'users',
  devices = 'devices',
  deviceData = 'deviceData',
  sites = 'sites',
  userSites = 'userSites',
}

export interface TimedAggregate {
  key: string;
  min: number;
  max: number;
  avg: number;
  stdDev: number;
  startTimeStamp: number;
  endTimeStamp: number;
}
