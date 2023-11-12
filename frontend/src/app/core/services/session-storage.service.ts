import {Injectable} from '@angular/core';
import {environment} from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() {
  }

  get(key: string) {
    return window.sessionStorage.getItem(key + '_' + environment.version);
  }

  set(key: string, value: string) {
    window.sessionStorage.setItem(key + '_' + environment.version, value);
  }

  remove(key: string) {
    window.sessionStorage.removeItem(key + '_' + environment.version);
  }

  clear() {
    window.sessionStorage.clear();
  }
}
