import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FrontLayoutComponent } from '../shared/front-layout/front-layout.component';
import { CmspagesComponent } from './cmspages/cmspages.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CmsPageResolver } from './cmspages/cmspages.resolver';


const routes: Routes = [
  {
    path: '',
    component: FrontLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: ':slug', component: CmspagesComponent ,resolve: { cmsPages: CmsPageResolver } },

      // { path: '**', component: NotFoundComponent }
     
      // other frontend routes...
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }
