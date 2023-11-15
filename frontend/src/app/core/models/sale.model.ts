import { FormControl, FormGroup } from "@angular/forms";
import { ActionToolbar } from "@models/common.model";

export interface CreateSale {
    isActive: boolean;
    email: string;
    companyName: string;
    address: Partial<Address>;
    name: string;
    phoneNo: string;
    webAddress: string;
    currency: string;
    locale: string;
    id: string;
}

export interface Address {
    city: string;
    zip: string;
    country: string;
    street: string;
}

export interface AddSaleForm {
    isActive: FormControl<boolean>,
    email: FormControl<string>,
    address: FormGroup<SaleAddress>,
    companyName: FormControl<string>,
    name: FormControl<string>,
    phoneNo: FormControl<string>,
    webAddress: FormControl<string>,
    currency: FormControl<string>,
    locale: FormControl<string>,
}

export interface SaleAddress {
    street: FormControl<string>,
    zip: FormControl<string>,
    city: FormControl<string>,
    country: FormControl<string>,
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
    customerNo: string;
    records: InventoryRecord[];
    saleAction: ActionToolbar[];
}

export interface InventoryRecord {
    recordId: number;
    txrId: number;
    trxType: number;
    partId: number;
    quantity: number;
    price: number;
    total: number;
    date: Date;
}