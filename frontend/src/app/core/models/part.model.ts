import { FormControl, FormGroup } from "@angular/forms";
import { ActionToolbar } from "@models/common.model";
import { VendorDetail } from "./vendor.model";

export interface CreatePart {
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

export interface AddPartForm {
    isActive: FormControl<boolean>,
    email: FormControl<string>,
    address: FormGroup<PartAddress>,
    companyName: FormControl<string>,
    name: FormControl<string>,
    phoneNo: FormControl<string>,
    webAddress: FormControl<string>,
    currency: FormControl<string>,
    locale: FormControl<string>,
}

export interface PartAddress {
    street: FormControl<string>,
    zip: FormControl<string>,
    city: FormControl<string>,
    country: FormControl<string>,
}

export interface PartListQueryParams {
    sort: string;
    page: number;
    pageSize: number;
    search: string;
}

export interface PartList {
    records: PartDetail[] | null;
    totalCount: number;
}
export interface PartDetail {
    partId: number;
    id: string;
    partName: string;
    partNumber: string;
    cost: number;
    sellPrice: number;
    vendor: VendorDetail;
    partAction: ActionToolbar[];
}