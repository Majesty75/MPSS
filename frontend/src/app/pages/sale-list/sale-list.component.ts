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
import { SaleDetail, SaleList } from '@app/core/models/sale.model';
import { SaleService } from '@app/core/services/sale.service';
import { CpActionToolbarComponent } from '@app/shared/cp-libs/cp-action-toolbar/cp-action-toolbar.component';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { CpLoaderComponent } from '@app/shared/cp-libs/cp-loader/cp-loader.component';
import { PAGE_SIZE, SORT_OPTIONS } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertToastrService } from '@services/alert-toastr.service';
import { CpEventsService } from '@services/cp-events.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule, MatPaginatorModule, MatCheckboxModule, CpButtonComponent, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, NgSelectModule, CpLoaderComponent, CpActionToolbarComponent],
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent {

  breadcrumbs: BreadCrumb[] = [];
  saleList = new MatTableDataSource<SaleDetail>();
  columnLabel = ['saleId', 'saleNumber', 'total', 'date', 'customerName', 'customerNo', 'action'];
  selection = new SelectionModel<SaleDetail>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions = PAGE_SIZE;
  searchControl = new FormControl('');
  sortValue = new FormControl('newest');
  sortOptions = SORT_OPTIONS;
  searchValue: string;
  isLoading = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private cpEventsService: CpEventsService,
    private saleService: SaleService,
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
    this.getSalesList();
  }

  getSalesList(): void {
    const params = {
      sort: this.sortValue.value,
      pageSize: this.paginator?.pageSize || 10,
      page: (this.paginator?.pageIndex + 1) || 1,
      ...this.searchValue && { search: this.searchValue }
    }
    this.isLoading = true;
    this.saleList = new MatTableDataSource([]);
    this.saleService.getSaleList(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: SaleList) => {
          if (res) {
            this.isLoading = false;
            res.records.map((el: SaleDetail) => {
              el.saleAction = [
                {
                  label: 'common.edit',
                  callback: this.editSale.bind(this)
                }
              ]
            });
            this.saleList = new MatTableDataSource(res.records);
            this.paginator.length = res.totalCount;
          }
        },
        error: () => {
          this.isLoading = false;
        }
      })
  }

  ngAfterViewInit(): void {
    this.saleList.paginator = this.paginator;
  }

  editSale(row: SaleDetail): void {
    this.router.navigate([`../${row.uuid}`], { relativeTo: this.route });
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
    this.getSalesList();
  }

  navigateToAddSale(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
