import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { LOCAL_STORAGE_CONSTANT } from '@constants/localstorage.constant';
import { LocalStorageService } from '@services/local-storage.service';

export const LoginGuard: CanMatchFn = (route, segments) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);
  const token = localStorageService.get(LOCAL_STORAGE_CONSTANT.LOGIN_TOKEN);
  if (!token || (segments.length || segments[segments.length - 1].path == 'logout')) {
    return true;
  }
  router.navigate(['/admin']);
  return false;
};
