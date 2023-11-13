import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { ErrorCode, MessageType } from '@constants/app.constants';
import { Observable, catchError } from 'rxjs';
import { CreatePart } from '../models/part.model';
import { AlertToastrService } from './alert-toastr.service';
import { PartService } from './part.service';

export const PartDetailService: ResolveFn<Observable<CreatePart | {}>> =
  (route: ActivatedRouteSnapshot, _: RouterStateSnapshot) => {
    const partService = inject(PartService);
    const toasterService = inject(AlertToastrService);
    const router = inject(Router);

    return partService.getPartDetail(route.params.uuid)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === ErrorCode.badRequest) {
          toasterService.displaySnackBarWithTranslation('toasterMessage.invalidPart', MessageType.error);
        }
        router.navigate(['/admin/part']);
        return null;
      }));
  };
