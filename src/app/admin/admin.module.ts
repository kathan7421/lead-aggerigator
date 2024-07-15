import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ForgotPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {FormsModule, ReactiveFormsModule , } from '@angular/forms';
// import { CmsComponent } from './cms/cms.component';
import { EditorModule } from 'primeng/editor';
import { CompanyComponent } from './company/company.component';
import { CompanyaddComponent } from './company/companyadd/companyadd.component';
import { CompanyeditComponent } from './company/companyedit/companyedit.component';
import { CompanyviewComponent } from './company/companyview/companyview.component';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UserComponent } from './user/user.component';
@NgModule({
  declarations: [
   ForgotPasswordComponent,
   ResetPasswordComponent,
   CompanyComponent,
   CompanyaddComponent,
   CompanyeditComponent,
   CompanyviewComponent,
   UserComponent,
  //  CmsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    TableModule,
    InputSwitchModule,
  ]
})
export class AdminModule { }
