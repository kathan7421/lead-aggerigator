import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontendRoutingModule } from './frontend-routing.module';
import { SharedModule } from 'primeng/api';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FrontendRoutingModule,
    SharedModule,
  ]
})
export class FrontendModule { }
