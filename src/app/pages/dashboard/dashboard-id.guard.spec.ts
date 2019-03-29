import { TestBed, async, inject } from '@angular/core/testing';

import { DashboardIdGuard } from './dashboard-id.guard';

describe('DashboardIdGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardIdGuard]
    });
  });

  it('should ...', inject([DashboardIdGuard], (guard: DashboardIdGuard) => {
    expect(guard).toBeTruthy();
  }));
});
