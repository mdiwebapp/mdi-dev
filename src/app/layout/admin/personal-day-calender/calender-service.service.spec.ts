import { TestBed } from '@angular/core/testing';

import { CalenderServiceService } from './calender-service.service';

describe('CalenderServiceService', () => {
  let service: CalenderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalenderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
