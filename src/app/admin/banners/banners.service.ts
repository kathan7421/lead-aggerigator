import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Banners,DeleteResponse } from './banners.model';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class BannersService {
  private apiUrl = `${environment.apibaseUrl}banners`;


  constructor(private http:HttpClient) { }

  addBanner(newBannerData:Banners): Observable <Banners> {
    return this.http.post<Banners>(`${this.apiUrl}/add`,newBannerData);
  }
  getBanners(): Observable<{ banners: Banners[] }> {
    return this.http.get<{ banners: Banners[] }>(this.apiUrl);
  }
  upateBanners(bannerId:number,updateData: Banners): Observable<Banners>{
    return this.http.post<Banners>(`${this.apiUrl}/update/${bannerId}`,updateData);
  }
  getBannerById(bannerId:number):Observable<{data:Banners}>{
    return this.http.get<{data: Banners}>(`${this.apiUrl}/${bannerId}`);
  }
  deleteBanner(bannerId:number):Observable<DeleteResponse>{
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${bannerId}`);

  }
  updateBannerStatus(bannerId:number,newStatus:number):Observable<Banners>{
    return this.http.post<Banners>(`${this.apiUrl}/changestatus/${bannerId}`,{status:newStatus});
  }
  deleteAll(bannerIds:number[]):Observable<DeleteResponse>{
    return this.http.delete<DeleteResponse>(`${this.apiUrl}`,{body:{bannerIds}});
  }
}
