import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontendRoutingModule } from './frontend-routing.module';
import { SharedModule } from 'primeng/api';
import { CmspagesComponent } from './cmspages/cmspages.component';



@NgModule({
  declarations: [
    CmspagesComponent
  ],
  imports: [
    CommonModule,
    FrontendRoutingModule,
    SharedModule,
  ]
})
export class FrontendModule { }
