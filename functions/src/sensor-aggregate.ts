import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sensor24hourAggregate } from '../../src/app/@core/iot-dash/sensor24hourAggregate';
import { TimedValue } from '../../src/app/@core/iot-dash/iot-dash-models';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// process.env.FIREBASE_CONFIG
// {
//   databaseURL: 'https://databaseName.firebaseio.com',
//   storageBucket: 'projectId.appspot.com',
//   projectId: 'projectId'
// }
const serviceAccount = require('../../src/environments/secrets.luminous-fire-6577-da78feb8be71.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://luminous-fire-6577.firebaseio.com"
});

function getSensorData(key: string) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return admin.database().ref(`sensorData/${key}`)
    .orderByChild('timestamp').startAt(yesterday.valueOf()).endAt(Date.now())
    .once('value');
}

export const sensorAgg = functions.https.onRequest((req, resp) => {
  console.log({params: req.params, headers: req.headers});
  const key = 'jt9rhc34nyxnnabq17h';
  getSensorData(key).then(snap => {
    const timedValues: TimedValue<number>[] = snap.val();
    const aggr = sensor24hourAggregate(key, timedValues);
    console.log({snap, timedValues, aggr});
  }).catch(console.log);
  return resp.send(JSON.stringify({msg: "Hello from Firebase!", params: req.params, headers: req.headers}));
})

export const sensorAggregate = functions.https.onCall((data, context) => {
  return {msg: "Hello from Firebase!"};
  return admin.database().ref(`sensorData`).once('value').then(
    snap => {
      console.log(snap)
      // sensor24hourAggregate();
      return {msg: "Hello from Firebase!", };
  }).catch(e => console.error(e));
  // if (this.sensor24hAggregate.has(key)) {
  //   return this.sensor24hAggregate.get(key);
  // }
  // const max24h = 24 * 60 * 60 * 2;
  // const yesterday = new Date();
  // yesterday.setDate(yesterday.getDate() - 1);
  // const subject = admin.database().ref(
  //   `sensorData/${key}`,
  //   ref => ref.orderByChild('timestamp').startAt(yesterday.valueOf()).endAt(Date.now()).limitToLast(max24h),
  // ).valueChanges().pipe(
  //   single(),
  //   map(values => {
  //     let max, min, sum = 0, startTimeStamp, endTimeStamp;
  //     for (let i = 0; i < values.length; i++) {
  //       const element = values[i];
  //       sum += element.value;
  //       max = element.value > max ? element.value : max;
  //       min = element.value < min ? element.value : min;
  //       startTimeStamp = element.timestamp > startTimeStamp ? element.timestamp : startTimeStamp;
  //       endTimeStamp = element.timestamp < endTimeStamp ? element.timestamp : endTimeStamp;
  //     }
  //     const avg = sum / (values.length || 1);
  //     const stdDev = Math.sqrt(
  //       values.map(val => {
  //         const diff = val.value - avg;
  //         return diff * diff;
  //       }).reduce((acc, val) => acc + val, 0) / (values.length || 1),
  //     );
  //     return {
  //       key,
  //       min,
  //       max,
  //       avg,
  //       stdDev,
  //       startTimeStamp,
  //       endTimeStamp,
  //     };
  //   }),
  //   single(),
  //   publishReplay(),
  // );

  // this.sensor24hAggregate.set(key, subject);
  // return this.sensor24hAggregate.get(key);
});
