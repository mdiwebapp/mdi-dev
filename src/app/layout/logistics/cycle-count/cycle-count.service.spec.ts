import { TestBed } from '@angular/core/testing';

import { CycleCountService } from './cycle-count.service';

describe('CycleCountService', () => {
  let service: CycleCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CycleCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
