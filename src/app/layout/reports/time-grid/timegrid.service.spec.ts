import { TestBed } from '@angular/core/testing';

import { TimegridService } from './timegrid.service';

describe('TimegridService', () => {
  let service: TimegridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimegridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
