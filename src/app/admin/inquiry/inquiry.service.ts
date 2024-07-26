import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inquiry,DeleteResponse } from './inquiry.model';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
private apiUrl = `${environment.apibaseUrl}inquiry`;
private apiUrls = `${environment.apibaseUrl}`;
  constructor(private http:HttpClient) { }


  getInquiry(startDate?: string, endDate?: string): Observable<{ data: Inquiry[] }> {
    let params = new HttpParams();
    if (startDate) {
      params = params.append('startdate', startDate);
    }
    if (endDate) {
      params = params.append('end_date', endDate);
    }

    return this.http.get<{ data: Inquiry[] }>(`${this.apiUrl}`, { params });
  }
  sendInquiries(inquiryIds: number[], companyIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrls}send-inquiries`, {
      inquiry_ids: inquiryIds,
      company_ids: companyIds
    });
  }
  
 bulkDelete(inquiryIds:number[]):Observable<DeleteResponse>{
  return this.http.delete<DeleteResponse>(`${this.apiUrl}`,{body:{inquiryIds}})
 }
  
  updateStatus(inquiryId:number,newStatus:number):Observable<Inquiry>{
    return this.http.post<Inquiry>(`${this.apiUrl}/changestatus/${inquiryId}`,{status:newStatus});
  }
  deleteInquiry(inquiryId:number):Observable<DeleteResponse>{
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${inquiryId}`);
  }
  getById(inquiryId:number):Observable<{data:Inquiry}>{
    return this.http.get<{data:Inquiry}>(`${this.apiUrl}/${inquiryId}`);
  }
  exportInquiriesToCsv() {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }
  restoreAll(inquiryIds?: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/restore-all`, { inquiry_ids: inquiryIds || [] });
  }
  
}
