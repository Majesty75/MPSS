import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { LOCAL_STORAGE_CONSTANT } from '@constants/localstorage.constant';
import { LocalStorageService } from '@services/local-storage.service';

export const LoginGuard: CanMatchFn = () => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);
  const token = localStorageService.get(LOCAL_STORAGE_CONSTANT.LOGIN_TOKEN);
  if (!token) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
