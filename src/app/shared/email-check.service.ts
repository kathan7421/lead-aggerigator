import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailCheckService {
  private apiUrl = `${environment.apibaseUrl}check-email-exists`;

  constructor(private http: HttpClient) {}

  checkEmailExists(email: string, id?: number): Observable<{ exists: boolean }> {
    let url = `${this.apiUrl}?email=${email}`;
    if (id !== undefined && id !== null) {
      url += `&id=${id}`;
    }
    return this.http.get<{ exists: boolean }>(url);
  }
}
