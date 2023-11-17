import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { ErrorCode, MessageType } from '@constants/app.constants';
import { Observable, catchError } from 'rxjs';
import { CreatePurchase } from '../models/purchase.model';
import { AlertToastrService } from './alert-toastr.service';
import { PurchaseService } from './purchase.service';

export const PurchaseDetailService: ResolveFn<Observable<CreatePurchase | {}>> =
  (route: ActivatedRouteSnapshot, _: RouterStateSnapshot) => {
    const purchaseService = inject(PurchaseService);
    const toasterService = inject(AlertToastrService);
    const router = inject(Router);

    return purchaseService.getPurchaseDetail(route.params.id)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === ErrorCode.badRequest) {
          toasterService.displaySnackBarWithTranslation('toasterMessage.invalidPurchase', MessageType.error);
        }
        router.navigate(['/admin/purchase']);
        return null;
      }));
  };
