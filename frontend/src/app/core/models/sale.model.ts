import { FormControl } from "@angular/forms";
import { ActionToolbar } from "@models/common.model";
import { Record } from "./record.model";

export interface CreateSale {
    saleNumber: string;
    date: string;
    customerName: string;
    customerContact: string;
    records: Partial<Record>[];
}

export interface AddSaleForm {
    saleNumber: FormControl<string>,
    date: FormControl<Date>,
    customerName: FormControl<string>,
    customerContact: FormControl<string>
}

export interface SaleListQueryParams {
    sort: string;
    page: number;
    pageSize: number;
    search: string;
}

export interface SaleList {
    records: SaleDetail[] | null;
    totalCount: number;
}

export interface SaleDetail {
    id: number;
    saleNumber: string;
    date: Date;
    total: number;
    customerName: string;
    customerContact: string;
    records: Partial<Record>[];
    saleAction: ActionToolbar[];
}