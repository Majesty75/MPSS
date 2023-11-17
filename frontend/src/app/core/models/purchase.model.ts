import { FormControl } from "@angular/forms";
import { ActionToolbar } from "@models/common.model";
import { Record } from "@models/record.model";

export interface CreatePurchase {
    purchaseNumber: string;
    date: Date;
    vendorId: number;
    records: Partial<Record>[];
}

export interface AddPurchaseForm {
    purchaseNumber: FormControl<string>,
    date: FormControl<Date>,
    vendorId: FormControl<number>
}

export interface PurchaseListQueryParams {
    sort: string;
    page: number;
    pageSize: number;
    search: string;
}

export interface PurchaseList {
    records: PurchaseDetail[] | null;
    totalCount: number;
}

export interface PurchaseDetail {
    id: number;
    purchaseNumber: string;
    date: Date;
    total: number;
    customerName: string;
    customerContact: string;
    records: Partial<Record>[];
    purchaseAction: ActionToolbar[];
}