import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BaseService {
  protected apiUrl = "http://localhost:3000/api";
  protected headers = new HttpHeaders({ "Content-Type": "application/json" });

  protected loading$ = new BehaviorSubject<boolean>(false);
  
  constructor(protected http: HttpClient) {}

  getLoadingState(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  protected setLoading(value: boolean): void {
    this.loading$.next(value);
  }

  protected validateString(value: any, fieldName: string): boolean {
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      return false;
    }
    return true;
  }

  protected validateNumber(value: any, fieldName: string, allowZero = false): boolean {
    if (typeof value !== "number" || isNaN(value)) {
      return false;
    }
    if (!allowZero && value <= 0) {
      return false;
    }
    if (allowZero && value < 0) {
      return false;
    }
    return true;
  }

  protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  protected validateCPF(cpf: string): boolean {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  }

  // Retorna headers com Authorization: Bearer <token> quando houver sessão salva
  protected getAuthHeaders(): HttpHeaders {
    try {
      const json = localStorage.getItem('dac_token');
      if (!json) return this.headers;
      const session = JSON.parse(json) as any;
      const token = session?.access_token;
      if (!token) return this.headers;
      return this.headers.set('Authorization', `Bearer ${token}`);
    } catch (err) {
      return this.headers;
    }
  }
}
