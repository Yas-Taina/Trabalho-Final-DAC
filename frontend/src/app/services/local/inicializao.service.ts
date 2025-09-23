import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalBaseService } from '../local.base.service';
import { Cliente } from './models/cliente';
import { Gerente } from './models/gerente';

@Injectable({
  providedIn: 'root',
})
export class LocalInicializacaoService extends LocalBaseService {
  // GET /reboot
  inicializarBanco(): Observable<any> {
    return new Observable<any>((observer) => {
      // Seed clientes
      const clientesKey = 'dac_clientes';
      const gerentesKey = 'dac_gerentes';
      const inicializacaoKey = 'dac_inicializado';

      const jaInicializado = localStorage.getItem(inicializacaoKey);
      if (jaInicializado) {
        observer.next({ ok: true, message: 'Banco já inicializado' });
        observer.complete();
        return;
      }

      const clientes: Cliente[] = [
        {
          id: (Math.random() * 1e8).toFixed(0),
          cpf: '111.111.111-11',
          nome: 'Cliente Exemplo',
          email: 'c@c',
          telefone: '41 99999-0001',
          senha: '1234',
          status: 'APROVADO',
          dadosConta: {
            cliente: '111.111.111-11',
            numero: '100001',
            saldo: 2500,
            limite: 1000,
            gerente: '222.222.222-22',
            criacao: new Date().toISOString(),
          },
        },
      ];

      const gerentes: Gerente[] = [
        {
          id: (Math.random() * 1e8).toFixed(0),
          cpf: '222.222.222-22',
          nome: 'Gerente Exemplo',
          email: 'm@m',
          telefone: '41 98888-0002',
          tipo: 'GERENTE',
          senha: '1234',
          clientes: [],
          ativo: true,
        },
        {
          id: (Math.random() * 1e8).toFixed(0),
          cpf: '333.333.333-33',
          nome: 'Administrador Exemplo',
          email: 'a@a',
          telefone: '41 97777-0003',
          tipo: 'ADMINISTRADOR',
          senha: '1234',
          ativo: true,
        },
      ];

      this.writeLocalArray(clientesKey, clientes);
      this.writeLocalArray(gerentesKey, gerentes);
      this.writeLocalArray(inicializacaoKey, [new Date().toISOString()]);

      observer.next({ ok: true, message: 'Banco inicializado com sucesso' });
      observer.complete();
    }
    );
  }
}
