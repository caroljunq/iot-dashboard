import { Device, Site } from 'app/@core/iot-dash/iot-dash-models';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { single } from 'rxjs/operators';

import { RootData } from './iot-dash-models';
import { StoredUser } from 'app/pages/users/user-models';

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
export function someName(): string {
  const words = ['TV', 'Raio-X', 'Espera', 'Secretaria', 'Servidores', 'Cirurgia', 'Gesso'];
  return words[getRandomInt(words.length)] + ' ' + words[getRandomInt(words.length)];
}
export function someClass(): string {
  const words = ['nb-lightbulb', 'nb-roller-shades', 'nb-audio', 'nb-coffee-maker'];
  return words[getRandomInt(words.length)] + ' ' + words[getRandomInt(words.length)];
}
export function oneSixSixBits(): string {
  return (Date.now().toString(36) + Math.random().toString(36)).replace('0.', '');
}

export function getSampleData(): RootData {
  const sampleData: RootData = {
    devices: {
      'jtaq3sq65jjm274sn7': <Device>{
        key: 'jtaq3sq65jjm274sn7',
        name: 'Actor #0 Secretaria Secretaria',
        isActor: true,
        max: 1,
        min: 0,
        type: '',
        unit: '',
      },
      'jtaq3sq648vq5qbjjfh': <Device>{
        key: 'jtaq3sq648vq5qbjjfh',
        name: 'Umidade #2',
        max: 80,
        min: 20,
        type: 'Umidade',
        unit: '%',
        isActor: false,
      },
      'jtaq3sq6j4dwqomqzhn': {
        key: 'jtaq3sq6j4dwqomqzhn',
        name: 'Temperatura #1',
        max: 25,
        min: 15,
        type: 'Temperatura',
        unit: 'ºC',
        isActor: false,
      },
      'jtaq3sq6mzdmk90jivd': {
        key: 'jtaq3sq6mzdmk90jivd',
        name: 'Umidade #0',
        max: 80,
        min: 20,
        type: 'Umidade',
        unit: '%',
        isActor: false,
      },
      'jtaq3sq690wqngf8f6v': {
        key: 'jtaq3sq690wqngf8f6v',
        name: 'Actor #1 Gesso Raio-X',
        isActor: true,
        max: 1,
        min: 0,
        type: '',
        unit: '',
      },
      'jtaq3sq6mu5em9wwibi': {
        key: 'jtaq3sq6mu5em9wwibi',
        name: 'Actor #0 TV Gesso',
        isActor: true,
        max: 1,
        min: 0,
        type: '',
        unit: '',
      },
      'jtaq3sq54bpi1hgrrju': {
        key: 'jtaq3sq54bpi1hgrrju',
        name: 'Temperatura #0',
        max: 25,
        min: 15,
        type: 'Temperatura',
        unit: 'ºC',
        isActor: false,
      },
      'jtaq3sq5r63ky31sldr': {
        key: 'jtaq3sq5r63ky31sldr',
        name: 'Temperatura #1',
        max: 25,
        min: 15,
        type: 'Temperatura',
        unit: 'ºC',
        isActor: false,
      },
      'jtaq3sq6wfnt1dr4mo': {
        'key': 'jtaq3sq6wfnt1dr4mo',
        'name': 'Umidade #3',
        'max': 80,
        'min': 20,
        'type': 'Umidade',
        'unit': '%',
        isActor: false,
      },
      'jtaq3sq6yrl35hwhpu': {
        'key': 'jtaq3sq6yrl35hwhpu',
        'name': 'Umidade #2',
        'max': 80,
        'min': 20,
        'type': 'Umidade',
        'unit': '%',
        isActor: false,
      },
      'jtaq3sq7mmpjybj23u': {
        'key': 'jtaq3sq7mmpjybj23u',
        'name': 'Actor #1 Cirurgia Gesso',
        isActor: true,
        max: 1,
        min: 0,
        type: '',
        unit: '',
      },
      'jtaq3sq7t1aqv3mjaa': {
        'key': 'jtaq3sq7t1aqv3mjaa',
        'name': 'Actor #0 Gesso Secretaria',
        isActor: true,
        max: 1,
        min: 0,
        type: '',
        unit: '',
      },
      'jtaq3sq6fxehwom4srl': {
        'key': 'jtaq3sq6fxehwom4srl',
        'name': 'Temperatura #1',
        'max': 25,
        'min': 15,
        'type': 'Temperatura',
        'unit': 'ºC',
        isActor: false,
      },
      'jtaq3sq6iyg5rocavgo': {
        'key': 'jtaq3sq6iyg5rocavgo',
        'name': 'Temperatura #0',
        'max': 25,
        'min': 15,
        'type': 'Temperatura',
        'unit': 'ºC',
        isActor: false,
      },
      'jtaq3sq7adlsav1ea9q': {
        'key': 'jtaq3sq7adlsav1ea9q',
        'name': 'Umidade #2',
        'max': 80,
        'min': 20,
        'type': 'Umidade',
        'unit': '%',
        isActor: false,
      },
    },
    sites: {
      'jtaq3sq6d3jqqr5pcv7': <Site>{
        key: 'jtaq3sq6d3jqqr5pcv7',
        name: 'Sala #1 Gesso Raio-X',
        devices: {
          'jtaq3sq65jjm274sn7': 'jtaq3sq65jjm274sn7',
          'jtaq3sq648vq5qbjjfh': 'jtaq3sq648vq5qbjjfh',
          'jtaq3sq6j4dwqomqzhn': 'jtaq3sq6j4dwqomqzhn',
          'jtaq3sq6mzdmk90jivd': 'jtaq3sq6mzdmk90jivd',
        },
      },
      'jtaq3sq6vkaxho33ooo': {
        key: 'jtaq3sq6vkaxho33ooo',
        name: 'Sala #0 Gesso Secretaria',
        devices: {
          'jtaq3sq690wqngf8f6v': 'jtaq3sq690wqngf8f6v',
          'jtaq3sq6mu5em9wwibi': 'jtaq3sq6mu5em9wwibi',
          'jtaq3sq54bpi1hgrrju': 'jtaq3sq54bpi1hgrrju',
          'jtaq3sq5r63ky31sldr': 'jtaq3sq5r63ky31sldr',
          'jtaq3sq6wfnt1dr4mo': 'jtaq3sq6wfnt1dr4mo',
          'jtaq3sq6yrl35hwhpu': 'jtaq3sq6yrl35hwhpu',
        },
      },
      'jtaq3sq754emvj5xeqa': {
        key: 'jtaq3sq754emvj5xeqa',
        name: 'Sala #2 Espera Gesso',
        devices: {
          'jtaq3sq7mmpjybj23u': 'jtaq3sq7mmpjybj23u',
          'jtaq3sq7t1aqv3mjaa': 'jtaq3sq7t1aqv3mjaa',
          'jtaq3sq6fxehwom4srl': 'jtaq3sq6fxehwom4srl',
          'jtaq3sq6iyg5rocavgo': 'jtaq3sq6iyg5rocavgo',
          'jtaq3sq7adlsav1ea9q': 'jtaq3sq7adlsav1ea9q',
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
  return sampleData;
}
