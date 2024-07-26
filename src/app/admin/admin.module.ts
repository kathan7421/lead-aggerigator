import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
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
import { InquiryComponent } from './inquiry/inquiry.component';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { PusherserviceService } from './pusherservice.service';
import { DropdownModule } from 'primeng/dropdown';
import { ReviewsComponent } from './reviews/reviews.component';
import { RatingModule } from 'primeng/rating';
// import { CompanyRoutingModule } from './company/company.routing.module';
@NgModule({
  declarations: [
   ForgotPasswordComponent,
   ResetPasswordComponent,
  //  CompanyComponent,
  //  CompanyaddComponent,
  //  CompanyeditComponent,
  //  CompanyviewComponent,
   UserComponent,
  InquiryComponent,
  ReviewsComponent,
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
    TooltipModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    RatingModule
  ]
})
export class AdminModule { }
