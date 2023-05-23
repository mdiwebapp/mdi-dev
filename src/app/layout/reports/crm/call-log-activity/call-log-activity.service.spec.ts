import { TestBed } from '@angular/core/testing';

import { CallLogActivityService } from './call-log-activity.service';

describe('CallLogActivityService', () => {
  let service: CallLogActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallLogActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
