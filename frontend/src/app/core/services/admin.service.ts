import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/app.constants';
import { DashboardAccountingStats, DashboardMonthlySalesParams, MonthlySales } from '@models/admin.model';
import { HttpClientService } from '@services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  getDashboardStats(): Observable<DashboardAccountingStats> {
    return this.httpClientService.get(API_ROUTES.dashboardStatsApi);
  }

  getDashboardMonthlySales(params: DashboardMonthlySalesParams): Observable<MonthlySales> {
    return this.httpClientService.post(API_ROUTES.dashboardMonthlySalesApi, { ...params });
  }
}
