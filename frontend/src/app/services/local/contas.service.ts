import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  SaldoResponse, 
  OperacaoResponse, 
  TransferenciaResponse, 
  ExtratoResponse, 
  ItemExtratoResponse, 
  ContaResponse 
} from '../model';
import { LocalBaseService } from '../local.base.service';

@Injectable({
  providedIn: 'root',
})
export class LocalContasService extends LocalBaseService {
  private storageKey = 'dac_contas';

  private read(): ContaResponse[] {
    return this.readLocalArray<ContaResponse>(this.storageKey);
  }

  private write(list: ContaResponse[]): void {
    this.writeLocalArray<ContaResponse>(this.storageKey, list);
  }

  private findConta(numero: string): ContaResponse | undefined {
    return this.read().find(c => c.numero === numero);
  }

  private registrarMovimento(
    conta: ContaResponse, 
    movimento: ItemExtratoResponse
  ): void {
    (conta as any).movimentacoes = (conta as any).movimentacoes ?? [];
    (conta as any).movimentacoes.push(movimento);
  }

  // GET /contas/{numero}/saldo
  getSaldo(numero: string): Observable<SaldoResponse> {
    return new Observable<SaldoResponse>((observer) => {
      const conta = this.findConta(numero);
      if (!conta) {
        observer.error(new Error('Conta não encontrada'));
        observer.complete();
        return;
      }

      observer.next({
        cliente: conta.cliente,
        conta: conta.numero,
        saldo: conta.saldo,
      });
      observer.complete();
    });
  }

  // POST /contas/{numero}/depositar
  depositar(numero: string, valor: number): Observable<OperacaoResponse> {
    return new Observable<OperacaoResponse>((observer) => {
      const contas = this.read();
      const idx = contas.findIndex(c => c.numero === numero);
      if (idx === -1) {
        observer.error(new Error('Conta não encontrada'));
        observer.complete();
        return;
      }

      contas[idx].saldo = (contas[idx].saldo ?? 0) + valor;
      this.registrarMovimento(contas[idx], {
        data: new Date().toISOString(),
        tipo: ItemExtratoResponse.TipoEnum.Depsito,
        destino: numero,
        valor,
      });
      this.write(contas);

      observer.next({
        conta: numero,
        data: new Date().toISOString(),
        saldo: contas[idx].saldo,
      });
      observer.complete();
    });
  }

  // POST /contas/{numero}/sacar
  sacar(numero: string, valor: number): Observable<OperacaoResponse> {
    return new Observable<OperacaoResponse>((observer) => {
      const contas = this.read();
      const idx = contas.findIndex(c => c.numero === numero);
      if (idx === -1) {
        observer.error(new Error('Conta não encontrada'));
        observer.complete();
        return;
      }

      const saldoAtual = contas[idx].saldo ?? 0;
      const limite = contas[idx].limite ?? 0;
      if (saldoAtual + limite < valor) {
        observer.error(new Error('Saldo insuficiente'));
        observer.complete();
        return;
      }

      contas[idx].saldo = saldoAtual - valor;
      this.registrarMovimento(contas[idx], {
        data: new Date().toISOString(),
        tipo: ItemExtratoResponse.TipoEnum.Saque,
        origem: numero,
        valor,
      });
      this.write(contas);

      observer.next({
        conta: numero,
        data: new Date().toISOString(),
        saldo: contas[idx].saldo,
      });
      observer.complete();
    });
  }

  // POST /contas/{numero}/transferir
  transferir(numero: string, destino: string, valor: number): Observable<TransferenciaResponse> {
    return new Observable<TransferenciaResponse>((observer) => {
      const contas = this.read();
      const origemIdx = contas.findIndex(c => c.numero === numero);
      if (origemIdx === -1) {
        observer.error(new Error('Conta de origem não encontrada'));
        observer.complete();
        return;
      }

      const origem = contas[origemIdx];
      const saldoOrigem = origem.saldo ?? 0;
      const limiteOrigem = origem.limite ?? 0;

      if (saldoOrigem + limiteOrigem < valor) {
        observer.error(new Error('Saldo insuficiente'));
        observer.complete();
        return;
      }

      // debita origem
      origem.saldo = saldoOrigem - valor;
      this.registrarMovimento(origem, {
        data: new Date().toISOString(),
        tipo: ItemExtratoResponse.TipoEnum.Transferncia,
        origem: numero,
        destino,
        valor,
      });

      // credita destino (se existir no banco)
      const destinoIdx = contas.findIndex(c => c.numero === destino);
      if (destinoIdx !== -1) {
        contas[destinoIdx].saldo = (contas[destinoIdx].saldo ?? 0) + valor;
        this.registrarMovimento(contas[destinoIdx], {
          data: new Date().toISOString(),
          tipo: ItemExtratoResponse.TipoEnum.Transferncia,
          origem: numero,
          destino,
          valor,
        });
      }

      this.write(contas);

      observer.next({
        conta: numero,
        destino,
        data: new Date().toISOString(),
        valor,
        saldo: origem.saldo,
      });
      observer.complete();
    });
  }

  // GET /contas/{numero}/extrato
  getExtrato(numero: string): Observable<ExtratoResponse> {
    return new Observable<ExtratoResponse>((observer) => {
      const conta = this.findConta(numero);
      if (!conta) {
        observer.error(new Error('Conta não encontrada'));
        observer.complete();
        return;
      }

      observer.next({
        conta: conta.numero,
        saldo: conta.saldo,
        movimentacoes: (conta as any).movimentacoes ?? [],
      });
      observer.complete();
    });
  }
}
