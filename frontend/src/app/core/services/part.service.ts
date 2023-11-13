import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { HttpClientService } from '@services/http-client.service';
import { Observable } from 'rxjs';
import { CreatePart, PartList, PartListQueryParams } from '../models/part.model';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  partnerDetail: CreatePart;
  breadcrumbs: BreadCrumb[];
  constructor(
    private httpClientService: HttpClientService
  ) { }

  getPartList(params: Partial<PartListQueryParams>): Observable<PartList> {
    return this.httpClientService.get(API_ROUTES.vendorListApi, { params });
  }

  addPart(params: Partial<CreatePart>): Observable<[] | null> {
    return this.httpClientService.post(API_ROUTES.addVendorApi, params);
  }

  getPartDetail(uuid: string): Observable<CreatePart> {
    return this.httpClientService.get(`${API_ROUTES.addVendorApi}/${uuid}`, {
      headers: {
        'X-CP-BIT': 'false'
      }
    });
  }

  updateVendorDetail(params: Partial<CreatePart>, uuid: string): Observable<[] | null> {
    return this.httpClientService.patch(`${API_ROUTES.addVendorApi}/${uuid}`, params);
  }

}
