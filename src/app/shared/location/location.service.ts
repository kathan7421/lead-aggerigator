import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = environment.apibaseUrl;

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any> {
    return this.http.get(`${this.apiUrl}countries`);
  }

  getStates(countryId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}state/${countryId}`);
  }

  getCities(stateId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}city/${stateId}`);
  }
}
