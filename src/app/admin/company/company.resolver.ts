import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Company } from './company.model'; // Ensure correct path to your model
import { CompanyserviceService } from './companyservice.service'; // Your service for fetching companies

@Injectable({
  providedIn: 'root'
})
export class CompanyResolver implements Resolve<{ data: Company[] }> {

  constructor(private companyService: CompanyserviceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ data: Company[] }> {
    
    return this.companyService.getCompany();
    
  }
 
}




