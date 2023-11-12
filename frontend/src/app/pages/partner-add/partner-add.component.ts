import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumb } from '@models/breadcrumb.model';
import { CpEventsService } from '@services/cp-events.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddPartnerForm, PartnerAddress } from '@models/partner.model';
import { COUNTRY_LIST, CURRENCY_LIST, LANGUAGE_LIST, MessageType, RegexType, REGEX_CONSTANTS } from '@constants/app.constants';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { PartnerService } from '@services/partner.service';
import { TranslateModule } from '@ngx-translate/core';
import { AlertToastrService } from '@services/alert-toastr.service';
import { AllowNumberOnlyDirective } from '@directives/allow-number-only.directive';
import { CpTelInputComponent } from '@app/shared/cp-libs/cp-tel-input/cp-tel-input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-partner-add',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, NgSelectModule, FormsModule, CpButtonComponent, ReactiveFormsModule, TranslateModule, AllowNumberOnlyDirective, CpTelInputComponent],
  templateUrl: './partner-add.component.html',
  styleUrls: ['./partner-add.component.scss']
})
export class PartnerAddComponent implements OnInit {

  breadcrumbs: BreadCrumb[] = [];
  addPartnerForm: FormGroup<AddPartnerForm>;
  uuid: string;
  isSubmitted = false;
  isReadOnly = false;
  
  readonly countryList = COUNTRY_LIST;
  readonly currencyList = CURRENCY_LIST;
  readonly languageList = LANGUAGE_LIST;
  readonly emailRegex = REGEX_CONSTANTS.EMAIL_REGEX;
  readonly webUrlRegex = REGEX_CONSTANTS.WEB_URL_REGEX;
  readonly integerRegex = REGEX_CONSTANTS.INTEGER_REGEX;
  readonly regexType = RegexType;
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private cpEventsService: CpEventsService,
    private partnerService: PartnerService,
    private toasterService: AlertToastrService,
    private router: Router
  ) {
    this.breadcrumbs = this.route.snapshot.data.breadcrumbs;
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    if (this.router.url.includes('company-details')) {
      this.isReadOnly = true;
    }
  }

  ngOnInit(): void {
    !this.isReadOnly && this.cpEventsService.cpHeaderDataChanged.emit({ breadcrumbs: this.breadcrumbs });
    this.initializeForm();
    if (this.uuid || this.isReadOnly) {
      const partnerDetail = this.route.snapshot.data.partnerDetail || this.partnerService.partnerDetail;
      this.addPartnerForm.patchValue(partnerDetail);
      this.isReadOnly && this.addPartnerForm.disable();
    }
  }

  initializeForm(): void {
    this.addPartnerForm = new FormGroup<AddPartnerForm>({
      isActive: new FormControl(false, Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormGroup<PartnerAddress>({
        street: new FormControl('', Validators.required),
        zip: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]),
        city: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
      }),
      companyName: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      phoneNo: new FormControl('', Validators.required),
      webAddress: new FormControl(''),
      currency: new FormControl('', Validators.required),
      locale: new FormControl('', Validators.required),
    });
  }

  get formControls(): AddPartnerForm {
    return this.addPartnerForm.controls;
  }

  get addressControls(): PartnerAddress {
    return this.addPartnerForm.controls.address.controls;
  }

  onSubmit(): boolean | void {
    this.addPartnerForm.markAllAsTouched();
    if (this.addPartnerForm.invalid) {
      return true;
    }
    this.isSubmitted = true;
    if (!this.uuid) {
      this.addPartner();
    } else {
      this.updatePartner();
    }
  }

  addPartner(): void {
    this.partnerService.addPartner(this.addPartnerForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitted =false;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.addPartnerSuccessful', MessageType.success);
          this.navigateToList();
        },
        error: () => {
          this.isSubmitted = false;
        }
      })
  }

  updatePartner(): void {
    this.partnerService.updatePartnerDetail(this.addPartnerForm.value, this.uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.updatePartnerSuccessful', MessageType.success);
          this.navigateToList();
        },
        error: () => {
          this.isSubmitted = false;
        }
      })
  }

  navigateToList() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
