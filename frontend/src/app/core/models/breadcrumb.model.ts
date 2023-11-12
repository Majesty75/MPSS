export interface BreadCrumb {
  label: string;
  url: string;
}

export interface BreadcrumbEventModel {
  breadcrumbs: BreadCrumb[];
  showLastItemCustomLabel?: boolean;
  lastItemCustomLabel?: string;
}