import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FrontLayoutComponent } from '../shared/front-layout/front-layout.component';
import { CmspagesComponent } from './cmspages/cmspages.component';
import { NotFoundComponent } from '../admin/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    component: FrontLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: ':slug', component: CmspagesComponent  },
     
      // other frontend routes...
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }
