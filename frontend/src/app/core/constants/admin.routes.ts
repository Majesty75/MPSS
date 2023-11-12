import { Routes } from "@angular/router";
import { BreadcrumbResolverFn } from "@services/breadcrumb-resolve.service";
import { PartnerDetailService } from "@services/partner-detail.service";

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
        path: 'partner',
        data: {
          breadcrumb: 'partnerList',
        },
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
          },
          { 
            path: 'list',
            loadComponent: () => import('@pages/partner-list/partner-list.component').then((m) => m.PartnerListComponent),
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          },
          {
            path: 'add',
            loadComponent: () => import('@pages/partner-add/partner-add.component').then((m) => m.PartnerAddComponent),
            data: {
              breadcrumb: 'add'
            },
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
            }
          },
          {
            path: ':uuid',
            loadComponent: () => import('@pages/partner-add/partner-add.component').then((m) => m.PartnerAddComponent),
            data: {
              breadcrumb: 'edit'
            },
            resolve: {
              breadcrumbs: BreadcrumbResolverFn,
              partnerDetail: PartnerDetailService
            }
          }
        ]
      }
    ]
  }
]