import { TestBed } from '@angular/core/testing';

import { ComponetSwapService } from './componet-swap.service';

describe('ComponetSwapService', () => {
  let service: ComponetSwapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponetSwapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
