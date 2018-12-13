import { InlineqcMasterComponent } from './views/inlineqc-form/inlineqc-master.component';
import { LoomnumbersMasterComponent } from './views/inlineqcloom-form/loomnumbers-master.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [// { path: 'home', component: InspectionunitMasterComponent },
{ path: 'loomnumbers-master/:id', component: LoomnumbersMasterComponent },		  
{ path: 'inlineqc-master/:id', component: InlineqcMasterComponent}, 
//{ path: '', component: InspectionunitMasterComponent },
//{ path: '', redirectTo: '/home', pathMatch: 'full' },];
];

export  const routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
 export class AppRoutingModule { }
