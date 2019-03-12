import { TestBed } from '@angular/core/testing';

import { LiveChartService } from './live-chart.service';

describe('LiveChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiveChartService = TestBed.get(LiveChartService);
    expect(service).toBeTruthy();
  });
});
