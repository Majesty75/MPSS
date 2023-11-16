import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { ErrorCode, MessageType } from '@constants/app.constants';
import { Observable, catchError } from 'rxjs';
import { CreateSale } from '../models/sale.model';
import { AlertToastrService } from './alert-toastr.service';
import { SaleService } from './sale.service';

export const SaleDetailService: ResolveFn<Observable<CreateSale | {}>> =
  (route: ActivatedRouteSnapshot, _: RouterStateSnapshot) => {
    const saleService = inject(SaleService);
    const toasterService = inject(AlertToastrService);
    const router = inject(Router);

    return saleService.getSaleDetail(route.params.id)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === ErrorCode.badRequest) {
          toasterService.displaySnackBarWithTranslation('toasterMessage.invalidSale', MessageType.error);
        }
        router.navigate(['/admin/sale']);
        return null;
      }));
  };
