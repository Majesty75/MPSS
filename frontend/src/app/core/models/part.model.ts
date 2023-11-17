import { FormControl } from "@angular/forms";
import { ActionToolbar } from "@models/common.model";

export interface CreatePart {
    partName: string;
    partNumber: string;
    quantity: number;
    cost: number;
    sellPrice: number;
    vendorId: number;
}

export interface AddPartForm {
    partName: FormControl<string>;
    partNumber: FormControl<string>;
    quantity: FormControl<number>;
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
    id: number;
    partName: string;
    partNumber: string;
    quantity: number;
    cost: number;
    sellPrice: number;
    vendorId: number;
    partAction: ActionToolbar[];
}