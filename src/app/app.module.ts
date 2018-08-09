import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// routing
import { AppRoutingModule } from './app-routing.module';

// main app component
import { AppComponent } from './app.component';
// nav component
import { NavComponent } from './common/nav/nav.component';
// master form component
import { MasterFormComponent } from './views/master-form/master-form.component';
// master form component => child components
import { HeaderComponent } from './views/master-form/header/header.component';
import { DetailComponent } from './views/master-form/detail/detail.component';

// general grid
import { CommonGridComponent } from './common/common-grid/common-grid.component';

// 3rd party libs
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap'

// in app modules
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { MaterialModule } from './material-module/material.module';
import { FormsModule, ReactiveFormsModule } from '../../node_modules/@angular/forms';

// in app services
import { SubjectService } from './services/subject.service';
import { PricingService } from './services/pricing/pricing.service';
import { RestApiService } from './services/http.service';


@NgModule({
  declarations: [
    AppComponent,
    MasterFormComponent,
    HeaderComponent,
    DetailComponent,
    CommonGridComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxDatatableModule,
    ModalModule.forRoot()
  ],
  providers: [
    RestApiService,
    SubjectService,
    PricingService
  ],
  entryComponents: [
    CommonGridComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
