import { TestBed } from '@angular/core/testing';

import { PhysicalInventoryService } from './physical-inventory.service';

describe('PhysicalInventoryService', () => {
  let service: PhysicalInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicalInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
