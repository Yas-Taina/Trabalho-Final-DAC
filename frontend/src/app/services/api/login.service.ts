import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BaseService } from '../api.base.service';
import { LoginInfo, LoginResponse, LogoutResponse } from '../model';
import { error } from 'console';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends BaseService {
  private tokenKey = 'token';

  // POST /login
  login(credentials: LoginInfo): Observable<LoginResponse> {
    return this.post<LoginResponse>('/login', credentials)
      .pipe(
        tap((res) => {
          console.log('Login response:', res);
          if (res) {
            localStorage.setItem(this.tokenKey, JSON.stringify(res));
          }
        },
      )
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

  sessionInfo(): LoginResponse | null {
    const sessionData = localStorage.getItem(this.tokenKey);
    return sessionData ? JSON.parse(sessionData) as LoginResponse : null;
  }
}
