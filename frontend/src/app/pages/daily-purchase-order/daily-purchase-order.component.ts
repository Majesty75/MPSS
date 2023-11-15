import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DailyPurchaseOrder, DailyPurchaseOrderDetail } from '@app/core/models/daily-purchase-order.model';
import { DailyPurchaseOrderService } from '@app/core/services/daily-purchase-order.service';
import { CpActionToolbarComponent } from '@app/shared/cp-libs/cp-action-toolbar/cp-action-toolbar.component';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { CpLoaderComponent } from '@app/shared/cp-libs/cp-loader/cp-loader.component';
import { BreadCrumb } from '@models/breadcrumb.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertToastrService } from '@services/alert-toastr.service';
import { CpEventsService } from '@services/cp-events.service';

@Component({
  selector: 'app-daily-purchase-order',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule, MatCheckboxModule, CpButtonComponent, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, NgSelectModule, CpLoaderComponent, CpActionToolbarComponent],
  templateUrl: './daily-purchase-order.component.html',
  styleUrls: ['./daily-purchase-order.component.scss']
})
export class DailyPurchaseOrderComponent {

  breadcrumbs: BreadCrumb[] = [];
  dailyPurchaseOrderList = new MatTableDataSource<DailyPurchaseOrderDetail>();
  columnLabel = ['partName', 'quantity', 'cost', 'vendorName', 'vendorAddress'];
  selection = new SelectionModel<DailyPurchaseOrderDetail>(true, []);
  dateValue = new FormControl(new Date());
  isLoading = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private cpEventsService: CpEventsService,
    private dailyPurchaseOrderService: DailyPurchaseOrderService,
    private router: Router,
    private toasterService: AlertToastrService,
    public translateService: TranslateService
  ) {
    this.breadcrumbs = this.route.snapshot.data.breadcrumbs;
  }

  ngOnInit(): void {
    this.cpEventsService.cpHeaderDataChanged.emit({ breadcrumbs: this.breadcrumbs });
    this.getDailyPurchaseOrderList();
  }

  getDailyPurchaseOrderList(): void {
    const params = {
      date: this.dateValue.value
    }
    this.isLoading = true;
    this.dailyPurchaseOrderList = new MatTableDataSource([]);
    this.dailyPurchaseOrderService.getDailyPurchaseOrderList(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: DailyPurchaseOrder) => {
          if (res) {
            this.isLoading = false;
            this.dailyPurchaseOrderList = new MatTableDataSource(res.dailyPurchaseOrderRecords);
          }
        },
        error: () => {
          this.isLoading = false;
        }
      })
  }

  navigateToAddDailyPurchaseOrder(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}

