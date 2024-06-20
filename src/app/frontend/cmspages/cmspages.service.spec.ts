import { TestBed } from '@angular/core/testing';

import { CmspagesService } from './cmspages.service';

describe('CmspagesService', () => {
  let service: CmspagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmspagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
