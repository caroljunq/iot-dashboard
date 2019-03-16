import { Observable } from 'rxjs';

export interface TimedValue<T> {
  key?: string;
  value: T;
  timestamp: number;
}
export interface Device {
  key: string;
  location: string;
  // Umidade: 20 - 80
  // Temperatura: 15 - 25
  type: string | 'Temperatura' | 'Umidade';
  unit: string | 'ºC' | '%';
  max: number;
  min: number;
  value$?: Observable<TimedValue<number>>;
  emiter?: (number) => any;
  aggregate$?: Observable<TimedAggregate>;
  chart$?: Observable<any>;
}
export interface Site {
  key?: string;
  name: string;
  sensors: {[key: string]: Device};
  actors: {[key: string]: Device};
  sensorsArray?: Device[];
  actorsArray?: Device[];
  icon?: string;
}

export interface RootData {
  sites: {[key: string]: Site};
  sensorData: {[key: string]: TimedValue<number>};
  actorData: {[key: string]: TimedValue<boolean>};
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
