import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from './company.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyserviceService {
  private apiUrl = `${environment.apibaseUrl}company`;
  constructor(private http: HttpClient) { }

  getCompany():Observable<{companies: Company[]}>{
    return this.http.get<{companies: Company[]}>(this.apiUrl);
  }
}
