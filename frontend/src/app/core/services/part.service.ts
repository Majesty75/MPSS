import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { HttpClientService } from '@services/http-client.service';
import { Observable } from 'rxjs';
import { CreatePart, PartDetail, PartList, PartListQueryParams } from '../models/part.model';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  partDetail: CreatePart;
  breadcrumbs: BreadCrumb[];
  constructor(
    private httpClientService: HttpClientService
  ) { }

  getPartList(params: Partial<PartListQueryParams>): Observable<PartList> {
    return this.httpClientService.get(API_ROUTES.partListApi, { params });
  }

  getAllParts(): Observable<PartDetail[]> {
    return this.httpClientService.get(API_ROUTES.partsApi);
  }

  addPart(params: Partial<CreatePart>): Observable<any> {
    return this.httpClientService.post(API_ROUTES.partsApi, params);
  }

  getPartDetail(id: number): Observable<CreatePart> {
    return this.httpClientService.get(`${API_ROUTES.partsApi}/${id}`, {
      headers: {
        'X-CP-BIT': 'false'
      }
    });
  }

  updateVendorDetail(params: Partial<CreatePart>, id: number): Observable<any> {
    return this.httpClientService.put(`${API_ROUTES.partsApi}/${id}`, params);
  }

  deletePart(id: number): Observable<any> {
    return this.httpClientService.delete(`${API_ROUTES.partsApi}/${id}`);
  }

}
