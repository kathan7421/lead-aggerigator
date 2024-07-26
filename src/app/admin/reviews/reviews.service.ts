import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Review,DeleteResponse } from './reviews.model';
@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = `${environment.apibaseUrl}reviews`;

  constructor(private http:HttpClient) { }


  getReviews():Observable<{data: Review[]}>{
    return this.http.get<{data: Review[]}>(this.apiUrl);
  }
}
