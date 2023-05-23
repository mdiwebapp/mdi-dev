import { TestBed } from '@angular/core/testing';
import { DivisionalRevenueService } from './divisionalrevenue.service'
 
describe('DivisionalRevenueService', () => {
  let service: DivisionalRevenueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DivisionalRevenueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
