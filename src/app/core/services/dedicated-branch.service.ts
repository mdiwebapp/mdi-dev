import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DedicatedBranchService {
  private dedicatedBranches = new BehaviorSubject([]);
  selectedBranches = this.dedicatedBranches.asObservable();

  constructor() {}

  onChangeBranches(branches: []) {
    this.dedicatedBranches.next(branches);
  }
}
