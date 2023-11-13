import { HttpResponse } from '@angular/common/http';
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

  addPurchase(params: Partial<CreatePurchase>): Observable<[] | null> {
    return this.httpClientService.post(API_ROUTES.addPurchaseApi, params);
  }

  getPurchaseDetail(uuid: string): Observable<CreatePurchase> {
    return this.httpClientService.get(`${API_ROUTES.addPurchaseApi}/${uuid}`, {
      headers: {
        'X-CP-BIT': 'false'
      }
    });
  }

  updatePurchaseDetail(params: Partial<CreatePurchase>, uuid: string): Observable<[] | null> {
    return this.httpClientService.patch(`${API_ROUTES.addPurchaseApi}/${uuid}`, params);
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
