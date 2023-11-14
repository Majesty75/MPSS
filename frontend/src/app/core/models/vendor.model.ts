import { FormControl, FormGroup } from "@angular/forms";
import { ActionToolbar } from "@models/common.model";

export interface CreateVendor {
  vendorName: string;
  email: string;
  phoneNo: string;
  address: Partial<Address>;
}

export interface Address {
  city: string;
  zip: string;
  country: string;
  street: string;
}

export interface AddVendorForm {
  vendorName: FormControl<string>,
  email: FormControl<string>,
  phoneNo: FormControl<string>,
  address: FormGroup<VendorAddress>
}

export interface VendorAddress {
  street: FormControl<string>,
  zip: FormControl<string>,
  city: FormControl<string>,
  country: FormControl<string>,
}

export interface VendorListQueryParams {
  sort: string;
  page: number;
  pageSize: number;
  search: string;
}

export interface VendorList {
  records: VendorDetail[] | null;
  totalCount: number;
}
export interface VendorDetail {
  id: number;
  email: string;
  vendorName: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  phoneNo: string;
  vendorAction: ActionToolbar[];
}