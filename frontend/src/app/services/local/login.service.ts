import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginInfo, LoginResponse, LogoutResponse } from '../model';
import { LocalBaseService } from '../local.base.service';

@Injectable({
  providedIn: 'root',
})
export class LocalLoginService extends LocalBaseService {
  private tokenKey = 'dac_token';

  // POST /login
  login(credentials: LoginInfo): Observable<LoginResponse> {
  }

  // POST /logout
  logout(): Observable<LogoutResponse> {
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
