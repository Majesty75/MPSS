import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateSale, SaleList, SaleListQueryParams } from '@app/core/models/sale.model';
import { API_ROUTES } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { HttpClientService } from '@services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  partnerDetail: CreateSale;
  breadcrumbs: BreadCrumb[];
  constructor(
    private httpClientService: HttpClientService
  ) { }

  getSaleList(params: Partial<SaleListQueryParams>): Observable<SaleList> {
    return this.httpClientService.get(API_ROUTES.saleListApi, { params });
  }

  addSale(params: Partial<CreateSale>): Observable<[] | null> {
    return this.httpClientService.post(API_ROUTES.addSaleApi, params);
  }

  getSaleDetail(id: string): Observable<CreateSale> {
    return this.httpClientService.get(`${API_ROUTES.addSaleApi}/${id}`, {
      headers: {
        'X-CP-BIT': 'false'
      }
    });
  }

  updateSaleDetail(params: Partial<CreateSale>, id: string): Observable<[] | null> {
    return this.httpClientService.patch(`${API_ROUTES.addSaleApi}/${id}`, params);
  }

  downloadExcel(id: string): Observable<HttpResponse<Blob>> {
    return this.httpClientService.get(`${API_ROUTES.downloadExcelApi}/${id}`, {
      observe: 'response', responseType: 'blob',
      headers: {
        'X-CP-BIR': 'true'
      }
    });
  }

}
