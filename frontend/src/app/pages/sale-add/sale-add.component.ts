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
import { AddSaleForm, Record } from '@app/core/models/sale.model';
import { PartService } from '@app/core/services/part.service';
import { SaleService } from '@app/core/services/sale.service';
import { CpActionToolbarComponent } from '@app/shared/cp-libs/cp-action-toolbar/cp-action-toolbar.component';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { CpTelInputComponent } from '@app/shared/cp-libs/cp-tel-input/cp-tel-input.component';
import { MessageType } from '@constants/app.constants';
import { AllowNumberOnlyDirective } from '@directives/allow-number-only.directive';
import { BreadCrumb } from '@models/breadcrumb.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AlertToastrService } from '@services/alert-toastr.service';
import { CpEventsService } from '@services/cp-events.service';
import { RecordAddComponent } from '../record-add/record-add.component';

@Component({
  selector: 'app-sale-add',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, NgSelectModule, FormsModule, CpButtonComponent, ReactiveFormsModule, TranslateModule, AllowNumberOnlyDirective, CpTelInputComponent, MatFormFieldModule, MatNativeDateModule, MatDatepickerModule, MatInputModule, MatIconModule, MatTableModule, CpActionToolbarComponent],
  templateUrl: './sale-add.component.html',
  styleUrls: ['./sale-add.component.scss']
})
export class SaleAddComponent implements OnInit {

  breadcrumbs: BreadCrumb[] = [];
  addSaleForm: FormGroup<AddSaleForm>;
  recordDataSource = new MatTableDataSource<Record>();
  recordList: Record[] = [];
  partList: PartDetail[];
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
    private saleService: SaleService,
    private partService: PartService,
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
      const saleDetail = this.route.snapshot.data.saleDetail || this.saleService.saleDetail;
      this.addSaleForm.patchValue(saleDetail);
      this.recordList = saleDetail.records ?? [];
    }
    this.getPartList();
  }

  initializeForm(): void {
    this.addSaleForm = new FormGroup<AddSaleForm>({
      saleNumber: new FormControl<string>('', Validators.required),
      date: new FormControl<Date>(new Date(), Validators.required),
      customerName: new FormControl<string>(''),
      customerContact: new FormControl<string>('')
    });
  }

  get formControls(): AddSaleForm {
    return this.addSaleForm.controls;
  }

  onSubmit(): boolean | void {
    this.addSaleForm.markAllAsTouched();
    if (this.addSaleForm.invalid) {
      return true;
    }
    this.isSubmitted = true;
    if (!this.id) {
      this.addSale();
    } else {
      this.updateSale();
    }
  }

  addSale(): void {
    this.saleService.addSale({ ...this.addSaleForm.value, records: this.recordList })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.addPartnerSuccessful', MessageType.success);
          this.navigateToList();
        },
        error: () => {
          this.isSubmitted = false;
        }
      })
  }

  updateSale(): void {
    this.saleService.updateSaleDetail({ ...this.addSaleForm.value, records: this.recordList }, this.id)
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

  addRecord() {
    const dialogRef = this.dialog.open(RecordAddComponent, {
      data: {
        record: this.newRecord,
        partList: this.partList
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
      data: { record, partList: this.partList },
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

  getPartList(): void {
    this.partService.getAllParts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: PartDetail[]) => {
          if (res) {
            this.partList = res;
            for (let record of this.recordList) {
              const part = this.partList.find(p => p.id == record.partId);
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

  navigateToList() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
