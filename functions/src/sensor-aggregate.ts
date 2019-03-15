import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// process.env.FIREBASE_CONFIG
// {
//   databaseURL: 'https://databaseName.firebaseio.com',
//   storageBucket: 'projectId.appspot.com',
//   projectId: 'projectId'
// }

export const sensorAggregate = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!" + JSON.stringify(request));
  admin.database().ref(`sensorData`).once('value').then(snap => console.log(snap.toJSON())).catch(e => console.error(e));
  return;
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