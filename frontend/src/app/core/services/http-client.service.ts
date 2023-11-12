import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient: HttpClient) {}

  get(path: string, options = {}): Observable<any> {
    return this.httpClient.get(path, options);
  }

  post(path: string, body, options = {}): Observable<any> {
    return this.httpClient.post(path, body, options);
  }

  put(path: string, body, options = {}): Observable<any> {
    return this.httpClient.put(path, body, options);
  }

  patch(path: string, body, options = {}): Observable<any> {
    return this.httpClient.patch(path, body, options);
  }
  
  delete(path: string, options = {}): Observable<any> {
    return this.httpClient.delete(path, options);
  }

}
