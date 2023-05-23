import { TestBed } from '@angular/core/testing';

import { EmployeenotesService } from './employeenotes.service';

describe('EmployeenotesService', () => {
  let service: EmployeenotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeenotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
