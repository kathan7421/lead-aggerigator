import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../authguard.service';
import { CategoryComponent } from './category/category.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { BannersComponent } from './banners/banners.component';
import { DashboardResolver } from './dashboard/dashboard-resolver.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { CountryComponent } from './country/country.component';
import { AdminlayoutComponent } from './adminlayout/adminlayout.component';

const adminRoutes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  {
    path: '',
    canActivate: [AuthGuard], // Use AuthGuard to protect admin routes
    component: AdminlayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, resolve: { counts: DashboardResolver }, data: { title: 'Dashboard' } },
      { path: 'category', component: CategoryComponent, data: { title: 'Category Management' } },
      { path: 'product', component: ProductsComponent, data: { title: 'Product Management' } },
      { path: 'orders', component: OrdersComponent, data: { title: 'Order Management' } },
      { path: 'banners', component: BannersComponent, data: { title: 'Banner Management' } },
      { path: 'country', component: CountryComponent, data: { title: 'Country Management' } },
      // { path: '**', redirectTo: 'dashboard' } // Redirect unknown child routes to dashboard or handle as per your application logic
      { path: '**', component: NotFoundComponent, data: { title: '404 Not Found' } },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }