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
import { CpActionToolbarComponent } from '@app/shared/cp-libs/cp-action-toolbar/cp-action-toolbar.component';
import { CpButtonComponent } from '@app/shared/cp-libs/cp-button/cp-button.component';
import { CpLoaderComponent } from '@app/shared/cp-libs/cp-loader/cp-loader.component';
import { COUNTRY_LIST, MessageType, PAGE_SIZE, SORT_OPTIONS } from '@constants/app.constants';
import { BreadCrumb } from '@models/breadcrumb.model';
import { PartnerDetail, PartnerList } from '@models/partner.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertToastrService } from '@services/alert-toastr.service';
import { CpEventsService } from '@services/cp-events.service';
import { PartnerService } from '@services/partner.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-partner-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule, MatPaginatorModule, MatCheckboxModule, CpButtonComponent, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, NgSelectModule, CpLoaderComponent, CpActionToolbarComponent],
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss']
})
export class PartnerListComponent {

  breadcrumbs: BreadCrumb[] = [];
  partnerList = new MatTableDataSource<PartnerDetail>();
  columnLabel = ['partnerId', 'companyName', 'street', 'zip', 'city', 'country', 'email', 'phoneNo', 'isActive', 'action'];
  selection = new SelectionModel<PartnerDetail>(true, []);
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
    private partnerService: PartnerService,
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
    this.getPartnerList();
  }

  getPartnerList(): void {
    const params = {
      sort: this.sortValue.value,
      pageSize: this.paginator?.pageSize || 10,
      page: (this.paginator?.pageIndex + 1) || 1,
      ...this.searchValue && { search: this.searchValue }
    }
    this.isLoading = true;
    this.partnerList = new MatTableDataSource([]);
    this.partnerService.getPartnerList(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: PartnerList) => {
          if (res) {
            this.isLoading = false;
            res.records.map((el: PartnerDetail) => {
              COUNTRY_LIST.forEach((country) => {
                if (el.country === country.value) {
                  el.country = country.label.charAt(0).toUpperCase() + country.label.slice(1);
                }
                return;
              })
              el.partnerAction = [
                {
                  label: 'partner.edit',
                  callback: this.editPartner.bind(this)
                },
                {
                  label: el.isActive ? 'partner.markAsInactive' : 'partner.markAsActive',
                  callback: this.updateStatus.bind(this)
                }
              ]
            });
            this.partnerList = new MatTableDataSource(res.records);
            this.paginator.length = res.totalCount;
          }
        },
        error: () => {
          this.isLoading = false;
        }
      })
  }

  ngAfterViewInit(): void {
    this.partnerList.paginator = this.paginator;
  }

  editPartner(row: PartnerDetail): void {
    this.router.navigate([`../${row.uuid}`], { relativeTo: this.route });
  }

  updateStatus(row: PartnerDetail): void {
    this.partnerService.updatePartnerDetail({ isActive: !row.isActive }, row.uuid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toasterService.displaySnackBarWithTranslation('toasterMessage.updateStatusSuccessful', MessageType.success);
          this.getPartnerList();
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
    this.getPartnerList();
  }

  navigateToAddPartner(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
