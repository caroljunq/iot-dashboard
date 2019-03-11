import { Injectable } from '@angular/core';

import { database } from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, forkJoin, BehaviorSubject, merge, combineLatest, of } from 'rxjs';
import { tap, map, filter, debounceTime, mergeMap, startWith, switchMap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { setSampleData } from './setup-dash';
import { Site, Device, TimedValue } from './iot-dash-models';
import { EChartOption } from 'echarts';
import { DatePipe } from '@angular/common';

function baseChartOpts(colors, echarts, emtpy = false): EChartOption {
  return {
    backgroundColor: echarts.bg,
    color: emtpy ? [] : [colors.success, colors.info],
    tooltip: {
      trigger: 'none',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: emtpy ? [] : ['2015 Precipitation', '2016 Precipitation'],
      textStyle: {
        color: echarts.textColor,
      },
    },
    grid: {
      top: 70,
      bottom: 50,
    },
    xAxis: emtpy ? [] : [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors.info,
          },
        },
        axisLabel: <{}>{
          textStyle: {
            color: echarts.textColor,
          },
        },
        axisPointer: {
          label: {
            formatter: params => {
              return (
                'Precipitation  ' +
                params.value +
                (params.seriesData.length
                  ? '：' + params.seriesData[0].data
                  : '')
              );
            },
          },
        },
        data: [
          '2016-1',
          '2016-2',
          '2016-3',
          '2016-4',
          '2016-5',
          '2016-6',
          '2016-7',
          '2016-8',
          '2016-9',
          '2016-10',
          '2016-11',
          '2016-12',
        ],
      },
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors.success,
          },
        },
        axisLabel: <{}>{
          textStyle: {
            color: echarts.textColor,
          },
        },
        axisPointer: {
          label: {
            formatter: params => {
              return (
                'Precipitation  ' +
                params.value +
                (params.seriesData.length
                  ? '：' + params.seriesData[0].data
                  : '')
              );
            },
          },
        },
        data: [
          '2015-1',
          '2015-2',
          '2015-3',
          '2015-4',
          '2015-5',
          '2015-6',
          '2015-7',
          '2015-8',
          '2015-9',
          '2015-10',
          '2015-11',
          '2015-12',
        ],
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: echarts.axisLineColor,
          },
        },
        splitLine: {
          lineStyle: {
            color: echarts.splitLineColor,
          },
        },
        axisLabel: <{}>{
          textStyle: {
            color: echarts.textColor,
          },
        },
      },
    ],
    series: emtpy ? [] : [
      {
        name: '2015 Precipitation',
        type: 'line',
        xAxisIndex: 1,
        smooth: true,
        data: [
          2.6,
          5.9,
          9.0,
          26.4,
          28.7,
          70.7,
          175.6,
          182.2,
          48.7,
          18.8,
          6.0,
          2.3,
        ],
      },
      {
        name: '2016 Precipitation',
        type: 'line',
        smooth: true,
        data: [
          3.9,
          5.9,
          11.1,
          18.7,
          48.3,
          69.2,
          231.6,
          46.6,
          55.4,
          18.4,
          10.3,
          0.7,
        ],
      },
    ],
  };
}
function baseChartXAxis(colors, echarts) {
  return {
    type: 'category',
    axisTick: {
      alignWithLabel: true,
    },
    axisLine: {
      onZero: false,
      lineStyle: {
        color: colors.info,
      },
    },
    axisLabel: {
      textStyle: {
        color: echarts.textColor,
      },
    },
    axisPointer: {
      label: {
        formatter: label =>
          label.value +
          (label.seriesData.length ? '：' + label.seriesData[0].data : ''),
      },
    },
    data: [],
  };
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseDatabaseService {
  constructor(private angularFireDatabase: AngularFireDatabase) {
    if (!environment.production) {
      this.setup();
    }
  }
  private setup() {
    const sampleData = setSampleData();
    this.angularFireDatabase.object('/').update(sampleData);
    // update
    Object.values(sampleData.sites).forEach(site =>
      setInterval(
        () =>
          this.angularFireDatabase
            .list(`sensorData/${Object.keys(site)[0]}`)
            .push({
              value: Math.random() * 60 - 10,
              timestamp: database.ServerValue.TIMESTAMP,
            }),
        1000 * Math.floor(Math.random() * 10.0 + 1),
      ),
    );
  }

  getSites() {
    return this.angularFireDatabase
      .object<{ [key: string]: Site }>('sites')
      .valueChanges()
      .pipe(
        // tap(v => console.log(v)),
        map(value =>
          Object.entries(value).map(
            siteEntry =>
              <Site>{
                ...siteEntry[1],
                key: siteEntry[0],
                sensorsArray: Object.entries(siteEntry[1].sensors || {}).map(
                  sensorEntry =>
                    <Device>{
                      key: sensorEntry[0],
                      ...sensorEntry[1],
                    },
                ),
                actorsArray: Object.entries(siteEntry[1].actors || {}).map(
                  sensorEntry =>
                    <Device>{
                      key: sensorEntry[0],
                      ...sensorEntry[1],
                    },
                ),
              },
          ),
        ),
      );
  }

  getLatest<T>(path: string): Observable<TimedValue<T>> {
    return this.angularFireDatabase
      .list<TimedValue<T>>(path, ref =>
        ref.orderByChild('timestamp').limitToLast(1),
      )
      .valueChanges()
      .pipe(
        debounceTime(500),
        map(list => list[0]),
        filter(value => value !== null && value !== undefined),
        // tap(value => console.log({path, ...value})),
      );
  }

  getSensorValue(key: string) {
    if (!environment.production) {
      setInterval(
        () => this.setSensorValue(key, Math.random() * 50 - 10),
        1000,
      );
    }
    return this.getLatest(`sensorData/${key}`);
  }
  setSensorValue(key: string, value: number) {
    return this.angularFireDatabase
      .list<TimedValue<number>>(`sensorData/${key}`)
      .push({
        value,
        timestamp: database.ServerValue.TIMESTAMP,
      });
  }

  setActorValue(key: string, value: boolean) {
    return this.angularFireDatabase
      .list<TimedValue<boolean>>(`actorData/${key}`)
      .push({
        value,
        timestamp: database.ServerValue.TIMESTAMP,
      });
  }
  getActorValue(key: string): Observable<TimedValue<boolean>> {
    return this.getLatest(`actorData/${key}`).pipe(
      map(timedValue => ({ ...timedValue, value: !!timedValue.value })),
    );
  }

  charts: Object = {};
  ran = false;
  getChartOptions(params: { siteKey; colors; echarts }): Observable<EChartOption> {
    const { siteKey, colors, echarts } = params;
    if (this.charts.hasOwnProperty(siteKey)) {
      return this.charts[siteKey];
    }
    if (this.ran) {
      this.charts[siteKey] = of(baseChartOpts(colors, echarts));
      return this.charts[siteKey];
    }
    this.ran = true;
    const seriesColors = [
      '#40dc7e',
      '#4ca6ff',
      '#dedede',
      '#000000',
      '#111111',
      '#222222',
      '#333333',
      '#444444',
    ];

    function getLastSensorValues(
      angularFireDatabase: AngularFireDatabase,
      device,
      index,
    ): Observable<DeviceTimeSereies> {
      return angularFireDatabase
      .list<TimedValue<number>>(`sensorData/${device.key}`, ref =>
        ref.orderByChild('timestamp').limitToLast(15),
      )
      .valueChanges()
      .pipe(
        tap(v => console.log({timeSeries: v})),
        map(timeSeries => ({
          device,
          timeSeries,
          color: seriesColors[index],
        })),
      );
    }

    interface DeviceTimeSereies {
      device: any;
      timeSeries: TimedValue<number>[];
      color: string;
    }
    function deviceTimeSeriesToChartOpts(deviceTimeSeriesArr: DeviceTimeSereies[]) {
      const base = baseChartOpts(colors, echarts, true);
      base.color = seriesColors.slice(0, deviceTimeSeriesArr.length);
      return deviceTimeSeriesArr.reduce<EChartOption>(
        (acc: EChartOption, deviceTimeSeries) => {
          (<any>acc.legend).data.push(deviceTimeSeries.device.location);
          (<any[]>acc.xAxis).push({
            ...baseChartXAxis(colors, echarts),
            axisLine: { lineStyle: { color: deviceTimeSeries.color } },
            data: deviceTimeSeries.timeSeries.map(date => date.timestamp),
            //   date => (new Date(date.timestamp)).toDateString(),
            // ).reduce(
            //   (dateAcc: string[], cur) => !dateAcc.includes(cur) && dateAcc.concat([cur]),
            //   [],
            // ),
          });
          acc.series.push({
            name: deviceTimeSeries.device.location,
            type: 'line',
            // xAxisIndex: 1,
            smooth: true,
            data: deviceTimeSeries.timeSeries.map(date => date.value),
          });
          return acc;
        },
        base,
      );
    }

    this.charts[siteKey] = this.angularFireDatabase
      .list<Device>(`sites/${siteKey}/sensors`)
      .valueChanges()
      .pipe(
        tap(v => console.log({source: v})),
        // mergeMap
        mergeMap<Device[], DeviceTimeSereies[]>(
          // Device[] => Observable<TimedValue<number>[][]>
          (devices: Device[]) => combineLatest(
            // Device[] => Observable<TimedValue<number>[]>[]
            devices.map((device, index) => getLastSensorValues(this.angularFireDatabase, device, index)),
          ).pipe(
            tap(v => console.log({combineLatest: v})),
          ),
        ),
        // tap(v => console.log({'before-map': v})),
        map(deviceTimeSeriesArr => deviceTimeSeriesToChartOpts(deviceTimeSeriesArr)),
        startWith(baseChartOpts(colors, echarts)),
        tap(v => console.log({final: v})),
      );

    return this.charts[siteKey];
  }
}
