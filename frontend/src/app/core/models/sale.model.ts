import { FormControl } from "@angular/forms";
import { ActionToolbar } from "@models/common.model";

export interface CreateSale {
    saleNumber: string;
    date: Date;
    customerName: string;
    customerContact: string;
    records: Partial<Record>[];
}

export interface Address {
    city: string;
    zip: string;
    country: string;
    street: string;
}

export interface AddSaleForm {
    saleNumber: FormControl<string>,
    date: FormControl<Date>,
    customerName: FormControl<string>,
    customerContact: FormControl<string>
}

export interface AddRecordForm {
    id: FormControl<number>,
    partId: FormControl<number>,
    quantity: FormControl<number>,
    price: FormControl<number>,
    partName: FormControl<string>
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

export interface Record {
    id: number;
    partId: number;
    partName?: string;
    quantity: number;
    price: number;
    total: number;
    date: Date;
    recordAction: ActionToolbar[];
}