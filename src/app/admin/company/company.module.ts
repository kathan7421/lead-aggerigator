import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyComponent } from './company.component';
import { CompanyaddComponent } from './companyadd/companyadd.component';
import { CompanyeditComponent } from './companyedit/companyedit.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { CompanyviewComponent } from './companyview/companyview.component';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CompanyRoutingModule } from './company.routing.module';
import { AppModule } from 'src/app/app.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AdminRoutingModule } from '../admin-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

// import { CompanyRoutingModule } from './company-routing.module'; // Correct import path

@NgModule({
  declarations: [
    CompanyComponent,
    CompanyaddComponent,
    CompanyeditComponent,
    CompanyviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    InputSwitchModule,
    SharedModule,
    CompanyRoutingModule,
    TooltipModule,
    FileUploadModule,
    DialogModule,
    // BrowserAnimationsModule,
    ButtonModule,
    
    
    
    // Ensure correct import here
  ],
  
})
export class CompanyModule {}
