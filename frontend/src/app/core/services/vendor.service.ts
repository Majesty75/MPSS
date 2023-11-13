import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateVendor, VendorList, VendorListQueryParams } from '@app/core/models/vendor.model';
import { API_ROUTES } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { HttpClientService } from '@services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  partnerDetail: CreateVendor;
  breadcrumbs: BreadCrumb[];
  constructor(
    private httpClientService: HttpClientService
  ) { }

  getVendorList(params: Partial<VendorListQueryParams>): Observable<VendorList> {
    return this.httpClientService.get(API_ROUTES.vendorListApi, { params });
  }

  addVendor(params: Partial<CreateVendor>): Observable<[] | null> {
    return this.httpClientService.post(API_ROUTES.addVendorApi, params);
  }

  getVendorDetail(uuid: string): Observable<CreateVendor> {
    return this.httpClientService.get(`${API_ROUTES.addVendorApi}/${uuid}`, {
      headers: {
        'X-CP-BIT': 'false'
      }
    });
  }

  updateVendorDetail(params: Partial<CreateVendor>, uuid: string): Observable<[] | null> {
    return this.httpClientService.patch(`${API_ROUTES.addVendorApi}/${uuid}`, params);
  }

  downloadExcel(uuid: string): Observable<HttpResponse<Blob>> {
    return this.httpClientService.get(`${API_ROUTES.downloadExcelApi}/${uuid}`, {
      observe: 'response', responseType: 'blob',
      headers: {
        'X-CP-BIR': 'true'
      }
    });
  }

}