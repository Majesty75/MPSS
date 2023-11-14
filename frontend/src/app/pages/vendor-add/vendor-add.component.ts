import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { AddVendorForm, VendorAddress } from '@app/core/models/vendor.model';
import { VendorService } from '@app/core/services/vendor.service';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { CpTelInputComponent } from '@app/shared/cp-libs/cp-tel-input/cp-tel-input.component';
import { COUNTRY_LIST, CURRENCY_LIST, LANGUAGE_LIST, MessageType, REGEX_CONSTANTS, RegexType } from '@constants/app.constants';
import { AllowNumberOnlyDirective } from '@directives/allow-number-only.directive';
import { BreadCrumb } from '@models/breadcrumb.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AlertToastrService } from '@services/alert-toastr.service';

@Component({
  selector: 'app-vendor-add',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, NgSelectModule, FormsModule, CpButtonComponent, ReactiveFormsModule, TranslateModule, AllowNumberOnlyDirective, CpTelInputComponent],
  templateUrl: './vendor-add.component.html',
  styleUrls: ['./vendor-add.component.scss']
})
export class VendorAddComponent implements OnInit {

  breadcrumbs: BreadCrumb[] = [];
  addVendorForm: FormGroup<AddVendorForm>;
  id: string;
  isSubmitted = false;

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
    private vendorService: VendorService,
    private toasterService: AlertToastrService,
    private router: Router
  ) {
    this.breadcrumbs = this.route.snapshot.data.breadcrumbs;
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.id) {
      const vendorDetail = this.route.snapshot.data.vendorDetail || this.vendorService.vendorDetail;
      this.addVendorForm.patchValue(vendorDetail);
    }
  }

  initializeForm(): void {
    this.addVendorForm = new FormGroup<AddVendorForm>({
      vendorName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNo: new FormControl('', Validators.required),
      address: new FormGroup<VendorAddress>({
        street: new FormControl('', Validators.required),
        zip: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]),
        city: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
      })
    });
  }

  get formControls(): AddVendorForm {
    return this.addVendorForm.controls;
  }

  get addressControls(): VendorAddress {
    return this.addVendorForm.controls.address.controls;
  }

  onSubmit(): boolean | void {
    this.addVendorForm.markAllAsTouched();
    if (this.addVendorForm.invalid) {
      return true;
    }
    this.isSubmitted = true;
    if (!this.id) {
      this.addVendor();
    } else {
      this.updateVendor();
    }
  }

  addVendor(): void {
    this.vendorService.addVendor(this.addVendorForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.addVendorSuccessful', MessageType.success);
          this.navigateToList();
        },
        error: () => {
          this.isSubmitted = false;
        }
      })
  }

  updateVendor(): void {
    this.vendorService.updateVendorDetail(this.addVendorForm.value, this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.updateVendorSuccessful', MessageType.success);
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
