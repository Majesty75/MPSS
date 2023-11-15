import { FormControl, FormGroup } from "@angular/forms";
import { ActionToolbar } from "@models/common.model";
import { InventoryRecord } from "./sale.model";
import { VendorDetail } from "./vendor.model";

export interface CreatePurchase {
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

export interface AddPurchaseForm {
    isActive: FormControl<boolean>,
    email: FormControl<string>,
    address: FormGroup<PurchaseAddress>,
    companyName: FormControl<string>,
    name: FormControl<string>,
    phoneNo: FormControl<string>,
    webAddress: FormControl<string>,
    currency: FormControl<string>,
    locale: FormControl<string>,
}

export interface PurchaseAddress {
    street: FormControl<string>,
    zip: FormControl<string>,
    city: FormControl<string>,
    country: FormControl<string>,
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
    total: number;
    date: Date;
    vendorName: string;
    vendor: VendorDetail;
    records: InventoryRecord[];
    purchaseAction: ActionToolbar[];
}