import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from './category-service.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryResolver implements Resolve<{ data: any }> {
  constructor(private categoryService: CategoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ data: any }> {
    return this.categoryService.getCategories();
  }
}
