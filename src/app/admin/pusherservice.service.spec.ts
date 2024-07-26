import { TestBed } from '@angular/core/testing';

import { PusherserviceService } from './pusherservice.service';

describe('PusherserviceService', () => {
  let service: PusherserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PusherserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
