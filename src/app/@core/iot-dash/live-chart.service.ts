import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { tap, map, mergeMap, startWith, filter } from 'rxjs/operators';

import { Device, TimedValue } from './iot-dash-models';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';

interface EChartOption {
  [key: string]: {};
  series: any[];
}

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
function baseSensorChartOpts(colors, echarts, emtpy = false) {
  return {
    backgroundColor: echarts.bg,
    color: emtpy ? [colors.danger] : [colors.danger, colors.primary, colors.info],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}',
    },
    legend: {
      left: 'left',
      data: emtpy ? [] : ['Line 1', 'Line 2', 'Line 3'],
      textStyle: {
        color: echarts.textColor,
      },
    },
    xAxis: [
      {
        type: 'category',
        data: emtpy ? [] : ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: echarts.axisLineColor,
          },
        },
        axisLabel: {
          textStyle: {
            color: echarts.textColor,
          },
        },
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
        axisLabel: {
          textStyle: {
            color: echarts.textColor,
          },
        },
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    series: emtpy ? [] : [
      {
        name: 'Line 1',
        type: 'line',
        data: [1, 3, 9, 27, 81, 247, 741, 2223, 6669],
      },
      {
        name: 'Line 2',
        type: 'line',
        data: [1, 2, 4, 8, 16, 32, 64, 128, 256],
      },
      {
        name: 'Line 3',
        type: 'line',
        data: [1 / 2, 1 / 4, 1 / 8, 1 / 16, 1 / 32, 1 / 64, 1 / 128, 1 / 256, 1 / 512],
      },
    ],
  };
}

interface DeviceTimeSereies {
  device: any;
  timeSeries: TimedValue<number>[];
  color: string;
}
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

@Injectable({
  providedIn: 'root',
})
export class LiveChartService {
  charts: Object = {};

  constructor(public firebaseDatabaseService: FirebaseDatabaseService) { }

  getLastSensorValues(device: Device, index: number, limit = 15): Observable<DeviceTimeSereies> {
    return this.firebaseDatabaseService.getLastSensorValues(device.key, limit)
    .pipe(
      map<TimedValue<number>[], DeviceTimeSereies>(timeSeries => ({
        device,
        timeSeries,
        color: seriesColors[index],
      })),
    );
  }

  simplifyTimeSeries(deviceTimeSeriesArr: DeviceTimeSereies[]): {
    mainAxis: any[],
    dataAxis: number[][],
  } {
    const timeMap = new Map<any, number[]>();
    for (const deviceTimeSeries of deviceTimeSeriesArr) {
      for (const timeValue of deviceTimeSeries.timeSeries) {
        const simpleTime = (new Date(<number>timeValue.timestamp)).toLocaleTimeString();
        // const simpleTime = (<number>timeValue.timestamp) & 10000;
        const values = timeMap.get(simpleTime) || [];
        values.push(timeValue.value);
        timeMap.set(simpleTime, values);
      }
    }
    return {
      mainAxis: Array.from(timeMap.keys()),
      dataAxis: Array.from(timeMap.values()),
    };
  }

  deviceTimeSeriesToChartOpts(deviceTimeSeriesArr: DeviceTimeSereies[], colors) {
    const base = baseChartOpts(colors, echarts, true);
    base.color = seriesColors.slice(0, deviceTimeSeriesArr.length);
    // const simplified = this.simplifyTimeSeries(deviceTimeSeriesArr);
    // base.xAxis = [{
    //   ...baseChartXAxis(colors, echarts),
    //   data: simplified.mainAxis,
    // }];
    return deviceTimeSeriesArr.reduce<EChartOption>(
      (acc: EChartOption, deviceTimeSeries) => {
        (<any>acc.legend).data.push(deviceTimeSeries.device.location);
        (<any[]>acc.xAxis).push({
          ...baseChartXAxis(colors, echarts),
          axisLine: { lineStyle: { color: deviceTimeSeries.color } },
          data: deviceTimeSeries.timeSeries.map(date => date.timestamp),
          // data: deviceTimeSeries.timeSeries.map(date => <number>date.timestamp & 10000),
          // data: simplified.mainAxis,
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

  getSiteSensorsComposedChart(params: { siteKey; colors; echarts }): Observable<EChartOption> {
    const { siteKey, colors, echarts } = params;
    if (this.charts.hasOwnProperty(siteKey)) {
      return this.charts[siteKey];
    }

    this.charts[siteKey] = this.firebaseDatabaseService.getSensorSites(siteKey).pipe(
      mergeMap<Device[], DeviceTimeSereies[]>(
        // Device[] => Observable<TimedValue<number>[][]>
        (devices: Device[]) => combineLatest(
          // Device[] => Observable<TimedValue<number>[]>[]
          devices.map((device, index) => this.getLastSensorValues(device, index)),
        ),
      ),
      map(deviceTimeSeriesArr => this.deviceTimeSeriesToChartOpts(deviceTimeSeriesArr, colors)),
      // filter(v => false),
      startWith(baseChartOpts(colors, echarts)),
    );

    return this.charts[siteKey];
  }

  getSensorsChart(params: { colors, echarts, device: Device }): Observable<EChartOption> {
    const { colors, echarts, device } = params;
    if (this.charts.hasOwnProperty(device.key)) {
      return this.charts[device.key];
    }

    this.charts[device.key] = this.getLastSensorValues(device, 0).pipe(
      map(deviceTimeSereies => {
        const base = baseSensorChartOpts(colors, echarts);
        base.legend.data = [device.location];
        base.xAxis[0].data = deviceTimeSereies.timeSeries.map(
          timedValue => (new Date(<number>timedValue.timestamp)).toLocaleTimeString(),
        );
        base.series = [{
          name: device.location,
          type: 'line',
          data: deviceTimeSereies.timeSeries.map(
            timedValue => timedValue.value,
          ),
        }];
        return base;
      }),
      startWith(baseSensorChartOpts(colors, echarts)),
    );
    return this.charts[device.key];
  }
}
