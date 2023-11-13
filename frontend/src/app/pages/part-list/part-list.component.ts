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
import { PartDetail, PartList } from '@app/core/models/part.model';
import { VendorDetail } from '@app/core/models/vendor.model';
import { PartService } from '@app/core/services/part.service';
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
  selector: 'app-part-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule, MatPaginatorModule, MatCheckboxModule, CpButtonComponent, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, NgSelectModule, CpLoaderComponent, CpActionToolbarComponent],
  templateUrl: './part-list.component.html',
  styleUrls: ['./part-list.component.scss']
})
export class PartListComponent {

  breadcrumbs: BreadCrumb[] = [];
  partList = new MatTableDataSource<PartDetail>();
  columnLabel = ['partId', 'partName', 'partNumber', 'cost', 'sellPrice', 'vendorName'];
  selection = new SelectionModel<PartDetail>(true, []);
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
    private partService: PartService,
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
    this.getPartList();
  }

  getPartList(): void {
    const params = {
      sort: this.sortValue.value,
      pageSize: this.paginator?.pageSize || 10,
      page: (this.paginator?.pageIndex + 1) || 1,
      ...this.searchValue && { search: this.searchValue }
    }
    this.isLoading = true;
    this.partList = new MatTableDataSource([]);
    this.partService.getPartList(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: PartList) => {
          if (res) {
            this.isLoading = false;
            res.records.map((el: PartDetail) => {
              el.partAction = [
                {
                  label: 'partner.edit',
                  callback: this.editPart.bind(this)
                }
              ]
            });
            this.partList = new MatTableDataSource(res.records);
            this.paginator.length = res.totalCount;
          }
        },
        error: () => {
          this.isLoading = false;
        }
      })
  }

  ngAfterViewInit(): void {
    this.partList.paginator = this.paginator;
  }

  editPart(row: VendorDetail): void {
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
    this.getPartList();
  }

  navigateToAddPart(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
