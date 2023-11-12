import { ActionToolbar } from "@models/common.model";
import { AccountingStatus } from "@constants/app.constants";

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
  totalCards: number;
  activated: number;
  revenueInitialCost: number;
  revenueActivations: number;
  billingPositions: number;
}
export interface TopPartners {
  companyName: string;
  totalRevenue: number;
}
export interface PerformanceOverview {
  day: number;
  count: number;
}
export interface PerformanceStats {
  topPartners: TopPartners[];
  performanceOverview: PerformanceOverview[];
}

export interface PerformanceStatsParams {
  dateFilter: string;
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
  uuid: string;
  type: string;
}