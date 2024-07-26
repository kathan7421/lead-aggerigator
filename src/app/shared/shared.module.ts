// shared.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router'; // Import RouterModule if needed
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import { AdminlayoutComponent } from '../admin/adminlayout/adminlayout.component';
import { SidebarComponent } from './admin-layout/sidebar/sidebar.component';
import { LayoutComponent } from './admin-layout/layout/layout.component';
import { AdminFooterComponent } from './admin-layout/admin-footer/admin-footer.component';
import {ChartModule} from 'primeng/chart';
import { EditorModule } from 'primeng/editor';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from '../app.module';
import { LocationSelectorComponent } from './location/location.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    FrontLayoutComponent,
    AdminlayoutComponent,
    SidebarComponent,
    LayoutComponent,
    AdminFooterComponent,
    LocationSelectorComponent,
    // Other shared components if any
  ],
  imports: [
    CommonModule,
    RouterModule ,// Import RouterModule if needed
    ChartModule,
    EditorModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    
    
    // Other modules as needed (FormsModule, ReactiveFormsModule, etc.)
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AdminFooterComponent,
    AdminlayoutComponent,
    DialogModule,
    CommonModule,
    RouterModule ,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    LocationSelectorComponent,

   
    
    // Export RouterModule if needed
    // Other exports as needed
  ]
})
export class SharedModule { }
