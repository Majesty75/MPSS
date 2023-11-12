import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE_CONSTANT } from '@constants/localstorage.constant';
import { LocalStorageService } from '@services/local-storage.service';
import { DEFAULT_LANGUAGE } from '@constants/app.constants';
import { LoginResponse } from '@models/auth.model';
import { PartnerService } from '@services/partner.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  readonly days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private partnerService: PartnerService
  ) { }

  setLanguage(): void {
    const localStorageLanguage = this.localStorageService.get(LOCAL_STORAGE_CONSTANT.CURRENT_LANGUAGE_STATE_KEY) as string;
    const language = localStorageLanguage || DEFAULT_LANGUAGE;
    this.translateService.setDefaultLang(language);
    this.localStorageService.set(LOCAL_STORAGE_CONSTANT.CURRENT_LANGUAGE_STATE_KEY, language);
  }

  getUserFromLocalStorage(): LoginResponse {
    return this.localStorageService.get(LOCAL_STORAGE_CONSTANT.USER_DATA);
  }

  changeLanguage(locale: string, uuid?: string): void {
    uuid && this.partnerService.updatePartnerDetail({ locale }, uuid).subscribe();
    this.localStorageService.set(LOCAL_STORAGE_CONSTANT.CURRENT_LANGUAGE_STATE_KEY, locale);
    this.translateService.use(locale);
  }

  getPreviousMonthNameFromDate(dateISO: string): string {
    const date = new Date(dateISO);
    const previousMonth = date.getMonth() === 0 ? 11 : date.getMonth() - 1;
    const year = previousMonth === 11 ? date.getFullYear() - 1 : date.getFullYear();
    const previousMonthName = new Date(year, previousMonth, 1);
    return `${previousMonthName.toLocaleString('default', { month: 'short' })} ${year}`;
  }

  numberToDayConverter(index: number): string {
    return `days.${this.days[index-1]}`;
  }

}
