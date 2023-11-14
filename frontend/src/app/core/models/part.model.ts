import { FormControl } from "@angular/forms";
import { ActionToolbar } from "@models/common.model";
import { VendorDetail } from "./vendor.model";

export interface CreatePart {
    partName: string;
    partNumber: string;
    cost: number;
    sellPrice: number;
    vendorId: number;
}

export interface AddPartForm {
    partName: FormControl<string>;
    partNumber: FormControl<string>;
    cost: FormControl<number>;
    sellPrice: FormControl<number>;
    vendorId: FormControl<number>;
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