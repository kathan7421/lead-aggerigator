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

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    FrontLayoutComponent,
    AdminlayoutComponent,
    SidebarComponent,
    LayoutComponent,
    AdminFooterComponent,
    // Other shared components if any
  ],
  imports: [
    CommonModule,
    RouterModule // Import RouterModule if needed
    // Other modules as needed (FormsModule, ReactiveFormsModule, etc.)
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AdminFooterComponent,
    AdminlayoutComponent,

    CommonModule,
    RouterModule // Export RouterModule if needed
    // Other exports as needed
  ]
})
export class SharedModule { }
