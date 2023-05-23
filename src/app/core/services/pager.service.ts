import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PagerService {
  public pageSize: number = 100;

  public start: number = 0;

  public end: number = 0;

  public hasMore: boolean = false;

  constructor() {
    this.end = this.pageSize;
  }
  loadMore() {
    this.start = this.end + 1;
    this.end = this.start + this.pageSize;
  }

  load() {
    this.start = 0;
    this.end = 100;
    this.pageSize = 100;
  }
  setHasMore(loadMoreData: boolean) {
    this.hasMore = loadMoreData;
  }

  registerScrollEvent(scrollFunc: any) {
    var grid: HTMLDivElement;
    var gridScrollable = document.getElementsByClassName('k-virtual-content');
    if (gridScrollable && gridScrollable.length) {
      grid = gridScrollable[0] as HTMLDivElement;
    }

    if (grid) {
      var listenEvent = (event) => {
        scrollFunc(event);
      };

      if (this.hasMore) {
        grid.addEventListener('scroll', listenEvent, true);
      } else {
        grid.removeEventListener('scroll', listenEvent);
      }
    }
  }

  enableLoadMoreItems(event) {
    return (
      event.target.scrollHeight -
        (event.target.offsetHeight + event.target.scrollTop) ===
      0
    );
  }
}
