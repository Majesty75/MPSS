import { HttpClientModule, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { appRoutes } from '@constants/app.routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorInterceptor, HttpTokenInterceptor } from '@interceptors/http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([HttpTokenInterceptor, HttpErrorInterceptor])),
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }),
      MatSnackBarModule,
      MatDialogModule
    ),
    { provide: 'LOCALSTORAGE', useFactory: getLocalStorage },
    { provide: LOCALE_ID, useValue: 'en-us' }
  ]
};

export function getLocalStorage() {
  return typeof window !== 'undefined' ? window.localStorage : null;
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
