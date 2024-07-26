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
import { ForgotPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CmsComponent } from './cms/cms.component';
import { CompanyComponent } from './company/company.component';
import { CompanyaddComponent } from './company/companyadd/companyadd.component';
import { CompanyeditComponent } from './company/companyedit/companyedit.component';
import { CompanyviewComponent } from './company/companyview/companyview.component';
import { CountryResolver } from './country/country.resolver';
import { ProductResolver } from './products/product.resolver';
import { CategoryResolver } from './category/category.resolver';
import { BannerResolver } from './banners/banner-resolver';
import { CmsResolver } from './cms/cms.resolver';
import { CompanyResolver } from './company/company.resolver';
import { CompanyModule } from './company/company.module';
import { InquiryComponent } from './inquiry/inquiry.component';
import { InquiryResolver } from './inquiry/inquiry.resolver';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewResolver } from './reviews/reviews.resolver';


const adminRoutes: Routes = [
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  {
    path: '',
    canActivate: [AuthGuard],
    component: AdminlayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, resolve: { counts: DashboardResolver }, data: { title: 'Dashboard' } },
      { path: 'category', component: CategoryComponent, data: { title: 'Category Management' },resolve:{category:CategoryResolver} },
      { path: 'product', component: ProductsComponent, data: { title: 'Service Management' }, resolve:{products :ProductResolver} },
      { path: 'orders', component: OrdersComponent, data: { title: 'Order Management' } },
      { path: 'banners', component: BannersComponent, data: { title: 'Banner Management' }, resolve:{banners :BannerResolver}},
      { path: 'country', component: CountryComponent, data: { title: 'Country Management' }, resolve: { countries: CountryResolver } },
      { path: 'cms',component:CmsComponent, data: {title:'Cms Management'} ,resolve: {cmsData: CmsResolver }},
      { path: 'company', loadChildren: () => import('./company/company.module').then(m => m.CompanyModule) }, // Lazy load CompanyModule 
      {path:'leads',component:InquiryComponent,data:{title:'Leads Management'},resolve: {data:InquiryResolver}},
      {path:'reviews',component:ReviewsComponent,data:{title:'Reviews Management'},resolve: {data:ReviewResolver}},

      { path: '**', component: NotFoundComponent, data: { title: '404 Not Found' } },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes), CompanyModule],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
