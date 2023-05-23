import { TestBed } from '@angular/core/testing';

import { GowtamaService } from './gowtama.service';

describe('GowtamaService', () => {
  let service: GowtamaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GowtamaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
