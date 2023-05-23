import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoaderComponent } from './loader.component';
import { LoaderInterceptor } from './loader.interceptor';
import { LoadOnce } from '../utils/load-once';
import { LoaderService } from './loader.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

@NgModule({
  declarations: [LoaderComponent],
  imports: [CommonModule, IndicatorsModule],
  exports: [LoaderComponent],
  providers: [
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ]
})
export class CustomLoaderModule extends LoadOnce {
  constructor(@Optional() @SkipSelf() parentModule: CustomLoaderModule) {
    super(parentModule);
  }
}
