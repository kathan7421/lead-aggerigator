import { TestBed } from '@angular/core/testing';

import { DashboardResolverService } from '../admin/dashboard/dashboard-resolver.service';

describe('DashboardResolverService', () => {
  let service: DashboardResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
