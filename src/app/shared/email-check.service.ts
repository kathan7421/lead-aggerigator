import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailCheckService {
    private apiUrl = `${environment.apibaseUrl}`;
  constructor(private http: HttpClient) {}

  checkEmailExists(email: string,userId:number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email`, {
        params: { email, userId: userId.toString() }
      });
  }
}
