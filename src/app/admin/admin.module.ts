import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
// import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
// import { AdminlayoutComponent } from './adminlayout/adminlayout.component';
// import { AdminLayoutComponent }
// import { SharedModule } from '../shared/shared.module';
// import { LayoutComponent } from '../shared/admin-layout/layout/layout.component';
// import { SidebarComponent } from '../shared/admin-layout/sidebar/sidebar.component';
// import { AdminFooterComponent } from '../shared/admin-layout/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    //  AdminlayoutComponent,
    //  LayoutComponent,
    //  SidebarComponent,
    // AdminFooterComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
