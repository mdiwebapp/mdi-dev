import { TestBed } from '@angular/core/testing';

import { PayrollInterfaceService } from './payroll-interface.service';

describe('PayrollInterfaceService', () => {
  let service: PayrollInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollInterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
