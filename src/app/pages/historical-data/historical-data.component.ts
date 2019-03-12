import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { NbThemeService } from '@nebular/theme';


@Component({
  selector: 'ngx-historical-data',
  templateUrl: './historical-data.component.html',
  styleUrls: ['./historical-data.component.scss']
})

export class HistoricalDataComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;

  currentDate = null;
  formControl: FormControl;
  ngModelDate: Date;

  constructor(private theme: NbThemeService) { 
    this.currentDate = interval(2000).pipe( map(() => Date.now()));
    this.formControl = new FormControl(new Date());
    this.ngModelDate = new Date();
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options  = {
        title: {
          text: 'Temperature'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['Sensor1','Sensor2']
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              name: 'temperature_' + Date.now(),
              title: 'Save as png'
            },
          }
        },
        xAxis:  {
          type: 'category',
          boundaryGap: false,
          data: ['25-03-19','26-03-19','27-03-19','28-03-19','29-03-19','30-03-19','31-03-19']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [
        {
          name:'Sensor1',
          type:'line',
          data:[11, 11, 15, 13, 12, 13, 10],
          markLine: {
            data: [
              { type: 'average', name: 'Avg'}
            ]
          }
        },
        {
          name:'Sensor2',
          type:'line',
          data:[1, -2, 2, 5, 3, 2, 0],
          markLine: {
            data: [
              {type: 'average', name: 'Avg',},
              {
                symbol: 'none',
                x: '90%',
                yAxis: 'max'
              }, 
              {
                symbol: 'circle',
                label: {
                  normal: {
                    position: 'start',
                    formatter: 'Max'
                  }
                },
                type: 'max',
                  name: 'Highest Point'
                }]
          }
        }
      ]
    };

  });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

