import { NgModule } from '@angular/core';
import { BrowserModule,Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './admin/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './shared/admin-layout/sidebar/sidebar.component';
import { ToastrModule } from 'ngx-toastr';
import {  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryComponent } from './admin/category/category.component';
// import { ToggleButtonModule } from 'primeng/togglebutton'; 
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {InputSwitchModule} from 'primeng/inputswitch';
// import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { DialogModule } from 'primeng/dialog';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './admin/auth.interceptor';
import { ProductsComponent } from './admin/products/products.component';
import { FileUploadModule } from 'primeng/fileupload';
import { OrdersComponent } from './admin/orders/orders.component';
import { UsersComponent } from './admin/users/users.component';
import { BannersComponent } from './admin/banners/banners.component';
import {ChartModule} from 'primeng/chart';
import { OrderStatusChartComponent } from './admin/orders/order-status-chart/order-status-chart.component';
import { NotFoundComponent } from './admin/not-found/not-found.component';
import { CountryComponent } from './admin/country/country.component';
import { GlobalnotfoundComponent } from './admin/globalnotfound/globalnotfound.component';
import { HomeComponent } from './frontend/home/home.component';
// import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';
// import { SharedModule } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    // SidebarComponent,
    // FooterComponent,
    CategoryComponent,
    ProductsComponent,
    OrdersComponent,
    UsersComponent,
    BannersComponent,
    OrderStatusChartComponent,
    NotFoundComponent,
    CountryComponent,
    GlobalnotfoundComponent,
    HomeComponent,
    // AdminLayoutComponent,s
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot() ,
    HttpClientModule,
    BrowserAnimationsModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    InputTextModule,
    ProgressBarModule,
    ButtonModule,
    ToastModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    ToggleButtonModule,
    InputSwitchModule,
    DialogModule,
    FileUploadModule,
    ChartModule,
    AdminModule,
    SharedModule
  ],

  providers: [
    MessageService,
    DialogService,
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
