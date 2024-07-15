import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cms , ChangeStatusResponse, DeleteResponse} from './cms.model';

@Injectable({
  providedIn: 'root'
})
export class CmsserviceService {
  private apiUrl = `${environment.apibaseUrl}cms`;
  
  constructor(private http:HttpClient) { }

  getCms():Observable<{data:Cms[]}>{
    return this.http.get<{data:Cms[]}>(this.apiUrl);
  }
  getCmsById(cmsId:number):Observable<{data:Cms}>{
  return this.http.get<{data: Cms}>(`${this.apiUrl}/get/${cmsId}`);
  }
  addCms(cmsData: Cms): Observable<Cms>{
    return this.http.post<Cms>(`${this.apiUrl}/add`, cmsData);
  }
  updateCms(cmsId: number, cmsData: Cms): Observable<Cms>{
    return this.http.post<Cms>(`${this.apiUrl}/update/${cmsId}`, cmsData);
  }
  deleteCms(cmsId:number):Observable<DeleteResponse>{
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/delete/${cmsId}`);
  }
  updateCmsStatus(cmsId:number,newStatus:number):Observable<Cms>{
    return this.http.post<Cms>(`${this.apiUrl}/changestatus/${cmsId}`,{status:newStatus});
  }
  deleteAll(cmsIds:number[]):Observable<DeleteResponse>{
    return this.http.delete<DeleteResponse>(`${this.apiUrl}`,{body:{cmsIds}});
  }
}
