import { TestBed } from '@angular/core/testing';

import { SparepartServiceService } from './sparepart-service.service';

describe('SparepartServiceService', () => {
  let service: SparepartServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SparepartServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
