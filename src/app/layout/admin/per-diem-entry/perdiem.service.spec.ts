import { TestBed } from '@angular/core/testing';

import { PerdiemService } from './perdiem.service';

describe('PerdiemService', () => {
  let service: PerdiemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerdiemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
