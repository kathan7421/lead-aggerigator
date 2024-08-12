import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Review,DeleteResponse, ChangeStatusResponse, AddReview } from './reviews.model';
@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = `${environment.apibaseUrl}reviews`;

  constructor(private http:HttpClient) { }


  getReviews():Observable<{data: Review[]}>{
    return this.http.get<{data: Review[]}>(this.apiUrl);
  }
  changeStatus(reviewId:number,newStatus:number):Observable<ChangeStatusResponse>{
    return this.http.post<ChangeStatusResponse>(`${this.apiUrl}/changestatus/${reviewId}`, { status: newStatus });
  }
  addreview(reviewData:AddReview) :Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/store`,reviewData);
  }
  updateReview(reviewId:number,updateData:Review):Observable<Review>{
    return this.http.put<Review>(`${this.apiUrl}/update/${reviewId}`,updateData);
  }
}
