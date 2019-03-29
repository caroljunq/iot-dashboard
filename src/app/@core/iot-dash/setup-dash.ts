import { Device, Site } from 'app/@core/iot-dash/iot-dash-models';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { single } from 'rxjs/operators';

import { RootData } from './iot-dash-models';
import { StoredUser } from 'app/pages/users/user-models';

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
  const sampleData: RootData = {
    sites: {
      'jtaq3sq6d3jqqr5pcv7': <Site>{
        actors: {
          'jtaq3sq65jjm274sn7': <Device>{
            iconClass: 'nb-lightbulb nb-roller-shades',
            key: 'jtaq3sq65jjm274sn7',
            location: 'Actor #0 Secretaria Secretaria',
          },
        },
        name: 'Sala #1 Gesso Raio-X',
        sensors: {
          'jtaq3sq648vq5qbjjfh': <Device>{
            key: 'jtaq3sq648vq5qbjjfh',
            location: 'Umidade #2',
            max: 80,
            min: 20,
            type: 'Umidade',
            unit: '%',
          },
          'jtaq3sq6j4dwqomqzhn': {
            key: 'jtaq3sq6j4dwqomqzhn',
            location: 'Temperatura #1',
            max: 25,
            min: 15,
            type: 'Temperatura',
            unit: 'ºC',
          },
          'jtaq3sq6mzdmk90jivd': {
            key: 'jtaq3sq6mzdmk90jivd',
            location: 'Umidade #0',
            max: 80,
            min: 20,
            type: 'Umidade',
            unit: '%',
          },
        },
      },
      'jtaq3sq6vkaxho33ooo': {
        'actors': {
          'jtaq3sq690wqngf8f6v': {
            'iconClass': 'nb-audio nb-coffee-maker',
            'key': 'jtaq3sq690wqngf8f6v',
            'location': 'Actor #1 Gesso Raio-X',
          },
          'jtaq3sq6mu5em9wwibi': {
            'iconClass': 'nb-audio nb-roller-shades',
            'key': 'jtaq3sq6mu5em9wwibi',
            'location': 'Actor #0 TV Gesso',
          },
        },
        'name': 'Sala #0 Gesso Secretaria',
        'sensors': {
          'jtaq3sq54bpi1hgrrju': {
            'key': 'jtaq3sq54bpi1hgrrju',
            'location': 'Temperatura #0',
            'max': 25,
            'min': 15,
            'type': 'Temperatura',
            'unit': 'ºC',
          },
          'jtaq3sq5r63ky31sldr': {
            'key': 'jtaq3sq5r63ky31sldr',
            'location': 'Temperatura #1',
            'max': 25,
            'min': 15,
            'type': 'Temperatura',
            'unit': 'ºC',
          },
          'jtaq3sq6wfnt1dr4mo': {
            'key': 'jtaq3sq6wfnt1dr4mo',
            'location': 'Umidade #3',
            'max': 80,
            'min': 20,
            'type': 'Umidade',
            'unit': '%',
          },
          'jtaq3sq6yrl35hwhpu': {
            'key': 'jtaq3sq6yrl35hwhpu',
            'location': 'Umidade #2',
            'max': 80,
            'min': 20,
            'type': 'Umidade',
            'unit': '%',
          },
        },
      },
      'jtaq3sq754emvj5xeqa': {
        'actors': {
          'jtaq3sq7mmpjybj23u': {
            'iconClass': 'nb-lightbulb nb-lightbulb',
            'key': 'jtaq3sq7mmpjybj23u',
            'location': 'Actor #1 Cirurgia Gesso',
          },
          'jtaq3sq7t1aqv3mjaa': {
            'iconClass': 'nb-lightbulb nb-audio',
            'key': 'jtaq3sq7t1aqv3mjaa',
            'location': 'Actor #0 Gesso Secretaria',
          },
        },
        'name': 'Sala #2 Espera Gesso',
        'sensors': {
          'jtaq3sq6fxehwom4srl': {
            'key': 'jtaq3sq6fxehwom4srl',
            'location': 'Temperatura #1',
            'max': 25,
            'min': 15,
            'type': 'Temperatura',
            'unit': 'ºC',
          },
          'jtaq3sq6iyg5rocavgo': {
            'key': 'jtaq3sq6iyg5rocavgo',
            'location': 'Temperatura #0',
            'max': 25,
            'min': 15,
            'type': 'Temperatura',
            'unit': 'ºC',
          },
          'jtaq3sq7adlsav1ea9q': {
            'key': 'jtaq3sq7adlsav1ea9q',
            'location': 'Umidade #2',
            'max': 80,
            'min': 20,
            'type': 'Umidade',
            'unit': '%',
          },
        },
      },
    },
    sensorData: {},
    actorData: {},
    users: {
      '56BHZdeRoshWHP43rptjWcUJv0o2': {
        displayName: 'Carolina Junqueira Ferreira',
        email: '',
        isActive: true,
        isAdmin: true,
        photoURL: 'https://lh3.googleusercontent.com/-VJRNpqKNBRE/AAAAAAAAAAI/AAAAAAAADBU/xXvMHKcBxBg/photo.jpg',
        uid: '56BHZdeRoshWHP43rptjWcUJv0o2',
      },
      '5zVHAN4g50STqSwUmAWaqIrTYW03': {
        displayName: 'Luís Henrique Puhl',
        email: '',
        isAdmin: true,
        isActive: true,
        photoURL: 'https://lh4.googleusercontent.com/-j-KYY3ij40Q/AAAAAAAAAAI/AAAAAAAAABw/BGqymJvdrvo/photo.jpg',
        uid: '5zVHAN4g50STqSwUmAWaqIrTYW03',
      },
      'RMb3xUUUWnPpaIybrAv2KBqfQay2': {
        displayName: 'Sylvia Norris',
        email: 'ibko@example.com',
        uid: 'RMb3xUUUWnPpaIybrAv2KBqfQay2',
        isAdmin: false,
        isActive: false,
      },
    },
    userSites: {
      '56BHZdeRoshWHP43rptjWcUJv0o2': {
        'jtaq3sq6d3jqqr5pcv7': 'jtaq3sq6d3jqqr5pcv7',
        'jtaq3sq6vkaxho33ooo': 'jtaq3sq6vkaxho33ooo',
        // 'jtaq3sq754emvj5xeqa': 'jtaq3sq754emvj5xeqa',
      },
      '5zVHAN4g50STqSwUmAWaqIrTYW03': {
        // 'jtaq3sq6d3jqqr5pcv7': 'jtaq3sq6d3jqqr5pcv7',
        'jtaq3sq6vkaxho33ooo': 'jtaq3sq6vkaxho33ooo',
        'jtaq3sq754emvj5xeqa': 'jtaq3sq754emvj5xeqa',
      },
      'RMb3xUUUWnPpaIybrAv2KBqfQay2': {
        // 'jtaq3sq6d3jqqr5pcv7': 'jtaq3sq6d3jqqr5pcv7',
        // 'jtaq3sq6vkaxho33ooo': 'jtaq3sq6vkaxho33ooo',
        // 'jtaq3sq754emvj5xeqa': 'jtaq3sq754emvj5xeqa',
      },
    },
  };
  // for (let siteIndex = 0; siteIndex < 3; siteIndex++) {
  //   // -------------- sensors --------------------
  //   const siteSensors = {};
  //   for (let sensorIndex = 0; sensorIndex < 2 + getRandomInt(3); sensorIndex++) {
  //     const sensorKey = oneSixSixBits();
  //     const type = Math.random() > .5 ? 'Temperatura' : 'Umidade';
  //     const device: Device = {
  //       key: sensorKey,
  //       type,
  //       location: `${type} #${sensorIndex}`,
  //       unit: type === 'Temperatura' ? 'ºC' : '%',
  //       max: type === 'Temperatura' ? 25 : 80,
  //       min: type === 'Temperatura' ? 15 : 20,
  //     };
  //     siteSensors[sensorKey] = device;
  //     // fake reports
  //     sampleData.sensorData[sensorKey] = {};
  //     for (let i = 0; i < 10 + getRandomInt(10); i++) {
  //       sampleData.sensorData[sensorKey][oneSixSixBits()] = {
  //         value: Math.random() * (device.max - device.min) + device.min,
  //         timestamp: Date.now() - getRandomInt(1000),
  //       };
  //     }
  //   }
  //   // -------------- actors --------------------
  //   const siteActors = {};
  //   for (let actorIndex = 0; actorIndex < 1 + getRandomInt(2); actorIndex++) {
  //     const actorKey = oneSixSixBits();
  //     siteActors[actorKey] = {
  //       key: actorKey,
  //       location: `Actor #${actorIndex} ${someName()}`,
  //       iconClass: someClass(),
  //     };
  //     // fake reports
  //     sampleData.actorData[actorKey] = {};
  //     for (let i = 0; i < getRandomInt(10); i++) {
  //       sampleData.actorData[actorKey][oneSixSixBits()] = {
  //         value: Math.random() >= 0.5,
  //         timestamp: Date.now() - getRandomInt(100),
  //       };
  //     }
  //   }
  //   // -------------- sites --------------------
  //   sampleData.sites[oneSixSixBits()] = {
  //     name: `Sala #${siteIndex} ${someName()}`,
  //     sensors: siteSensors,
  //     actors: siteActors,
  //   };
  // }
  return sampleData;
}
