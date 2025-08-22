import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from '../api.base.service';
import { LoginInfo, LogoutResponse } from '../model';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends BaseService {
  private tokenKey = 'token';

  // POST /login
  login(credentials: LoginInfo): Observable<any> {
    return this.post<any>('/login', credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
        }
      })
    );
  }

  // POST /logout
  logout(): Observable<LogoutResponse> {
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.post<LogoutResponse>('/logout', {}, headers).pipe(
      tap(() => {
        localStorage.removeItem(this.tokenKey);
      })
    );
  }

  // helper: verifica se está logado
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
