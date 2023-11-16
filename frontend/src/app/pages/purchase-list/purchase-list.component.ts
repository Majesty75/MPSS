import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseDetail, PurchaseList } from '@app/core/models/purchase.model';
import { PurchaseService } from '@app/core/services/purchase.service';
import { CpActionToolbarComponent } from '@app/shared/cp-libs/cp-action-toolbar/cp-action-toolbar.component';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { CpLoaderComponent } from '@app/shared/cp-libs/cp-loader/cp-loader.component';
import { MessageType, PAGE_SIZE, SORT_OPTIONS } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertToastrService } from '@services/alert-toastr.service';
import { CpEventsService } from '@services/cp-events.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule, MatPaginatorModule, MatCheckboxModule, CpButtonComponent, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, NgSelectModule, CpLoaderComponent, CpActionToolbarComponent],
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent {

  breadcrumbs: BreadCrumb[] = [];
  purchaseList = new MatTableDataSource<PurchaseDetail>();
  columnLabel = ['purchaseNumber', 'date', 'total', 'vendorName', 'action'];
  selection = new SelectionModel<PurchaseDetail>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions = PAGE_SIZE;
  searchControl = new FormControl('');
  sortValue = new FormControl('asc');
  sortOptions = SORT_OPTIONS;
  searchValue: string;
  isLoading = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private cpEventsService: CpEventsService,
    private purchaseService: PurchaseService,
    private router: Router,
    private toasterService: AlertToastrService,
    public translateService: TranslateService
  ) {
    this.breadcrumbs = this.route.snapshot.data.breadcrumbs;
  }

  ngOnInit(): void {
    this.cpEventsService.cpHeaderDataChanged.emit({ breadcrumbs: this.breadcrumbs });
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (value: string) => {
          this.onSearch(value);
        }
      });
    this.getPurchaseList();
  }

  getPurchaseList(): void {
    const params = {
      sort: this.sortValue.value,
      pageSize: this.paginator?.pageSize || 10,
      page: (this.paginator?.pageIndex + 1) || 1,
      ...this.searchValue && { search: this.searchValue }
    }
    this.isLoading = true;
    this.purchaseList = new MatTableDataSource([]);
    this.purchaseService.getPurchaseList(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: PurchaseList) => {
          if (res) {
            this.isLoading = false;
            res.records.map((el: PurchaseDetail) => {
              el.purchaseAction = [
                {
                  label: 'common.edit',
                  callback: this.editPurchase.bind(this)
                },
                {
                  label: 'common.delete',
                  callback: this.deletePurchase.bind(this)
                }
              ]
            });
            this.purchaseList = new MatTableDataSource(res.records);
            this.paginator.length = res.totalCount;
          }
        },
        error: () => {
          this.isLoading = false;
        }
      })
  }

  ngAfterViewInit(): void {
    this.purchaseList.paginator = this.paginator;
  }

  editPurchase(row: PurchaseDetail): void {
    this.router.navigate([`../${row.id}`], { relativeTo: this.route });
  }

  deletePurchase(row: PurchaseDetail): void {
    this.purchaseService.deletePurchase(row.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.deletePurchaseSuccessful', MessageType.success);
          this.getPurchaseList();
        },
      })
  }

  onSearch(searchValue: string): void {
    this.paginator.firstPage();
    if (
      searchValue &&
      searchValue.trim() !== '' &&
      searchValue.trim().length >= 4
    ) {
      this.searchValue = searchValue;
    } else {
      this.searchValue = '';
    }
    this.getPurchaseList();
  }

  navigateToAddPurchase(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
