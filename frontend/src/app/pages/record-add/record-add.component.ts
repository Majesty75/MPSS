import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { PartDetail } from '@app/core/models/part.model';
import { AddRecordForm, Record, RecordType, addRecordDialogData } from '@app/core/models/record.model';
import { CpActionToolbarComponent } from '@app/shared/cp-libs/cp-action-toolbar/cp-action-toolbar.component';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { CpTelInputComponent } from '@app/shared/cp-libs/cp-tel-input/cp-tel-input.component';
import { AllowNumberOnlyDirective } from '@directives/allow-number-only.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-record-add',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, NgSelectModule, FormsModule, CpButtonComponent, ReactiveFormsModule, TranslateModule, AllowNumberOnlyDirective, CpTelInputComponent, MatFormFieldModule, MatNativeDateModule, MatDatepickerModule, MatInputModule, MatIconModule, MatTableModule, CpActionToolbarComponent],
  templateUrl: './record-add.component.html',
  styleUrls: ['./record-add.component.scss']
})
export class RecordAddComponent implements OnInit {

  @Input() record: Partial<Record>;
  @Input() partList: PartDetail[];
  @Input() recordType: RecordType;

  @Output() recordEvent: EventEmitter<Partial<Record>> = new EventEmitter<Partial<Record>>();;

  addRecordForm: FormGroup<AddRecordForm>;
  id: number;
  columnLabel = ['partName', 'quantity', 'price', 'total', 'action'];
  isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: addRecordDialogData,
    private dialogRef: MatDialogRef<RecordAddComponent>
  ) {
    this.record = this.record ?? data.record;
    this.partList = this.partList ?? data.partList;
    this.recordType = this.recordType ?? data.type;
    this.id = this.record.id ?? 0;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.id) {
      this.addRecordForm.patchValue(this.record);
    }
  }

  initializeForm(): void {
    this.addRecordForm = new FormGroup<AddRecordForm>({
      id: new FormControl<number>(0),
      partId: new FormControl<number>(0, Validators.required),
      price: new FormControl<number>(0, Validators.required),
      quantity: new FormControl<number>(0, Validators.required),
      partName: new FormControl<string>('')
    });
  }

  get formControls(): AddRecordForm {
    return this.addRecordForm.controls;
  }

  onSubmit(): boolean | void {
    this.addRecordForm.markAllAsTouched();
    if (this.addRecordForm.invalid) {
      return true;
    }
    this.isSubmitted = true;
    if (!this.id) {
      this.addRecord();
    } else {
      this.updateRecord();
    }
  }

  addRecord(): void {
    const record = this.addRecordForm.value;
    this.recordEvent.emit(record);
    this.dialogRef.close(record);
  }

  updateRecord(): void {
    const record = this.addRecordForm.value;
    this.recordEvent.emit(record);
    this.dialogRef.close(record);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  partSelected(event: PartDetail) {
    this.addRecordForm.controls.partName.patchValue(event.partName);

    if (this.recordType === RecordType.Sale) {
      this.addRecordForm.controls.price.patchValue(event.sellPrice);
    }

    if (this.recordType === RecordType.Purchase) {
      this.addRecordForm.controls.price.patchValue(event.cost);
    }
  }

}
