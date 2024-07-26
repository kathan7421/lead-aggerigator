import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ReviewsService } from './reviews.service';
import { Review } from './reviews.model';

@Injectable({
  providedIn: 'root'
})

  export class ReviewResolver implements Resolve<{ data: any }> {
    constructor(private reviewService: ReviewsService) {}
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ data: any }> {
      return this.reviewService.getReviews();
    }
  }
  