import { TestBed } from '@angular/core/testing';

import { TreeviewSearchService } from './treeview-search.service';

describe('TreeviewSearchService', () => {
  let service: TreeviewSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeviewSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
