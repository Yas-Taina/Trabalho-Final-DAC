import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { LoginInfo, LogoutResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  login(data: LoginInfo): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.apiUrl}/login`, data, { headers: this.headers });
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(`${this.apiUrl}/logout`, {}, { headers: this.headers });
  }
}
