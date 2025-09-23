// src/app/services/clientes.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutocadastroInfo, PerfilInfo, ContaResponse, DadosClienteResponse } from '../model';
import { LocalBaseService } from '../local.base.service';
import { Cliente } from './models/cliente';

@Injectable({
  providedIn: 'root',
})
export class LocalClientesService extends LocalBaseService {
  private readonly storageKey = 'dac_clientes';
  private readStorage(): Cliente[] {
    return this.readLocalArray<Cliente>(this.storageKey);
  }

  listarClientes(): Cliente[] {
    return this.readStorage();
  }

  private writeStorage(clientes: Cliente[]): void {
    this.writeLocalArray<Cliente>(this.storageKey, clientes);
  }

  // GET /clientes?filtro=...
  getClientes(filtro?: 'para_aprovar' | 'adm_relatorio_clientes' | 'melhores_clientes'): Observable<DadosClienteResponse[]> {
    const clientes = this.readStorage();
    if (!clientes) {
      return new Observable<DadosClienteResponse[]>((observer) => {
        observer.next([]);
        observer.complete();
      });
    }

    return new Observable<DadosClienteResponse[]>((observer) => {
      if (filtro === 'para_aprovar') {
        observer.next(clientes.filter(c => c.status === 'PENDENTE'));
      } else if (filtro === 'adm_relatorio_clientes') {
        observer.next(clientes.filter(c => c.status === 'APROVADO'));
      } else if (filtro === 'melhores_clientes') {
        observer.next(clientes.filter(c => (c.dadosConta?.saldo ?? 0) >= 10000));
      } else {
        observer.next(clientes);
      }
      observer.complete();
    });
  }

  // POST /clientes (autocadastro)
  autocadastroCliente(data: AutocadastroInfo): Observable<any> {
    return new Observable<any>((observer) => {
      const clientes = this.readStorage();
      const exists = clientes.find((c: Cliente) => c.cpf === data.cpf);
      if (exists) {
        observer.error(new Error('Cliente com este CPF já existe'));
        observer.complete();
        return;
      }

      const novo: Cliente = {
        ...data,
        id: (Math.random() * 1e8).toFixed(0),
        dadosConta: {} as ContaResponse,
        status: 'PENDENTE',
      } as Cliente;

      clientes.push(novo);
      this.writeStorage(clientes);

      observer.next(novo);
      observer.complete();
    });
  }

  // GET /clientes/{cpf}
  getCliente(cpf: string): Observable<DadosClienteResponse> {
    const clientesStorage = localStorage.getItem(this.storageKey);
    if (clientesStorage) {
      const clientes = JSON.parse(clientesStorage) as Cliente[];
      const cliente = clientes.find(c => c.cpf === cpf);
      return new Observable<DadosClienteResponse>((observer) => {
        if (cliente) {
          observer.next(cliente as DadosClienteResponse);
        } else {
          observer.error(new Error('Cliente não encontrado no armazenamento local'));
        }
        observer.complete();
      });
    }

    return new Observable<DadosClienteResponse>((observer) => {
      observer.error(new Error('Cliente não encontrado no armazenamento local'));
      observer.complete();
    });
  }

  // PUT /clientes/{cpf}
  atualizarCliente(cpf: string, data: PerfilInfo): Observable<any> {
    return new Observable<any>((observer) => {
      const clientes = this.readStorage();
      const idx = clientes.findIndex(c => c.cpf === cpf);
      if (idx === -1) {
        observer.error(new Error('Cliente não encontrado'));
        observer.complete();
        return;
      }

      const updated = { ...clientes[idx], ...data } as Cliente;
      clientes[idx] = updated;
      this.writeStorage(clientes);

      observer.next(updated);
      observer.complete();
    });
  }

  // POST /clientes/{cpf}/aprovar
  aprovarCliente(cpf: string): Observable<ContaResponse> {
    return new Observable<ContaResponse>((observer) => {
      const clientes = this.readStorage();
      const idx = clientes.findIndex(c => c.cpf === cpf);
      if (idx === -1) {
        observer.error(new Error('Cliente não encontrado'));
        observer.complete();
        return;
      }

      const conta: ContaResponse = {
        cliente: cpf,
        numero: Math.floor(100000 + Math.random() * 900000).toString(),
        saldo: 0,
        limite: 1000,
        gerente: '',
        criacao: new Date().toISOString(),
      };

      clientes[idx].dadosConta = conta;
      clientes[idx].status = 'APROVADO';
      this.writeStorage(clientes);

      observer.next(conta);
      observer.complete();
    });
  }

  // POST /clientes/{cpf}/rejeitar
  rejeitarCliente(cpf: string, motivo: string): Observable<any> {
    return new Observable<any>((observer) => {
      const clientes = this.readStorage();
      const idx = clientes.findIndex(c => c.cpf === cpf);
      if (idx === -1) {
        observer.error(new Error('Cliente não encontrado'));
        observer.complete();
        return;
      }

      clientes[idx].status = 'REJEITADO';
      (clientes[idx] as Cliente).rejeicaoMotivo = motivo;
      this.writeStorage(clientes);

      observer.next({ ok: true });
      observer.complete();
    });
  }
}
