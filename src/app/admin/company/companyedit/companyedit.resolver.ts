import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';


import { Company } from '../company.model';
import { CompanyserviceService } from '../companyservice.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyEditResolver implements Resolve<{ company: Company } | null> {

  constructor(private companyService: CompanyserviceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ company: Company } | null> {
    const companyId = Number(route.paramMap.get('id'));
    return this.companyService.getCompanyById(companyId);
    
  }
}
