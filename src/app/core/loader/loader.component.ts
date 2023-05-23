import { Component, ViewEncapsulation, OnDestroy, OnInit, ChangeDetectorRef, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from './loader.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoaderComponent implements OnInit, OnDestroy, AfterViewChecked {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  visible: boolean;
  private _unsubscribeAll: Subject<any>;

  constructor(private loaderService: LoaderService, private cdRef: ChangeDetectorRef) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
   
    this.loaderService.visible.pipe(takeUntil(this._unsubscribeAll)).subscribe((visible) => {
      this.visible = visible;
    });
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
