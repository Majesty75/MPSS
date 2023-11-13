import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { VendorService } from '@app/core/services/vendor.service';
import { CpActionToolbarComponent } from '@app/shared/cp-libs/cp-action-toolbar/cp-action-toolbar.component';
import { CpLoaderComponent } from '@app/shared/cp-libs/cp-loader/cp-loader.component';
import { AccountingStatus, PAGE_SIZE, SORT_OPTIONS } from '@constants/app.constants';
import { LOCAL_STORAGE_CONSTANT } from '@constants/localstorage.constant';
import { DashboardAccountingStats, InvoiceDetail, InvoiceList, PerformanceOverview, RedemptionDetail, RedemptionList, TopPartners } from '@models/admin.model';
import { LoginResponse } from '@models/auth.model';
import { BreadCrumb } from '@models/breadcrumb.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdminService } from '@services/admin.service';
import { AlertToastrService } from '@services/alert-toastr.service';
import { CpEventsService } from '@services/cp-events.service';
import { LocalStorageService } from '@services/local-storage.service';
import { UtilityService } from '@services/utility.service';
import { ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule, NgSelectModule, FormsModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule, CpLoaderComponent, NgChartsModule, CpActionToolbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  breadcrumbs: BreadCrumb[] = [];
  latestRedemptionList = new MatTableDataSource<RedemptionDetail>();
  openInvoiceList = new MatTableDataSource<InvoiceDetail>();
  columnLabel = ['affiliatePartner', 'cardType', 'cardCode', 'date', 'shopOrderNumber', 'shopStatus', 'billingPositions', 'action'];
  invoiceColumnLabel = ['affiliatePartner', 'accountingDate', 'billable', 'status'];
  @ViewChild('redemptionPaginator') redemptionPaginator: MatPaginator;
  @ViewChild('invoicePaginator') invoicePaginator: MatPaginator;
  pageSizeOptions = PAGE_SIZE;
  redemptionSortValue = new FormControl('newest');
  invoiceSortValue = new FormControl('newest');
  sortOptions = SORT_OPTIONS;

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      },
    }
  };

  dayWiseData = [];
  accountingStatsLoading = false;
  redemptionListLoading = false;
  performanceOverviewLoading = false;
  topPartnersDetailLoading = false;
  invoiceListLoading = false;
  accountingStats: DashboardAccountingStats;
  userData: LoginResponse;
  topPartnerDetail: TopPartners[] = [];
  chartLabels: string[];
  translatedChartLabels: string[];
  dateFilter = new FormControl('lastSixDays');

  readonly accountingStatus = AccountingStatus;
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private cpEventsService: CpEventsService,
    private adminService: AdminService,
    private localStorageService: LocalStorageService,
    private utilityService: UtilityService,
    private translateService: TranslateService,
    private partnerService: VendorService,
    private toasterService: AlertToastrService
  ) {
    this.userData = this.localStorageService.get(LOCAL_STORAGE_CONSTANT.USER_DATA);
    this.breadcrumbs = this.route.snapshot.data.breadcrumbs;
  }

  ngOnInit(): void {
    this.cpEventsService.cpHeaderDataChanged.emit({ breadcrumbs: this.breadcrumbs });
    this.getAccountingStats();
    this.getPerformanceOverview();
    this.getTopPartners();
    this.getOpenInvoicesList();
    this.getLatestRedemptionList();
    this.translateService.onLangChange.subscribe(() => {
      this.translateChartLabels();
    })
  }

  getAccountingStats(): void {
    this.accountingStatsLoading = true;
    this.adminService.getDashboardAccountingStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: DashboardAccountingStats) => {
          this.accountingStatsLoading = false;
          this.accountingStats = res;
        },
        error: () => {
          this.accountingStatsLoading = false;
        }
      })
  }

  getPerformanceOverview(): void {
    const params = {
      dateFilter: this.dateFilter.value,
    }
    this.performanceOverviewLoading = true;
    this.adminService.getDashboardPerformanceStats(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: PerformanceOverview[]) => {
          this.performanceOverviewLoading = false;
          const performanceOverview = res;
          this.chartLabels = performanceOverview?.map((el: PerformanceOverview) => this.utilityService.numberToDayConverter(el.day));
          this.translateChartLabels();
          this.dayWiseData = [
            {
              data: performanceOverview?.map((el: PerformanceOverview) => el.count),
              borderColor: '#ff6b00',
              pointBackgroundColor: '#ff6b00',
              tension: 0.5
            }
          ]
        },
        error: () => {
          this.performanceOverviewLoading = false;
        }
      })
  }

  getTopPartners(): void {
    this.topPartnersDetailLoading = true;
    this.adminService.getTopPartners()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: TopPartners[]) => {
          this.topPartnersDetailLoading = false;
          this.topPartnerDetail = res;
        },
        error: () => {
          this.topPartnersDetailLoading = false;
        }
      })
  }

  translateChartLabels(): void {
    this.translateService.get(this.chartLabels).subscribe(translations => {
      this.translatedChartLabels = Object.values(translations);
    });
  }

  getOpenInvoicesList(): void {
    const params = {
      sort: this.invoiceSortValue.value,
      pageSize: this.invoicePaginator?.pageSize || 10,
      page: (this.invoicePaginator?.pageIndex + 1) || 1,
    }
    this.invoiceListLoading = true;
    this.openInvoiceList = new MatTableDataSource([]);
    this.adminService.getOpenInvoiceList(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: InvoiceList) => {
          this.invoiceListLoading = false;
          this.openInvoiceList = new MatTableDataSource(res?.records);
          this.invoicePaginator.length = res?.totalCount;
        },
        error: () => {
          this.invoiceListLoading = false;
        }
      })
  }

  updateStatus(status: string, uuid: string): void {
  }

  getLatestRedemptionList(): void {
    const params = {
      sort: this.redemptionSortValue.value,
      pageSize: this.redemptionPaginator?.pageSize || 10,
      page: (this.redemptionPaginator?.pageIndex + 1) || 1,
    }
    this.redemptionListLoading = true;
    this.latestRedemptionList = new MatTableDataSource([]);
    this.adminService.getLatestRedemptionList(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: RedemptionList) => {
          this.redemptionListLoading = false;
          res?.records?.map((el: RedemptionDetail) => {
            el.action = [
              {
                label: 'dashboard.trackOrder',
                callback: this.trackOrder.bind(this)
              },
            ]
          });
          this.latestRedemptionList = new MatTableDataSource(res?.records);
          this.redemptionPaginator.length = res?.totalCount;
        },
        error: () => {
          this.redemptionListLoading = false;
        }
      })
  }

  trackOrder(trackingUrl: string): void {
    window.open(trackingUrl);
  }

  ngAfterViewInit(): void {
    this.latestRedemptionList.paginator = this.redemptionPaginator;
    this.openInvoiceList.paginator = this.invoicePaginator;
  }

}
