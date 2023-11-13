import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { CreateVendor } from '@app/core/models/vendor.model';
import { VendorService } from '@app/core/services/vendor.service';
import { ErrorCode, MessageType } from '@constants/app.constants';
import { Observable, catchError } from 'rxjs';
import { AlertToastrService } from './alert-toastr.service';

export const VendorDetailService: ResolveFn<Observable<CreateVendor | {}>> =
  (route: ActivatedRouteSnapshot, _: RouterStateSnapshot) => {
    const vendorService = inject(VendorService);
    const toasterService = inject(AlertToastrService);
    const router = inject(Router);

    return vendorService.getVendorDetail(route.params.uuid)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === ErrorCode.badRequest) {
          toasterService.displaySnackBarWithTranslation('toasterMessage.invalidVendor', MessageType.error);
        }
        router.navigate(['/admin/vendor']);
        return null;
      }));
  };
