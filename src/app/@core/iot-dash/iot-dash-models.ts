
export class SensorValue {
  constructor(
    public timestamp: Date|number|Object,
    public value: number|string,
    public key?: string,
  ) { }
}
export class Sensor {
  constructor(
    public key: String,
    public location: String,
  ) { }
}
export class Site {
  constructor(
    public key: String,
    public name: String,
    public sensors: Sensor[],
  ) { }
}


export interface SensorFb {
  location: string;
  sensorKey?: string;
}
export interface SiteFb {
  name: string;
  sensors: {[key: string]: SensorFb};
}

export class ActorValue {
  constructor(
    public value: boolean|number,
    public timestamp: Date|number|Object,
    public key?: string,
  ) { }
}
export class Actor {
  constructor(
    public location: String,
    public key?: String,
  ) { }
}

const sample = {
  'humidity': {
    '-LXpT5478WcUiHRE4G8c': 70.8,
  },
  'sites': {
    'site-key': {
      'name': 'site name',
      'sensors': {
        'sensor-key': {
          'history': {
            'k-key': {
              'timestamp': 'now',
              'value': 30,
            },
          },
          'location': 'kitchen sink',
        },
        'sensor-key2': {
          'history': {
            'k-key': {
              'timestamp': 'now',
              'value': 30,
            },
          },
          'location': 'kitchen sink',
        },
      },
    },
  },
  'temperature': {
    '-LXpT50ePY84bc-dc_cL': 31.9,
  },
};
