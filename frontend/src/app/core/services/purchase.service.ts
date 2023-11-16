import { Injectable } from '@angular/core';
import { CreatePurchase, PurchaseList, PurchaseListQueryParams } from '@app/core/models/purchase.model';
import { API_ROUTES } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { HttpClientService } from '@services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  partnerDetail: CreatePurchase;
  breadcrumbs: BreadCrumb[];
  constructor(
    private httpClientService: HttpClientService
  ) { }

  getPurchaseList(params: Partial<PurchaseListQueryParams>): Observable<PurchaseList> {
    return this.httpClientService.get(API_ROUTES.purchaseListApi, { params });
  }

  addPurchase(params: Partial<CreatePurchase>): Observable<any> {
    return this.httpClientService.post(API_ROUTES.purchasesApi, params);
  }

  getPurchaseDetail(id: string): Observable<CreatePurchase> {
    return this.httpClientService.get(`${API_ROUTES.purchasesApi}/${id}`, {
      headers: {
        'X-CP-BIT': 'false'
      }
    });
  }

  updatePurchaseDetail(params: Partial<CreatePurchase>, id: string): Observable<any> {
    return this.httpClientService.patch(`${API_ROUTES.purchasesApi}/${id}`, params);
  }

  deletePurchase(id: number): Observable<any> {
    return this.httpClientService.delete(`${API_ROUTES.purchasesApi}/${id}`);
  }

}
