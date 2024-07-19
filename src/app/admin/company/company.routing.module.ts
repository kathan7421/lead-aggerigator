import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { CompanyaddComponent } from './companyadd/companyadd.component';
import { CompanyeditComponent } from './companyedit/companyedit.component';
import { CompanyviewComponent } from './companyview/companyview.component';
import { CompanyResolver } from './company.resolver';
import { CompanyEditResolver } from './companyedit/companyedit.resolver';

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    data: { title: 'Company Management' },
    resolve: { data: CompanyResolver },
    runGuardsAndResolvers: 'always',
    children: [
      { path: 'add', component: CompanyaddComponent, data: { title: 'Company Add' } , resolve: { data: CompanyResolver },},
      { path: 'edit/:id', component: CompanyeditComponent, data: { title: 'Company Edit' } , resolve: { company: CompanyEditResolver },},
      { path: 'view/:id', component: CompanyviewComponent, data: { title: 'Company View' }, resolve: { data: CompanyResolver },},
    //   { path: '', redirectTo: 'add', pathMatch: 'full' }, // Optional: Redirect to 'add' by default
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
