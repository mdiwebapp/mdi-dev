import { TestBed } from '@angular/core/testing';

import { MaintainUnionsService } from './maintain-unions.service';

describe('MaintainUnionsService', () => {
  let service: MaintainUnionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintainUnionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
