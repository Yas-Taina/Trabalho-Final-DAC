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

  private writeStorage(clientes: Cliente[]): void {
    this.writeLocalArray<Cliente>(this.storageKey, clientes);
  }

  // GET /clientes?filtro=...
  getClientes(filtro?: 'para_aprovar' | 'adm_relatorio_clientes' | 'melhores_clientes'): Observable<DadosClienteResponse[]> {
    
  }

  // POST /clientes (autocadastro)
  autocadastroCliente(data: AutocadastroInfo): Observable<any> {
    
  }

  // GET /clientes/{cpf}
  getCliente(cpf: string): Observable<DadosClienteResponse> {
    
  }

  // PUT /clientes/{cpf}
  atualizarCliente(cpf: string, data: PerfilInfo): Observable<any> {
    
  }

  // POST /clientes/{cpf}/aprovar
  aprovarCliente(cpf: string): Observable<ContaResponse> {
    
  }

  // POST /clientes/{cpf}/rejeitar
  rejeitarCliente(cpf: string, motivo: string): Observable<any> {
    
  }
}
