import { Injectable } from '@angular/core';
import { HttpClientService } from '@services/http-client.service';
import { BuyingRedeemList, CardAccountingStats, CardCodeList, CreatePartner, GenerateCards, PartnerList, PartnerListQueryParams } from '@models/partner.model';
import { Observable } from 'rxjs';
import { API_ROUTES } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  partnerDetail: CreatePartner;
  breadcrumbs: BreadCrumb[];
  constructor(
    private httpClientService: HttpClientService
  ) { }

  getPartnerList(params: Partial<PartnerListQueryParams>): Observable<PartnerList> {
    return this.httpClientService.get(API_ROUTES.partnerListApi, { params });
  }

  addPartner(params: Partial<CreatePartner>): Observable<[] | null> {
    return this.httpClientService.post(API_ROUTES.addPartnerApi, params);
  }

  getPartnerDetail(uuid: string): Observable<CreatePartner> {
    return this.httpClientService.get(`${API_ROUTES.addPartnerApi}/${uuid}`, { 
      headers: {
        'X-CP-BIT': 'false'
      }
    });
  }

  updatePartnerDetail(params: Partial<CreatePartner>, uuid: string): Observable<[] | null> {
    return this.httpClientService.patch(`${API_ROUTES.addPartnerApi}/${uuid}`, params);
  }

  getCardCodeList(uuid: string, params: Partial<PartnerListQueryParams>): Observable<CardCodeList> {
    return this.httpClientService.get(`${API_ROUTES.cardListApi}/${uuid}`, { params });
  }

  generateCardCodes(params: Partial<GenerateCards>): Observable<[] | null> {
    return this.httpClientService.post(API_ROUTES.cardListApi, params);
  }

  updateCardStatus(uuid: string, params: { status: string, error_toast_in_interceptor: boolean }): Observable<[] | null> {
    return this.httpClientService.patch(`${API_ROUTES.cardListApi}/${uuid}`, params);
  }

  downloadExcel(uuid: string): Observable<HttpResponse<Blob>> {
    return this.httpClientService.get(`${API_ROUTES.downloadExcelApi}/${uuid}`, { observe: 'response', responseType: 'blob', 
      headers: {
        'X-CP-BIR': 'true'
      } 
    });
  }

  getCardAccountingStats(uuid: string): Observable<Partial<CardAccountingStats>> {
    return this.httpClientService.get(`${API_ROUTES.accountingStatsApi}/${uuid}`);
  }

  getBuyingBillList(uuid: string, params: Partial<PartnerListQueryParams>): Observable<BuyingRedeemList> {
    return this.httpClientService.get(`${API_ROUTES.buyingBillApi}/${uuid}`, { params });
  }

  getRedeemBillList(uuid: string, params: Partial<PartnerListQueryParams>): Observable<BuyingRedeemList> {
    return this.httpClientService.get(`${API_ROUTES.redeemBillApi}/${uuid}`, { params });
  }

  updateAccountStatus(uuid: string, params: { status: string }): Observable<[] | null> {
    return this.httpClientService.patch(`${API_ROUTES.accountStatusChangeApi}/${uuid}`, params);
  }

}
