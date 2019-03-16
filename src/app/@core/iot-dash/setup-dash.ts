import { Device } from 'app/@core/iot-dash/iot-dash-models';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { single } from 'rxjs/operators';

import { RootData } from './iot-dash-models';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function someName(): string {
  const words = ['TV', 'Raio-X', 'Espera', 'Secretaria', 'Servidores', 'Cirurgia', 'Gesso'];
  return words[getRandomInt(words.length)] + ' ' + words[getRandomInt(words.length)];
}
function someClass(): string {
  const words = ['nb-lightbulb', 'nb-roller-shades', 'nb-audio', 'nb-coffee-maker'];
  return words[getRandomInt(words.length)] + ' ' + words[getRandomInt(words.length)];
}
function oneSixSixBits(): string {
  return (Date.now().toString(36) + Math.random().toString(36)).replace('0.', '');
}

export function getSampleData(): RootData {
  const sampleData = {
    sites: {},
    sensorData: {},
    actorData: {},
    users: {},
  };
  for (let siteIndex = 0; siteIndex < 3; siteIndex++) {
    // -------------- sensors --------------------
    const siteSensors = {};
    for (let sensorIndex = 0; sensorIndex < 2 + getRandomInt(3); sensorIndex++) {
      const sensorKey = oneSixSixBits();
      const type = Math.random() > .5 ? 'Temperatura' : 'Umidade';
      const device: Device = {
        key: sensorKey,
        type,
        location: `${type} #${sensorIndex}`,
        unit: type === 'Temperatura' ? 'ºC' : '%',
        max: type === 'Temperatura' ? 25 : 80,
        min: type === 'Temperatura' ? 15 : 20,
      };
      siteSensors[sensorKey] = device;
      // fake reports
      sampleData.sensorData[sensorKey] = {};
      for (let i = 0; i < 10 + getRandomInt(10); i++) {
        sampleData.sensorData[sensorKey][oneSixSixBits()] = {
          value: Math.random() * (device.max - device.min) + device.min,
          timestamp: Date.now() - getRandomInt(1000),
        };
      }
    }
    // -------------- actors --------------------
    const siteActors = {};
    for (let actorIndex = 0; actorIndex < 1 + getRandomInt(2); actorIndex++) {
      const actorKey = oneSixSixBits();
      siteActors[actorKey] = {
        key: actorKey,
        location: `Actor #${actorIndex} ${someName()}`,
        iconClass: someClass(),
      };
      // fake reports
      sampleData.actorData[actorKey] = {};
      for (let i = 0; i < getRandomInt(10); i++) {
        sampleData.actorData[actorKey][oneSixSixBits()] = {
          value: Math.random() >= 0.5,
          timestamp: Date.now() - getRandomInt(100),
        };
      }
    }
    // -------------- sites --------------------
    sampleData.sites[oneSixSixBits()] = {
      name: `Sala #${siteIndex} ${someName()}`,
      sensors: siteSensors,
      actors: siteActors,
    };
  }
  return sampleData;
}
