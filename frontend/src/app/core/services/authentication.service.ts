import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { API_ROUTES } from '@constants/app.constants';
import { LoginParams, LoginResponse } from '@models/auth.model';
import { HttpClientService } from '@services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  login(params: LoginParams): Observable<LoginResponse> {
    return this.httpClientService.post(API_ROUTES.loginApi, params);
  }

  forgotPassword(params: Partial<LoginParams>): Observable<[] | null> {
    return this.httpClientService.post(API_ROUTES.forgotPasswordApi, params);
  }

  setPassword(params: Partial<LoginParams>): Observable<[] | null> {
    return this.httpClientService.post(API_ROUTES.setPasswordApi, params);
  }
}
