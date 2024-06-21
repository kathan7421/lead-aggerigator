import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CountryService } from './country.service';
import { Country } from './country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryResolver implements Resolve<{ data: Country[] }> {
  constructor(private countryService: CountryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ data: Country[] }> {
    return this.countryService.getCountries();
  }
}
