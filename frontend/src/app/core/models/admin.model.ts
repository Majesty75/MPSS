import { AccountingStatus } from "@constants/app.constants";
import { ActionToolbar } from "@models/common.model";

export interface RedemptionList {
  records: RedemptionDetail[] | null;
  totalCount: number;
}

export interface RedemptionDetail {
  affiliatePartner: string;
  cardType: string;
  cardCode: string;
  date: string;
  shopOrderNumber: string;
  shopStatus: string;
  billingPositions: number;
  trackingUrl: string;
  action: ActionToolbar[];
}

export interface DashboardAccountingStats {
  dailySales: number;
  dailyPurchases: number;
  monthlySales: number;
  monthlyPurchases: number;
}
export interface TopPartners {
  companyName: string;
  totalRevenue: number;
}

export interface DailySales {
  day: number;
  revenue: number;
}

export interface MonthlySales {
  date: Date;
  month: string;
  year: string;
  dailyRevenues: DailySales[];
}

export interface DashboardMonthlySalesParams {
  date: Date;
}

export interface InvoiceList {
  records: InvoiceDetail[] | null;
  totalCount: number;
}

export interface InvoiceDetail {
  affiliatePartner: string;
  accountingDate: string;
  billable: number;
  status: AccountingStatus;
  id: string;
  type: string;
}