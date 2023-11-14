import { Routes } from "@angular/router";
import { VendorDetailService } from "@app/core/services/vendor-detail.service";
import { BreadcrumbResolverFn } from "@services/breadcrumb-resolve.service";
import { PartDetailService } from "../services/part-detail.service";

export const adminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('@pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        data: {
          role: 'admin',
          breadcrumb: 'dashboard',
        },
        resolve: {
          breadcrumbs: BreadcrumbResolverFn,
        }
      },
      {
        path: 'vendor',
        data: {
          breadcrumb: 'vendorList',
        },
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          },
          {
            path: 'list',
            loadComponent: () => import('@pages/vendor-list/vendor-list.component').then((m) => m.VendorListComponent),
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          },
          {
            path: 'add',
            loadComponent: () => import('@pages/vendor-add/vendor-add.component').then((m) => m.VendorAddComponent),
            data: {
              breadcrumb: 'add'
            },
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          },
          {
            path: ':id',
            loadComponent: () => import('@pages/vendor-add/vendor-add.component').then((m) => m.VendorAddComponent),
            data: {
              breadcrumb: 'edit'
            },
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
              vendorDetail: VendorDetailService
            }
          }
        ]
      },
      {
        path: 'part',
        data: {
          breadcrumb: 'partList',
        },
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          },
          {
            path: 'list',
            loadComponent: () => import('@pages/part-list/part-list.component').then((m) => m.PartListComponent),
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          },
          {
            path: 'add',
            loadComponent: () => import('@pages/part-add/part-add.component').then((m) => m.PartAddComponent),
            data: {
              breadcrumb: 'add'
            },
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          },
          {
            path: ':id',
            loadComponent: () => import('@pages/part-add/part-add.component').then((m) => m.PartAddComponent),
            data: {
              breadcrumb: 'edit'
            },
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
              partDetail: PartDetailService
            }
          }
        ]
      },
      {
        path: 'sale',
        data: {
          breadcrumb: 'saleList',
        },
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          },
          {
            path: 'list',
            loadComponent: () => import('@pages/sale-list/sale-list.component').then((m) => m.SaleListComponent),
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          },
          {
            path: 'add',
            loadComponent: () => import('@pages/sale-add/sale-add.component').then((m) => m.SaleAddComponent),
            data: {
              breadcrumb: 'add'
            },
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          },
          {
            path: ':id',
            loadComponent: () => import('@pages/sale-add/sale-add.component').then((m) => m.SaleAddComponent),
            data: {
              breadcrumb: 'edit'
            },
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
              partnerDetail: VendorDetailService
            }
          }
        ]
      },
      {
        path: 'purchase',
        data: {
          breadcrumb: 'purchaseList',
        },
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          },
          {
            path: 'list',
            loadComponent: () => import('@pages/purchase-list/purchase-list.component').then((m) => m.PurchaseListComponent),
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          },
          {
            path: 'add',
            loadComponent: () => import('@pages/purchase-add/purchase-add.component').then((m) => m.PurchaseAddComponent),
            data: {
              breadcrumb: 'add'
            },
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          },
          {
            path: ':id',
            loadComponent: () => import('@pages/purchase-add/purchase-add.component').then((m) => m.PurchaseAddComponent),
            data: {
              breadcrumb: 'edit'
            },
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
              partnerDetail: VendorDetailService
            }
          }
        ]
      },
      {
        path: 'report',
        data: {
          breadcrumb: 'reports',
        },
        children: [
          {
            path: '',
            loadComponent: () => import('@pages/reports/reports.component').then((m) => m.ReportsComponent),
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          }
        ]
      },
    ]
  }
]