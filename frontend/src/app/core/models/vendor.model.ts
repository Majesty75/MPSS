import { FormControl, FormGroup } from "@angular/forms";
import { ActionToolbar } from "@models/common.model";

export interface CreateVendor {
  isActive: boolean;
  email: string;
  companyName: string;
  address: Partial<Address>;
  name: string;
  phoneNo: string;
  webAddress: string;
  currency: string;
  locale: string;
  uuid: string;
}

export interface Address {
  city: string;
  zip: string;
  country: string;
  street: string;
}

export interface AddVendorForm {
  isActive: FormControl<boolean>,
  email: FormControl<string>,
  address: FormGroup<VendorAddress>,
  companyName: FormControl<string>,
  name: FormControl<string>,
  phoneNo: FormControl<string>,
  webAddress: FormControl<string>,
  currency: FormControl<string>,
  locale: FormControl<string>,
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
  vendorId: number;
  email: string;
  uuid: string;
  vendorName: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  phoneNo: string;
  vendorAction: ActionToolbar[];
}