import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductListResponse ,Product } from './product.model';
import { ProductserviceService } from './productservice.service';
@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<{ data: Product[] }> {
  constructor(private productservice: ProductserviceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ data: Product[] }> {
    return this.productservice.getAllproduct();
  }
}
