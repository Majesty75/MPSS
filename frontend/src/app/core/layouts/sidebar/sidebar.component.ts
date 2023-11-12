import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { LoginResponse } from '@models/auth.model';
import { LocalStorageService } from '@services/local-storage.service';
import { LOCAL_STORAGE_CONSTANT } from '@constants/localstorage.constant';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UtilityService } from '@services/utility.service';
import { CpEventsService } from '@services/cp-events.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgSelectModule, TranslateModule, RouterModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  userData: LoginResponse;
  currentLanguage: string;
  menuOpen = false;
  
  private destroyRef = inject(DestroyRef);

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private localStorageService: LocalStorageService,
    private utilityService: UtilityService,
    private cpEventsService: CpEventsService
  ) {
    this.matIconRegistry.addSvgIconLiteral(
      'list',
      this.domSanitizer.bypassSecurityTrustHtml('<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0133 5.27142C20.0133 5.27142 19.3619 2.16321 16.5483 1.07142C15.2251 0.567754 12.81 0.315082 10.4368 0.294586C8.04325 0.315094 5.62825 0.566935 4.30504 1.07142C1.49146 2.16325 0.840037 5.27142 0.840037 5.27142C0.420037 7.03508 0.293701 8.82 0.293701 10.395C0.293701 11.9913 0.420029 13.7764 0.840037 15.54C0.840037 15.54 1.49137 18.6482 4.30504 19.74C5.62821 20.2437 8.04325 20.4963 10.4165 20.5168C12.7897 20.4955 15.2047 20.265 16.5279 19.74C19.3415 18.6482 19.9929 15.54 19.9929 15.54C20.4129 13.7763 20.5597 11.9914 20.5392 10.4164C20.5589 8.82008 20.4332 7.035 20.0133 5.27142ZM5.88004 6.53142H7.60187V7.89642H5.88004V6.53142ZM7.60187 14.28H5.88004V12.915H7.60187V14.28ZM7.60187 11.025H5.88004V9.66H7.60187V11.025ZM15.3719 14.28H9.05129V12.915H15.3727L15.3719 14.28ZM15.3719 11.025H9.05129V9.66H15.3727L15.3719 11.025ZM15.3719 7.89642H9.05129V6.53142H15.3727L15.3719 7.89642Z" fill="#A0A0A0"/></svg>')
    );
    this.matIconRegistry.addSvgIconLiteral(
      'logout',
      this.domSanitizer.bypassSecurityTrustHtml('<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.4999 0.61084C10.0811 0.61084 6.80268 1.96908 4.3864 4.38664C1.96898 6.80292 0.610596 10.0814 0.610596 13.5002C0.610596 16.919 1.96884 20.1974 4.3864 22.6137C6.80268 25.0311 10.0811 26.3895 13.4999 26.3895C16.9187 26.3895 20.1972 25.0313 22.6135 22.6137C25.0309 20.1974 26.3893 16.919 26.3893 13.5002C26.3893 10.0814 25.031 6.80292 22.6135 4.38664C20.1972 1.96923 16.9187 0.61084 13.4999 0.61084ZM10.1728 16.1905C9.82726 16.3287 9.4319 16.2494 9.16568 15.9889L7.32146 14.1446C7.147 13.9725 7.04958 13.7368 7.04958 13.4921C7.04958 13.2474 7.147 13.0118 7.32146 12.8396L9.16568 10.9954V10.9943C9.42283 10.6975 9.84083 10.5978 10.2045 10.7451C10.5692 10.8923 10.7992 11.2548 10.7765 11.6468V12.5655H14.4581V14.4097L10.7368 14.4109V15.3296V15.3285C10.7425 15.7046 10.5194 16.0455 10.1728 16.1905ZM19.9443 16.263C19.9421 17.4819 19.4572 18.651 18.5951 19.513C17.7319 20.3751 16.564 20.8611 15.344 20.8633H11.6554V19.0259H15.337H15.3359C16.0688 19.0259 16.7723 18.7348 17.29 18.2171C17.8077 17.6982 18.0988 16.9959 18.0988 16.263V10.737C18.0988 9.21114 16.8618 7.97411 15.3359 7.97411H11.6555V6.1367H15.3371H15.3359C16.5571 6.1367 17.7273 6.62155 18.5918 7.48361C19.4561 8.34682 19.9421 9.51587 19.9443 10.7371L19.9443 16.263Z" fill="#A0A0A0"/></svg>')
    );

    this.userData = this.localStorageService.get(LOCAL_STORAGE_CONSTANT.USER_DATA);
    this.currentLanguage = this.localStorageService.get(LOCAL_STORAGE_CONSTANT.CURRENT_LANGUAGE_STATE_KEY);
  }

  ngOnInit(): void {
    this.cpEventsService.toggleSidebar
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: boolean) => {
        this.menuOpen = res;
    })
  }

  changeLanguage(): void {
    this.utilityService.changeLanguage(this.currentLanguage, this.userData?.uuid);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;  
  }
}
