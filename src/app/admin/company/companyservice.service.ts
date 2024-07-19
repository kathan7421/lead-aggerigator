import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company,CountResponse,DeleteResponse } from './company.model';
import { environment } from 'src/environments/environment';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyserviceService {
  private apiUrl = `${environment.apibaseUrl}company`;
  constructor(private http: HttpClient) { }
  logoPreview: any;
  getCompany(): Observable<{ data: Company[] }> {
    return this.http.get<{ data: Company[] }>(this.apiUrl);
  }
  updateCompanyStatus(companyId:number, newStatus: number): Observable<Company>{
    return this.http.post<Company>(`${this.apiUrl}/changestatus/${companyId}`,{status:newStatus});
  }
  deleteCompany(companyId:number): Observable<DeleteResponse>{
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${companyId}`);
  }
  addCompany(formData: Company): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, formData);
  }
  updateCompany(companyId:number,formData: Company):Observable<Company>{
    return this.http.post<Company>(`${this.apiUrl}/update/${companyId}`,formData);
  }
  getCompanyById(companyId:number):Observable<{company:Company}>{
    return this.http.get<{company:Company}>(`${this.apiUrl}/${companyId}`);
  }
  activeCompany(user_id:number):Observable<Company>{
    return this.http.post<Company>(`${this.apiUrl}/activecompany/${user_id}`,{active:true});
  }
  deleteCompanies(companyIds:number[]):Observable<DeleteResponse>{
    return this.http.delete<DeleteResponse>(`${this.apiUrl}`,{body:{companyIds}});
  }
  getCount(): Observable<CountResponse> {
    // Assuming your backend API expects a POST request to get the count
    return this.http.post<CountResponse>(`${this.apiUrl}/getcountcompany`, {});
  }
  exportCompaniesToCsv() {
    return this.http.get(this.apiUrl, { responseType: 'blob' });
  }
 
  
}
