import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Directive, Component } from '@angular/core';


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
import { ModalModule } from 'ngx-bootstrap';
//import { ToastrModule } from 'ngx-toastr';
import {ToastModule} from 'ng2-toastr';

// in app modules
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material-module/material.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

// in app services
import { SubjectService } from './services/subject.service';
import { RoutingMasterComponent } from './views/routing-form/routing-master.component';
import { RoutingDetailComponent } from './views/routing-form/routing-detail/routing-detail.component';
import { RoutingHeaderComponent } from './views/routing-form/routing-header/routing-header.component';
import { LovGridComponent } from './common/lov-grid/lov-grid.component';
import { NumberOnlyDirective } from './common/Directives/number-only.directive';
import { UpperCaseDirective } from './common/Directives/upper-case.directive';
import { PricingService } from './services/pricing/pricing.service';
import { RestApiService } from './services/http.service';
import { FocusDirective } from './common/Directives/focus.directive';
import { SizingprogramMasterComponent } from './views/sizingprogram-form/sizingprogram-master.component';
import { SizingprogramHeaderComponent } from './views/sizingprogram-form/sizingprogram-header/sizingprogram-header.component';
import { SizingprogramDetailComponent } from './views/sizingprogram-form/sizingprogram-detail/sizingprogram-detail.component';
import { ToolbarComponent } from './common/toolbar/toolbar.component';
import { DatePipe } from '@angular/common';
import { DecimalOnlyDirective } from './common/Directives/decimal-only.directive';
import { YarnassignmentMasterComponent } from './views/yarnassignment-form/yarnassignment-master.component';
import { YarnassignmentHeaderComponent } from './views/yarnassignment-form/yarnassignment-header/yarnassignment-header.component';
import { YarnassignmentDetailComponent } from './views/yarnassignment-form/yarnassignment-detail/yarnassignment-detail.component';
import { InlineqcMasterComponent } from './views/inlineqc-form/inlineqc-master.component';
import { InspectionunitMasterComponent } from './views/inspectionunit-form/inspectionunit-master.component';
import { LoomnumbersMasterComponent } from './views/inlineqcloom-form/loomnumbers-master.component';
import { ProgramnumbersMasterComponent } from './views/programnumbers-form/programnumbers-master.component';

// routing
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    MasterFormComponent,
    HeaderComponent,
    DetailComponent,
    CommonGridComponent,
    NavComponent,
    RoutingMasterComponent,
    RoutingDetailComponent,
    RoutingHeaderComponent,
    LovGridComponent,
    NumberOnlyDirective,
    UpperCaseDirective,
    FocusDirective,
    SizingprogramMasterComponent,
    SizingprogramHeaderComponent,
    SizingprogramDetailComponent,
    ToolbarComponent,
    DecimalOnlyDirective,
    YarnassignmentMasterComponent,
    YarnassignmentHeaderComponent,
    YarnassignmentDetailComponent,
    InlineqcMasterComponent,
    InspectionunitMasterComponent,
    LoomnumbersMasterComponent,
    ProgramnumbersMasterComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,    
    NgxDatatableModule,
    ModalModule.forRoot(),
    ToastModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: InspectionunitMasterComponent },
      { path: 'loomnumbers-master/:id', component: LoomnumbersMasterComponent },		  
      { path: 'loomnumbers-master', component: LoomnumbersMasterComponent },		  
      { path: 'inlineqc-master/:id/:range', component: InlineqcMasterComponent}, 
     // { path: '**', component: AppComponent },
      //{ path: '', redirectTo: '/home', pathMatch: 'full' },
    ]),
    //AppRoutingModule  
  ],
  providers: [
    RestApiService,
    SubjectService,
    PricingService,
    DatePipe
  ],
  entryComponents: [
    CommonGridComponent,
    LovGridComponent,
    ProgramnumbersMasterComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
