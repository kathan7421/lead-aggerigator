import { TestBed } from '@angular/core/testing';

import { CmsserviceService } from './cmsservice.service';

describe('CmsserviceService', () => {
  let service: CmsserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmsserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
