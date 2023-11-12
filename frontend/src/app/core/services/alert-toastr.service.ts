import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import { MessageType } from '@constants/app.constants';
@Injectable({
  providedIn: 'root'
})
export class AlertToastrService {

  constructor(
    private matSnackbar: MatSnackBar,
    public translateService: TranslateService,
  ) {}

  displaySnackBarWithoutTranslation(
    message: string,
    type: MessageType,
  ): void {
    if (message) {
      this.matSnackbar.open(message, 'X', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [type + '-snackbar'],
      });
    }
  }

  displaySnackBarWithTranslation(
    message: string,
    type: MessageType,
  ): void {
    const translateMessage = this.translateService.instant(message);
    if (translateMessage) {
      this.matSnackbar.open(translateMessage, 'X', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [type + '-snackbar'],
      });
    }
  }
}
