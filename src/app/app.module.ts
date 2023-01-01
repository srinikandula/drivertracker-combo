import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { CatchErrorInterceptor } from './interceptors/http-error.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { NotFoundComponent } from './components/layout/not-found/not-found.component';
import { FareconfigComponent } from './components/layout/fareconfig/fareconfig.component';
import { FarelistComponent } from './components/layout/farelist/farelist.component';
import { LogsComponent } from './components/layout/logs/logs.component';
import { SlabsComponent } from './components/layout/slabs/slabs.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {JwtInterceptor} from "@app/interceptors/jwt.interceptor";
import { LoaderComponent } from './loader/loader.component';
import {LoaderService} from "@app/loader/loader.service";
import {LoaderInterceptor} from "@app/interceptors/loader.interceptor";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    NgbPaginationModule,
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    NotFoundComponent,
    FareconfigComponent,
    FarelistComponent,
    LogsComponent,
    SlabsComponent,
    LoaderComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: CatchErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
