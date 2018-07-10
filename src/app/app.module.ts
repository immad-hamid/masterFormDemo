import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// routing
import { AppRoutingModule } from './app-routing.module';

// main app component
import { AppComponent } from './app.component';
// master form component
import { MasterFormComponent } from './views/master-form/master-form.component';
// master form component => child components
import { HeaderComponent } from './views/master-form/header/header.component';
import { DetailComponent } from './views/master-form/detail/detail.component';
// general grid
import { CommonGridComponent } from './common/common-grid/common-grid.component';

// 3rd party libs
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap'


@NgModule({
  declarations: [
    AppComponent,
    MasterFormComponent,
    HeaderComponent,
    DetailComponent,
    CommonGridComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxDatatableModule,
    ModalModule.forRoot()
  ],
  providers: [],
  entryComponents: [CommonGridComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
