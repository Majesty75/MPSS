import { Injectable } from '@angular/core';
import { CreateVendor, VendorDetail, VendorList, VendorListQueryParams } from '@app/core/models/vendor.model';
import { API_ROUTES } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { HttpClientService } from '@services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  vendorDetail: CreateVendor;
  breadcrumbs: BreadCrumb[];
  constructor(
    private httpClientService: HttpClientService
  ) { }

  getVendors(): Observable<VendorDetail[]> {
    return this.httpClientService.get(API_ROUTES.vendorsApi);
  }

  getVendorList(params: Partial<VendorListQueryParams>): Observable<VendorList> {
    return this.httpClientService.get(API_ROUTES.vendorListApi, { params });
  }

  addVendor(params: Partial<CreateVendor>): Observable<any> {
    return this.httpClientService.post(API_ROUTES.vendorsApi, params);
  }

  getVendorDetail(id: number): Observable<CreateVendor> {
    return this.httpClientService.get(`${API_ROUTES.vendorsApi}/${id}`, {
      headers: {
        'X-CP-BIT': 'false'
      }
    });
  }

  updateVendorDetail(params: Partial<CreateVendor>, id: number): Observable<any> {
    return this.httpClientService.put(`${API_ROUTES.vendorsApi}/${id}`, params);
  }

  deleteVendor(id: number): Observable<any> {
    return this.httpClientService.delete(`${API_ROUTES.vendorsApi}/${id}`);
  }

}
