// banner-resolver.service.ts

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Banners } from './banners.model'; // Replace with correct path
import { BannersService } from './banners.service'; // Replace with correct path

@Injectable({
  providedIn: 'root'
})
export class BannerResolver implements Resolve<{ banners: Banners[] }> {

  constructor(private bannerService: BannersService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ banners: Banners[] }> {
    return this.bannerService.getBanners().pipe(
      catchError(error => {
        console.error('Error fetching banners:', error);
        // Handle errors here (e.g., show error message)
        return of({ banners: [] }); // Return empty array or handle error response
      })
    );
  }
}
