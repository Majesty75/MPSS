import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { LOCAL_STORAGE_CONSTANT } from '@constants/localstorage.constant';
import { CryptoService } from '@services/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: InjectionToken<object>,
    @Inject('LOCALSTORAGE') private localStorage: Storage,
    private cryptoService: CryptoService
  ) {
  }

  get(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      const encryptedValue = this.localStorage.getItem(key);
      return encryptedValue && JSON.parse(this.cryptoService.decryptValue(encryptedValue));
    }
  }

  set(key: string, value: any) {
    if (isPlatformBrowser(this.platformId)) {
      const encryptedValue = this.cryptoService.encryptValue(JSON.stringify(value));
      this.localStorage.setItem(key, encryptedValue);
    }
  }

  remove(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage.removeItem(key);
    }
  }

  clear() {
    if (isPlatformBrowser(this.platformId)) {
      const currentLang: string = this.get(LOCAL_STORAGE_CONSTANT.CURRENT_LANGUAGE_STATE_KEY);
      this.localStorage.clear();
      window.sessionStorage.clear();
      if (currentLang) {
        this.set(LOCAL_STORAGE_CONSTANT.CURRENT_LANGUAGE_STATE_KEY, currentLang);
      }
    }
  }
}
