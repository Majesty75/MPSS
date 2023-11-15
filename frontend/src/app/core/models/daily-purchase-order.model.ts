export interface DailyPurchaseOrderListQueryParams {
    date: Date;
}

export interface DailyPurchaseOrder {
    dailyPurchaseOrderRecords: DailyPurchaseOrderDetail[] | null;
    date: Date;
}

export interface DailyPurchaseOrderDetail {
    partId: number;
    partName: string;
    quantity: number;
    cost: number;
    vendorId: number;
    vendorName: string;
}