import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SaldoResponse, OperacaoResponse, TransferenciaResponse, ExtratoResponse } from '../model';
import { LocalBaseService } from '../local.base.service';

@Injectable({
  providedIn: 'root',
})
export class LocalContasService extends LocalBaseService {
  private storageKey = 'dac_contas';

  private read(): any[] {
    return this.readLocalArray<any>(this.storageKey);
  }

  private write(list: any[]): void {
    this.writeLocalArray<any>(this.storageKey, list);
  }

  // // POST /contas/{numero}/saldo
  // getSaldo(numero: string): Observable<SaldoResponse> {
    
  // }

  // // POST /contas/{numero}/depositar
  // depositar(numero: string, valor: number): Observable<OperacaoResponse> {
    
  // }

  // // POST /contas/{numero}/sacar
  // sacar(numero: string, valor: number): Observable<OperacaoResponse> {
    
  // }

  // // POST /contas/{numero}/transferir
  // transferir(numero: string, destino: string, valor: number): Observable<TransferenciaResponse> {
    
  // }

  // // POST /contas/{numero}/extrato
  // getExtrato(numero: string): Observable<ExtratoResponse> {
    
  // }
}
