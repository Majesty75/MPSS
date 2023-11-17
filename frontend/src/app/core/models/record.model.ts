import { FormControl } from "@angular/forms";
import { ActionToolbar } from "./common.model";
import { PartDetail } from "./part.model";

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

export interface AddRecordForm {
    id: FormControl<number>,
    partId: FormControl<number>,
    quantity: FormControl<number>,
    price: FormControl<number>,
    partName: FormControl<string>
}

export interface addRecordDialogData {
    partList: PartDetail[];
    record: Partial<Record>;
    type: RecordType;
}

export enum RecordType {
    Sale,
    Purchase
}