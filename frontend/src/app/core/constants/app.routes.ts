import { Routes } from "@angular/router";
import { LoginGuard } from "@guards/login.guard";
import { AuthGuard } from "@guards/auth.guard";

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@constants/auth.routes').then((m) => m.authRoutes),
    canMatch: [LoginGuard]
  },
  {
    path: '',
    loadComponent: () => import('@pages/pages.component').then((m) => m.PagesComponent),
    canMatch: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
      },
      {
        path: 'admin',
        loadChildren: () => import('@constants/admin.routes').then((m) => m.adminRoutes),
      }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
]