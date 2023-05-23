import { TestBed } from '@angular/core/testing';

import { DedicatedBranchService } from './dedicated-branch.service';

describe('DedicatedBranchService', () => {
  let service: DedicatedBranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DedicatedBranchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
