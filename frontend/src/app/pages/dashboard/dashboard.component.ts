import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CpActionToolbarComponent } from '@app/shared/cp-libs/cp-action-toolbar/cp-action-toolbar.component';
import { CpLoaderComponent } from '@app/shared/cp-libs/cp-loader/cp-loader.component';
import { AccountingStatus } from '@constants/app.constants';
import { LOCAL_STORAGE_CONSTANT } from '@constants/localstorage.constant';
import { DailySales, DashboardAccountingStats, MonthlySales } from '@models/admin.model';
import { LoginResponse } from '@models/auth.model';
import { BreadCrumb } from '@models/breadcrumb.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdminService } from '@services/admin.service';
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
export class DashboardComponent implements OnInit {

  breadcrumbs: BreadCrumb[] = [];

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
  dashboardStatsLoading = false;
  monthlySalesLoading = false;
  dashboardStats: DashboardAccountingStats;
  userData: LoginResponse;
  chartLabels: string[];
  translatedChartLabels: string[];
  monthFilter = new FormControl();

  months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  readonly accountingStatus = AccountingStatus;
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private cpEventsService: CpEventsService,
    private adminService: AdminService,
    private localStorageService: LocalStorageService,
    private utilityService: UtilityService,
    private translateService: TranslateService
  ) {
    this.userData = this.localStorageService.get(LOCAL_STORAGE_CONSTANT.USER_DATA);
    this.breadcrumbs = this.route.snapshot.data.breadcrumbs;
  }

  ngOnInit(): void {
    this.cpEventsService.cpHeaderDataChanged.emit({ breadcrumbs: this.breadcrumbs });
    this.monthFilter.patchValue(new Date().getMonth());
    this.getDashboardStats();
    this.getMonthlySales();
    this.translateService.onLangChange.subscribe(() => {
      this.translateChartLabels();
    })
  }

  getDashboardStats(): void {
    this.dashboardStatsLoading = true;
    this.adminService.getDashboardStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: DashboardAccountingStats) => {
          this.dashboardStatsLoading = false;
          this.dashboardStats = res;
        },
        error: () => {
          this.dashboardStatsLoading = false;
        }
      })
  }

  getMonthlySales(): void {
    const date = new Date();
    date.setMonth(this.monthFilter.value);
    const params = {
      date: date,
    }
    this.monthlySalesLoading = true;
    this.adminService.getDashboardMonthlySales(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: MonthlySales) => {
          this.monthlySalesLoading = false;
          const dailySales = res.dailyRevenues;
          this.chartLabels = dailySales?.map((el: DailySales) => el.day.toString());
          //this.translateChartLabels();
          this.dayWiseData = [
            {
              data: dailySales?.map((el: DailySales) => el.revenue),
              borderColor: '#ff6b00',
              pointBackgroundColor: '#ff6b00',
              tension: 0.5
            }
          ]
        },
        error: () => {
          this.monthlySalesLoading = false;
        }
      })
  }

  translateChartLabels(): void {
    this.translateService.get(this.chartLabels).subscribe(translations => {
      this.translatedChartLabels = Object.values(translations);
    });
  }

}
