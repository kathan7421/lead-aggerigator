// cms-resolver.service.ts

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cms } from './cms.model'; // Adjust path as per your project
import { CmsserviceService } from './cmsservice.service';// Adjust path as per your project

@Injectable({
  providedIn: 'root'
})
export class CmsResolver implements Resolve<{ data: Cms[] }> {

  constructor(private cmsService: CmsserviceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ data: Cms[] }> {
    return this.cmsService.getCms().pipe(
      catchError(error => {

        // Handle errors here (e.g., show error message)
        return of({ data: [] }); // Return empty array or handle error response
      })
    );
  }
}
