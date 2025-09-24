import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalBaseService } from '../local.base.service';
import { Cliente } from './models/cliente';
import { Gerente } from './models/gerente';
import { Conta } from './models/conta';

@Injectable({
  providedIn: 'root',
})
export class LocalInicializacaoService extends LocalBaseService<any> {
  constructor() {
    super('inicializacao'); 
  }

  inicializarBanco(): Observable<any> {
    return new Observable<any>((observer) => {
      const clientesKey = 'clientes';
      const contasKey = 'contas';
      const gerentesKey = 'gerentes';
      const inicializacaoKey = 'inicializado';

      const jaInicializado = localStorage.getItem(inicializacaoKey);
      if (jaInicializado) {
        observer.next({ ok: true, message: 'Banco já inicializado' });
        observer.complete();
        return;
      }

      const gerenteExemplo: Gerente = {
        nome: 'Gerente Exemplo',
        email: 'm@m',
        telefone: '41 98888-0002',
        cpf: '222.222.222-22',
        tipo: 'GERENTE',
        senha: '1234',
      };

      const gerenteExemplo2: Gerente = {
        nome: 'Gerente Exemplo 2',
        email: 'g@g',
        telefone: '41 98888-0003',
        cpf: '222.222.222-21',
        tipo: 'GERENTE',
        senha: '1234',
      };

      const adminExemplo: Gerente = {
        nome: 'Administrador Exemplo',
        email: 'a@a',
        telefone: '41 97777-0003',
        cpf: '333.333.333-33',
        tipo: 'ADMINISTRADOR',
        senha: '1234',
      };

      const contaExemplo: Conta = {
        numero: '1001',
        dataCriacao: new Date().toISOString(),
        saldo: 2500,
        limite: 1000,
        gerenteCpf: gerenteExemplo.cpf,
        historico: [],
      };

      // const contaExemplo2: Conta = {
      //   numero: '1002',
      //   dataCriacao: new Date().toISOString(),
      //   saldo: 2500,
      //   limite: 1000,
      //   gerenteCpf: gerenteExemplo.cpf,
      //   historico: [],
      // };

      const contaExemplo3: Conta = {
        numero: '1003',
        dataCriacao: new Date().toISOString(),
        saldo: 3000,
        limite: 500,
        gerenteCpf: gerenteExemplo2.cpf,
        historico: [],
      };

      const contaExemplo4: Conta = {
        numero: '1004',
        dataCriacao: new Date().toISOString(),
        saldo: -400,
        limite: 1000,
        gerenteCpf: gerenteExemplo2.cpf,
        historico: [],
      };

      const clienteExemplo: Cliente = {
        nome: 'Cliente Exemplo',
        email: 'c@c',
        cpf: '111.111.111-11',
        endereco: {
          logradouro: 'Rua Exemplo',
          numero: '123',
          complemento: '',
          tipo: 'Residencial',
          cep: '80000-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0001',
        salario: 3000,
        estado: 'APROVADO',
        dadosConta: contaExemplo,
        senha: '1234',
        gerenteCpf: gerenteExemplo.cpf,
      };

      localStorage.setItem(gerentesKey, JSON.stringify([gerenteExemplo, gerenteExemplo2, adminExemplo]));
      localStorage.setItem(contasKey, JSON.stringify([contaExemplo, contaExemplo3, contaExemplo4]));
      localStorage.setItem(clientesKey, JSON.stringify([clienteExemplo]));
      localStorage.setItem(inicializacaoKey, JSON.stringify([new Date().toISOString()]));

      observer.next({ ok: true, message: 'Banco inicializado com sucesso' });
      observer.complete();
    });
  }
}
