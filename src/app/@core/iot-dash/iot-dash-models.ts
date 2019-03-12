
export interface TimedValue<T> {
  key?: string;
  value: T;
  timestamp: number|Object;
}
export interface Device {
  key: string;
  location: string;
}
export interface Site {
  key?: string;
  name: string;
  sensors: {[key: string]: Device};
  actors: {[key: string]: Device};
  sensorsArray?: Device[];
  actorsArray?: Device[];
}

export interface RootData {
  sites: {[key: string]: Site};
  sensorData: {[key: string]: TimedValue<number>};
  actorData: {[key: string]: TimedValue<boolean>};
}
