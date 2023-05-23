import { TestBed } from '@angular/core/testing';

import { NetworkDirectoryService } from './networkdirectory.service';

describe('NetworkDirectoryService', () => {
  let service: NetworkDirectoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkDirectoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
