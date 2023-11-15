import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { AddPartForm } from '@app/core/models/part.model';
import { VendorDetail } from '@app/core/models/vendor.model';
import { PartService } from '@app/core/services/part.service';
import { VendorService } from '@app/core/services/vendor.service';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { CpTelInputComponent } from '@app/shared/cp-libs/cp-tel-input/cp-tel-input.component';
import { COUNTRY_LIST, MessageType, REGEX_CONSTANTS, RegexType } from '@constants/app.constants';
import { AllowNumberOnlyDirective } from '@directives/allow-number-only.directive';
import { BreadCrumb } from '@models/breadcrumb.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AlertToastrService } from '@services/alert-toastr.service';
import { CpEventsService } from '@services/cp-events.service';

@Component({
  selector: 'app-part-add',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, NgSelectModule, FormsModule, CpButtonComponent, ReactiveFormsModule, TranslateModule, AllowNumberOnlyDirective, CpTelInputComponent],
  templateUrl: './part-add.component.html',
  styleUrls: ['./part-add.component.scss']
})
export class PartAddComponent implements OnInit {

  breadcrumbs: BreadCrumb[] = [];
  addPartForm: FormGroup<AddPartForm>;
  id: string;
  isSubmitted = false;
  vendorList: VendorDetail[];

  readonly countryList = COUNTRY_LIST;
  readonly emailRegex = REGEX_CONSTANTS.EMAIL_REGEX;
  readonly regexType = RegexType;
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private cpEventsService: CpEventsService,
    private partService: PartService,
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
      const partDetail = this.route.snapshot.data.partDetail || this.partService.partDetail;
      this.addPartForm.patchValue(partDetail);
    }
    this.getVendorList();
  }

  initializeForm(): void {
    this.addPartForm = new FormGroup<AddPartForm>({
      partName: new FormControl('', Validators.required),
      partNumber: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, , Validators.pattern("^[0-9]*$"), Validators.min(0.1)]),
      cost: new FormControl(0, [Validators.required, Validators.min(0.1)]),
      sellPrice: new FormControl(0, [Validators.required, Validators.min(0.1)]),
      vendorId: new FormControl(null, Validators.required),
    });
  }

  get formControls(): AddPartForm {
    return this.addPartForm.controls;
  }

  onSubmit(): boolean | void {
    this.addPartForm.markAllAsTouched();
    if (this.addPartForm.invalid) {
      return true;
    }
    this.isSubmitted = true;
    if (!this.id) {
      this.addPartner();
    } else {
      this.updatePartner();
    }
  }

  addPartner(): void {
    this.partService.addPart(this.addPartForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.addPartSuccessful', MessageType.success);
          this.navigateToList();
        },
        error: () => {
          this.isSubmitted = false;
        }
      })
  }

  updatePartner(): void {
    this.partService.updateVendorDetail(this.addPartForm.value, this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.updatePartSuccessful', MessageType.success);
          this.navigateToList();
        },
        error: () => {
          this.isSubmitted = false;
        }
      })
  }

  getVendorList() {
    this.vendorService.getVendors()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.vendorList = res;
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
