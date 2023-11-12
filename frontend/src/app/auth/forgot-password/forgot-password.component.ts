import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticationService } from '@services/authentication.service';
import { MessageType, REGEX_CONSTANTS } from '@constants/app.constants';
import { AlertToastrService } from '@services/alert-toastr.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, TranslateModule, CpButtonComponent, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  isSubmitted = false;
  
  readonly emailRegex = REGEX_CONSTANTS.EMAIL_REGEX;
  readonly passwordRegex = REGEX_CONSTANTS.PASSWORD_REGEX;
  private destroyRef = inject(DestroyRef);

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private toasterService: AlertToastrService
  ) {}

  click(form: NgForm): boolean | void {
    if (form.invalid) {
      return true;
    }
    this.isSubmitted = true;
    this.authenticationService.forgotPassword(form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.forgotPasswordSuccessful', MessageType.success);
          this.router.navigate(['/auth/login']);
          this.isSubmitted = false;
        },
        error: () => {
          this.isSubmitted = false;
        }
      })
  }

  backToLogin(): void {
    !this.isSubmitted && this.router.navigate(['/auth/login']);
  }
}
