import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { DadoGerente, DadoGerenteInsercao, DadoGerenteAtualizacao, DadoConta, DadosClienteResponse } from '../model';
import { Gerente } from './models/gerente';
import { LocalBaseService } from '../local.base.service';
import { LocalContasService } from './contas.service';
import { LocalClientesService } from './clientes.service';

@Injectable({
  providedIn: 'root',
})
export class LocalGerentesService extends LocalBaseService {
  private storageKey = 'dac_gerentes';

  readonly contasService = inject(LocalContasService);
  readonly clientesService = inject(LocalClientesService);
  
  private read(): Gerente[] {
    return this.readLocalArray<Gerente>(this.storageKey);
  }

  private write(list: Gerente[]): void {
    this.writeLocalArray<Gerente>(this.storageKey, list);
  }

  // GET /gerentes?numero=dashboard
  getGerentes(numero?: 'dashboard'): Observable<any> {
    const lista = this.read();

    if (!lista || lista.length === 0) {
      return of([]);
    }

    if (numero !== 'dashboard') {
      return of(lista);
    }

    const contas = this.contasService.getAllContas();

    return this.clientesService.getClientes().pipe(
      map(clientes => {
        return lista.map(gerente => {
          const cpf = gerente.cpf ?? '';

          const contasDoGerente = contas.filter(c => c.gerente === cpf);
          const clientesDoGerente = clientes.filter(c => c.gerente === cpf);

          let saldoPositivo = 0;
          let saldoNegativo = 0;
          contasDoGerente.forEach(conta => {
            const saldo = conta.saldo ?? 0;
            if (saldo >= 0) saldoPositivo += saldo;
            else saldoNegativo += saldo;
          });

          return {
            gerente,
            clientes: clientesDoGerente,
            saldo_positivo: saldoPositivo,
            saldo_negativo: saldoNegativo,
          };
        });
      })
    );
  }

  // POST /gerentes
  inserirGerente(data: DadoGerenteInsercao): Observable<DadoGerente> {
    return new Observable<DadoGerente>((observer) => {
      const lista = this.read();
      const exists = lista.find(g => g.cpf === data.cpf || g.email === data.email);
      if (exists) {
        observer.error(new Error('Gerente com este CPF ou email já existe'));
        observer.complete();
        return;
      }

      const novo: DadoGerente = {
        cpf: data.cpf,
        nome: data.nome,
        email: data.email,
        tipo: data.tipo,
        clientes: [],
      } as DadoGerente;

      lista.push({
        ...novo,
        id: (Math.random() * 1e8).toFixed(0),
        senha: data.senha,
      });
      this.write(lista);

      observer.next(novo);
      observer.complete();
    });
  }

  // GET /gerentes/{cpf}
  getGerente(cpf: string): Observable<DadoGerente> {
    const lista = this.read();
    return new Observable<DadoGerente>((observer) => {
      const gerente = lista.find(x => x.cpf === cpf);
      if (!gerente) {
        observer.error(new Error('Gerente não encontrado'));
        observer.complete();
        return;
      }
      observer.next(gerente);
      observer.complete();
    });
  }

  // DELETE /gerentes/{cpf}
  removerGerente(cpf: string): Observable<DadoGerente> {
    return new Observable<DadoGerente>((observer) => {
      const lista = this.read();
      const idx = lista.findIndex(g => g.cpf === cpf);
      if (idx === -1) {
        observer.error(new Error('Gerente não encontrado'));
        observer.complete();
        return;
      }

      const removed = lista.splice(idx, 1)[0];
      this.write(lista);

      observer.next(removed);
      observer.complete();
    });
  }

  // PUT /gerentes/{cpf}
  atualizarGerente(cpf: string, data: DadoGerenteAtualizacao): Observable<DadoGerente> {
    return new Observable<DadoGerente>((observer) => {
      const lista = this.read();
      const idx = lista.findIndex(g => g.cpf === cpf);
      if (idx === -1) {
        observer.error(new Error('Gerente não encontrado'));
        observer.complete();
        return;
      }

      const updated: Gerente = {
        ...lista[idx],
        nome: data.nome ?? lista[idx].nome,
        email: data.email ?? lista[idx].email,
      };

      lista[idx] = updated;
      this.write(lista);

      observer.next(updated);
      observer.complete();
    });
  }

  listarGerentes(): Gerente[] {
    return this.read();
  }
}
