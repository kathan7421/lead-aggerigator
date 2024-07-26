import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './inquiry.model';

@Injectable({
  providedIn: 'root'
})

  export class InquiryResolver implements Resolve<{ data: any }> {
    constructor(private inquiryService: InquiryService) {}
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ data: any }> {
      return this.inquiryService.getInquiry();
    }
  }
  