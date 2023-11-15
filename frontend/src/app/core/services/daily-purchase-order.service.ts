import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { HttpClientService } from '@services/http-client.service';
import { Observable } from 'rxjs';
import { DailyPurchaseOrder, DailyPurchaseOrderListQueryParams } from '../models/daily-purchase-order.model';
import { CreatePart } from '../models/part.model';

@Injectable({
    providedIn: 'root'
})
export class DailyPurchaseOrderService {

    partDetail: CreatePart;
    breadcrumbs: BreadCrumb[];
    constructor(
        private httpClientService: HttpClientService
    ) { }

    getDailyPurchaseOrderList(params: Partial<DailyPurchaseOrderListQueryParams>): Observable<DailyPurchaseOrder> {
        return this.httpClientService.post(API_ROUTES.dailyPurchaseOrderListApi, { ...params });
    }

}
