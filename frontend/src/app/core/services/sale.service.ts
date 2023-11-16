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

  saleDetail: CreateSale;
  breadcrumbs: BreadCrumb[];
  constructor(
    private httpClientService: HttpClientService
  ) { }

  getSaleList(params: Partial<SaleListQueryParams>): Observable<SaleList> {
    return this.httpClientService.get(API_ROUTES.saleListApi, { params });
  }

  addSale(params: Partial<CreateSale>): Observable<any> {
    return this.httpClientService.post(API_ROUTES.salesApi, params);
  }

  getSaleDetail(id: number): Observable<CreateSale> {
    return this.httpClientService.get(`${API_ROUTES.salesApi}/${id}`, {
      headers: {
        'X-CP-BIT': 'false'
      }
    });
  }

  updateSaleDetail(params: Partial<CreateSale>, id: number): Observable<any> {
    return this.httpClientService.put(`${API_ROUTES.salesApi}/${id}`, params);
  }

  deleteSale(id: number): Observable<any> {
    return this.httpClientService.delete(`${API_ROUTES.salesApi}/${id}`);
  }

}
