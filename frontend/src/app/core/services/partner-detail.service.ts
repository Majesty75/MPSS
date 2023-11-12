import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { PartnerService } from '@services/partner.service';
import { CreatePartner } from '@models/partner.model';
import { ErrorCode, MessageType } from '@constants/app.constants';
import { AlertToastrService } from './alert-toastr.service';
import { HttpErrorResponse } from '@angular/common/http';

export const PartnerDetailService: ResolveFn<Observable<CreatePartner | {}>> = 
  (route: ActivatedRouteSnapshot, _: RouterStateSnapshot) => {
    const partnerService = inject(PartnerService);
    const toasterService = inject(AlertToastrService);
    const router = inject(Router);

    return partnerService.getPartnerDetail(route.params.uuid)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === ErrorCode.badRequest) {
          toasterService.displaySnackBarWithTranslation('toasterMessage.invalidPartner', MessageType.error);
        }
        router.navigate(['/admin/partner']);
        return null;
      }));
  };
