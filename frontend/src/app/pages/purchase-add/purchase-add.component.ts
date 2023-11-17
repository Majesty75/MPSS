import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PartDetail } from '@app/core/models/part.model';
import { AddPurchaseForm } from '@app/core/models/purchase.model';
import { VendorDetail } from '@app/core/models/vendor.model';
import { PartService } from '@app/core/services/part.service';
import { PurchaseService } from '@app/core/services/purchase.service';
import { VendorService } from '@app/core/services/vendor.service';
import { CpActionToolbarComponent } from '@app/shared/cp-libs/cp-action-toolbar/cp-action-toolbar.component';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { CpTelInputComponent } from '@app/shared/cp-libs/cp-tel-input/cp-tel-input.component';
import { MessageType } from '@constants/app.constants';
import { AllowNumberOnlyDirective } from '@directives/allow-number-only.directive';
import { BreadCrumb } from '@models/breadcrumb.model';
import { Record, RecordType } from "@models/record.model";
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AlertToastrService } from '@services/alert-toastr.service';
import { CpEventsService } from '@services/cp-events.service';
import { RecordAddComponent } from '../record-add/record-add.component';

@Component({
  selector: 'app-purchase-add',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, NgSelectModule, FormsModule, CpButtonComponent, ReactiveFormsModule, TranslateModule, AllowNumberOnlyDirective, CpTelInputComponent, MatFormFieldModule, MatNativeDateModule, MatDatepickerModule, MatInputModule, MatIconModule, MatTableModule, CpActionToolbarComponent],
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss']
})
export class PurchaseAddComponent implements OnInit {

  breadcrumbs: BreadCrumb[] = [];
  addPurchaseForm: FormGroup<AddPurchaseForm>;
  recordDataSource = new MatTableDataSource<Record>();
  recordList: Record[] = [];
  partList: PartDetail[];
  allParts: PartDetail[];
  vendorList: VendorDetail[];
  id: number;
  columnLabel = ['partName', 'quantity', 'price', 'total', 'action'];
  isSubmitted = false;
  newRecord: Partial<Record> = {
    id: 0,
    partId: 0,
    price: 0,
    quantity: 0
  }
  newRecordCount: number = -1;

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private cpEventsService: CpEventsService,
    private purchaseService: PurchaseService,
    private partService: PartService,
    private vendorService: VendorService,
    private toasterService: AlertToastrService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.breadcrumbs = this.route.snapshot.data.breadcrumbs;
    this.id = +this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.cpEventsService.cpHeaderDataChanged.emit({ breadcrumbs: this.breadcrumbs });
    this.initializeForm();
    if (this.id) {
      const purchaseDetail = this.route.snapshot.data.purchaseDetail || this.purchaseService.purchaseDetail;
      this.addPurchaseForm.patchValue(purchaseDetail);
      this.recordList = purchaseDetail.records ?? [];
    }
    this.getPartList();
    this.getVendorList();
  }

  initializeForm(): void {
    this.addPurchaseForm = new FormGroup<AddPurchaseForm>({
      purchaseNumber: new FormControl<string>('', Validators.required),
      date: new FormControl<Date>(new Date(), Validators.required),
      vendorId: new FormControl<number>(null, Validators.required)
    });
  }

  get formControls(): AddPurchaseForm {
    return this.addPurchaseForm.controls;
  }

  onSubmit(): boolean | void {
    this.addPurchaseForm.markAllAsTouched();
    if (this.addPurchaseForm.invalid) {
      return true;
    }
    this.isSubmitted = true;
    if (!this.id) {
      this.addPurchase();
    } else {
      this.updatePurchase();
    }
  }

  addPurchase(): void {
    this.purchaseService.addPurchase({ ...this.addPurchaseForm.value, records: this.recordList })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.addPurchaseSuccessful', MessageType.success);
          this.navigateToList();
        },
        error: () => {
          this.isSubmitted = false;
        }
      })
  }

  updatePurchase(): void {
    this.purchaseService.updatePurchaseDetail({ ...this.addPurchaseForm.value, records: this.recordList }, this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.updatePurchaseSuccessful', MessageType.success);
          this.navigateToList();
        },
        error: () => {
          this.isSubmitted = false;
        }
      })
  }

  addRecord() {
    const dialogRef = this.dialog.open(RecordAddComponent, {
      data: {
        record: this.newRecord,
        partList: this.partList,
        type: RecordType.Purchase
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (addRecord: Partial<Record>) => {
          if (addRecord) {
            const record: Record = {
              id: this.newRecordCount--,
              date: new Date(),
              partId: addRecord.partId,
              partName: addRecord.partName,
              quantity: addRecord.quantity,
              price: addRecord.price,
              total: addRecord.price * addRecord.quantity,
              recordAction: [
                {
                  label: 'common.edit',
                  callback: this.updateRecord.bind(this)
                },
                {
                  label: 'common.delete',
                  callback: this.deleteRecord.bind(this)
                }
              ]
            };
            this.recordList.push(record);
            this.recordDataSource = new MatTableDataSource(this.recordList);
          }
        }
      });
  }

  updateRecord(row: Record) {
    const record: Partial<Record> = {
      id: row.id,
      partId: row.partId,
      partName: row.partName,
      quantity: row.quantity,
      price: row.price
    }
    const dialogRef = this.dialog.open(RecordAddComponent, {
      data: {
        record,
        partList: this.partList,
        type: RecordType.Purchase
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedRecord: Partial<Record>) => {
          const record = this.recordList.find(r => r.id === updatedRecord?.id);
          if (updatedRecord && record) {
            record.partId = updatedRecord.partId;
            record.partName = updatedRecord.partName;
            record.quantity = updatedRecord.quantity;
            record.price = updatedRecord.price;
            record.total = record.price * record.quantity;
            record.recordAction = [
              {
                label: 'common.edit',
                callback: this.updateRecord.bind(this)
              },
              {
                label: 'common.delete',
                callback: this.deleteRecord.bind(this)
              }
            ];
          }
        }
      });
  }

  deleteRecord(row: Record) {
    this.recordList = this.recordList.filter(r => r.id != row.id);
    this.recordDataSource = new MatTableDataSource(this.recordList);
  }

  vendorChanged(event: VendorDetail) {
    this.filterParts(event.id);
    this.recordList = [];
    this.recordDataSource = new MatTableDataSource(this.recordList);
  }

  filterParts(vendorId: number) {
    this.partList = this.allParts.filter(p => p.vendorId === vendorId);
  }

  getPartList(): void {
    this.partService.getAllParts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: PartDetail[]) => {
          if (res) {
            this.allParts = res;
            if (this.id > 0) {
              this.filterParts(this.addPurchaseForm.controls.vendorId.value);
            }
            for (let record of this.recordList) {
              const part = this.allParts.find(p => p.id == record.partId);
              part && (record.partName = part.partName);
              record.recordAction = [
                {
                  label: 'common.edit',
                  callback: this.updateRecord.bind(this)
                },
                {
                  label: 'common.delete',
                  callback: this.deleteRecord.bind(this)
                }
              ]
            }
            this.recordDataSource = new MatTableDataSource(this.recordList);
          }
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
