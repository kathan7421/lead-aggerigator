import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CmspagesService } from './cmspages.service';

@Injectable({
  providedIn: 'root'
})
export class CmsPageResolver implements Resolve<any> {
  constructor(private cmsService: CmspagesService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const slug = route.paramMap.get('slug');
    return this.cmsService.getCmsPage(slug!).pipe(
      map(data => {
        if (data && data.title && data.content) {
          return data;
        } else {
          this.router.navigate(['/not-found']);
          return null;
        }
      }),
      catchError(() => {
        this.router.navigate(['/not-found']);
        return of(null);
      })
    );
  }
}
