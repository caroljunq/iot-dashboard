import { TimedValue, TimedAggregate } from './iot-dash-models';
export function sensor24hourAggregate(key = '', values: TimedValue<number>[] = []): TimedAggregate {
  let max = Number.NEGATIVE_INFINITY;
  let endTimeStamp = Number.NEGATIVE_INFINITY;
  let min = Number.POSITIVE_INFINITY;
  let startTimeStamp = Number.POSITIVE_INFINITY;
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const element = values[i];
    sum += element.value;
    max = Math.max(element.value, max);
    endTimeStamp = Math.max(element.timestamp, endTimeStamp);
    min = Math.min(element.value, min);
    startTimeStamp = Math.min(element.timestamp, startTimeStamp);
  }
  const avg = sum / (values.length || 1);
  const stdDev = Math.sqrt(
    values.map(val => {
      const diff = val.value - avg;
      return diff * diff;
    }).reduce((acc, val) => acc + val, 0) / (values.length || 1),
  );
  return { key, min, max, avg, stdDev, startTimeStamp, endTimeStamp };
}
