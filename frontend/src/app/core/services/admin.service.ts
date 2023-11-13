import { Injectable } from '@angular/core';
import { VendorListQueryParams } from '@app/core/models/vendor.model';
import { API_ROUTES } from '@constants/app.constants';
import { DashboardAccountingStats, InvoiceList, PerformanceOverview, PerformanceStatsParams, RedemptionList, TopPartners } from '@models/admin.model';
import { HttpClientService } from '@services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  getDashboardAccountingStats(): Observable<DashboardAccountingStats> {
    return this.httpClientService.get(API_ROUTES.dashboardAccountingStatsApi);
  }

  getDashboardPerformanceStats(params: PerformanceStatsParams): Observable<PerformanceOverview[]> {
    return this.httpClientService.get(API_ROUTES.dashboardPerformanceOverviewApi, { params });
  }

  getTopPartners(): Observable<TopPartners[]> {
    return this.httpClientService.get(API_ROUTES.dashboardTopPartnersApi);
  }

  getLatestRedemptionList(params: Partial<VendorListQueryParams>): Observable<RedemptionList> {
    return this.httpClientService.get(API_ROUTES.redemptionListApi, { params })
  }

  getExchangeRate(): Observable<number> {
    return this.httpClientService.get(API_ROUTES.exchangeRateApi);
  }

  saveExchangeRate(params: { exchangeRate: number }): Observable<[] | null> {
    return this.httpClientService.patch(API_ROUTES.exchangeRateApi, params);
  }

  getOpenInvoiceList(params: Partial<VendorListQueryParams>): Observable<InvoiceList> {
    return this.httpClientService.get(API_ROUTES.openInvoiceListApi, { params });
  }
}
