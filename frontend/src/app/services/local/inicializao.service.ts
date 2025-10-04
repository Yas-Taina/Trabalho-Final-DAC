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

      const gerenteGenieve: Gerente = {
        cpf: '98574307084',
        nome: 'Geniéve',
        email: 'ger1@bantads.com.br',
        telefone: '41 98888-0001',
        tipo: 'GERENTE',
        senha: 'tads',
      };

      const gerenteGodophredo: Gerente = {
        cpf: '64065268052',
        nome: 'Godophredo',
        email: 'ger2@bantads.com.br',
        telefone: '41 98888-0002',
        tipo: 'GERENTE',
        senha: 'tads',
      };

      const gerenteGyandula: Gerente = {
        cpf: '23862179060',
        nome: 'Gyândula',
        email: 'ger3@bantads.com.br',
        telefone: '41 98888-0003',
        tipo: 'GERENTE',
        senha: 'tads',
      };

      const adminAdamantio: Gerente = {
        cpf: '40501740066',
        nome: 'Adamântio',
        email: 'adm1@bantads.com.br',
        telefone: '41 97777-0001',
        tipo: 'ADMINISTRADOR',
        senha: 'tads',
      };

      const contaCatharyna: Conta = {
        numero: '1291',
        dataCriacao: '2000-01-01T00:00:00-03:00', 
        saldo: 800,
        limite: 5000,
        gerenteCpf: gerenteGenieve.cpf,
        historico: [
          { dataHora: '2020-01-01T10:00:00-03:00', tipo: 'DEPOSITO', valor: 1000 },
          { dataHora: '2020-01-01T11:00:00-03:00', tipo: 'DEPOSITO', valor: 900 },
          { dataHora: '2020-01-01T12:00:00-03:00', tipo: 'SAQUE', valor: 550 },
          { dataHora: '2020-01-01T13:00:00-03:00', tipo: 'SAQUE', valor: 350 },
          { dataHora: '2020-01-10T15:00:00-03:00', tipo: 'DEPOSITO', valor: 2000 },
          { dataHora: '2020-01-15T08:00:00-03:00', tipo: 'SAQUE', valor: 500 },
          {
            dataHora: '2020-01-20T12:00:00-03:00',
            tipo: 'TRANSFERENCIA',
            clienteOrigemCpf: '12912861012',
            clienteDestinoCpf: '09506382000',
            valor: 1700,
          },
        ],
      };

      const contaCleuddonio: Conta = {
        numero: '0950',
        dataCriacao: '1990-10-10T00:00:00-03:00', 
        saldo: -10000,
        limite: 10000,
        gerenteCpf: gerenteGodophredo.cpf,
        historico: [
          {
            dataHora: '2020-01-20T12:00:00-03:00',
            tipo: 'TRANSFERENCIA',
            clienteOrigemCpf: '12912861012',
            clienteDestinoCpf: '09506382000',
            valor: 1700,
          },
          { dataHora: '2025-01-01T12:00:00-03:00', tipo: 'DEPOSITO', valor: 1000 },
          { dataHora: '2025-01-02T10:00:00-03:00', tipo: 'DEPOSITO', valor: 5000 },
          { dataHora: '2025-01-10T10:00:00-03:00', tipo: 'SAQUE', valor: 200 },
          { dataHora: '2025-02-05T10:00:00-03:00', tipo: 'DEPOSITO', valor: 7000 },
        ],
      };

      const contaCatianna: Conta = {
        numero: '8573',
        dataCriacao: '2012-12-12T00:00:00-03:00', 
        saldo: -1000,
        limite: 1500,
        gerenteCpf: gerenteGyandula.cpf,
        historico: [
          { dataHora: '2025-05-05T12:00:00-03:00', tipo: 'DEPOSITO', valor: 1000 },
          { dataHora: '2025-05-06T13:00:00-03:00', tipo: 'SAQUE', valor: 2000 },
        ],
      };

      const contaCutardo: Conta = {
        numero: '5887',
        dataCriacao: '2022-02-22T00:00:00-03:00', 
        saldo: 150000,
        limite: 0,
        gerenteCpf: gerenteGenieve.cpf,
        historico: [
          { dataHora: '2025-06-01T12:00:00-03:00', tipo: 'DEPOSITO', valor: 150000 },
        ],
      };

      const contaCoandrya: Conta = {
        numero: '7617',
        dataCriacao: '2025-01-01T00:00:00-03:00',
        saldo: 1500,
        limite: 0,
        gerenteCpf: gerenteGodophredo.cpf,
        historico: [
          { dataHora: '2025-07-01T12:00:00-03:00', tipo: 'DEPOSITO', valor: 1500 },
        ],
      };

      const contaBruna: Conta = {
        numero: '4312',
        dataCriacao: '2019-05-01T00:00:00-03:00',
        saldo: 2500,
        limite: 2000,
        gerenteCpf: gerenteGenieve.cpf,
        historico: [
          { dataHora: '2024-03-01T09:00:00-03:00', tipo: 'DEPOSITO', valor: 1000 },
          { dataHora: '2024-03-01T14:00:00-03:00', tipo: 'SAQUE', valor: 200 },
          { dataHora: '2024-03-05T11:30:00-03:00', tipo: 'DEPOSITO', valor: 800 },
          {
            dataHora: '2024-04-10T16:00:00-03:00',
            tipo: 'TRANSFERENCIA',
            clienteOrigemCpf: '21453687091',  
            clienteDestinoCpf: '30694125078', 
            valor: 300
          },
        ],
      };

      const contaDiego: Conta = {
        numero: '5096',
        dataCriacao: '2018-08-15T00:00:00-03:00',
        saldo: -500,
        limite: 3000,
        gerenteCpf: gerenteGodophredo.cpf,
        historico: [
          {
            dataHora: '2024-04-10T16:00:00-03:00',
            tipo: 'TRANSFERENCIA',
            clienteOrigemCpf: '21453687091',
            clienteDestinoCpf: '30694125078',
            valor: 300
          },
          { dataHora: '2025-02-01T10:00:00-03:00', tipo: 'DEPOSITO', valor: 1500 },
          { dataHora: '2025-02-03T12:00:00-03:00', tipo: 'SAQUE', valor: 200 },
        ],
      };

      const contaElton: Conta = {
        numero: '6875',
        dataCriacao: '2020-07-07T00:00:00-03:00',
        saldo: 4000,
        limite: 0,
        gerenteCpf: gerenteGyandula.cpf,
        historico: [
          { dataHora: '2025-03-01T09:15:00-03:00', tipo: 'DEPOSITO', valor: 2000 },
          { dataHora: '2025-03-02T10:20:00-03:00', tipo: 'SAQUE', valor: 500 },
          {
            dataHora: '2025-03-15T13:00:00-03:00',
            tipo: 'TRANSFERENCIA',
            clienteOrigemCpf: '47812536900', 
            clienteDestinoCpf: '58963074122', 
            valor: 700
          },
        ],
      };

      const contaFabiana: Conta = {
        numero: '8458',
        dataCriacao: '2021-09-09T00:00:00-03:00',
        saldo: 900,
        limite: 1000,
        gerenteCpf: gerenteGenieve.cpf,
        historico: [
          {
            dataHora: '2025-03-15T13:00:00-03:00',
            tipo: 'TRANSFERENCIA',
            clienteOrigemCpf: '47812536900',
            clienteDestinoCpf: '58963074122',
            valor: 700
          },
          { dataHora: '2025-03-20T10:00:00-03:00', tipo: 'DEPOSITO', valor: 400 },
        ],
      };

      const contaHelena: Conta = {
        numero: '9761',
        dataCriacao: '2025-01-15T00:00:00-03:00',
        saldo: 150,
        limite: 500,
        gerenteCpf: gerenteGodophredo.cpf,
        historico: [
          { dataHora: '2025-04-01T08:00:00-03:00', tipo: 'DEPOSITO', valor: 300 },
          { dataHora: '2025-04-10T09:45:00-03:00', tipo: 'SAQUE', valor: 100 },
        ],
      };

      const clienteCatharyna: Cliente = {
        cpf: '12912861012',
        nome: 'Catharyna',
        email: 'cli1@bantads.com.br',
        senha: 'tads',
        salario: 10000,
        endereco: {
          logradouro: 'Rua Exemplo',
          numero: '100',
          complemento: '',
          tipo: 'Residencial',
          cep: '80000-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0001',
        estado: 'APROVADO',
        dadosConta: contaCatharyna,
        gerenteCpf: contaCatharyna.gerenteCpf,
      };

      const clienteCleuddonio: Cliente = {
        cpf: '09506382000',
        nome: 'Cleuddônio',
        email: 'cli2@bantads.com.br',
        senha: 'tads',
        salario: 20000,
        endereco: {
          logradouro: 'Rua Exemplo',
          numero: '200',
          complemento: '',
          tipo: 'Residencial',
          cep: '80000-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0002',
        estado: 'APROVADO',
        dadosConta: contaCleuddonio,
        gerenteCpf: contaCleuddonio.gerenteCpf,
      };

      const clienteCatianna: Cliente = {
        cpf: '85733854057',
        nome: 'Catianna',
        email: 'cli3@bantads.com.br',
        senha: 'tads',
        salario: 3000,
        endereco: {
          logradouro: 'Rua Exemplo',
          numero: '300',
          complemento: '',
          tipo: 'Residencial',
          cep: '80000-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0003',
        estado: 'APROVADO',
        dadosConta: contaCatianna,
        gerenteCpf: contaCatianna.gerenteCpf,
      };

      const clienteCutardo: Cliente = {
        cpf: '58872160006',
        nome: 'Cutardo',
        email: 'cli4@bantads.com.br',
        senha: 'tads',
        salario: 500,
        endereco: {
          logradouro: 'Rua Exemplo',
          numero: '400',
          complemento: '',
          tipo: 'Residencial',
          cep: '80000-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0004',
        estado: 'APROVADO',
        dadosConta: contaCutardo,
        gerenteCpf: contaCutardo.gerenteCpf,
      };

      const clienteCoandrya: Cliente = {
        cpf: '76179646090',
        nome: 'Coândrya',
        email: 'cli5@bantads.com.br',
        senha: 'tads',
        salario: 1500,
        endereco: {
          logradouro: 'Rua Exemplo',
          numero: '500',
          complemento: '',
          tipo: 'Residencial',
          cep: '80000-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0005',
        estado: 'APROVADO',
        dadosConta: contaCoandrya,
        gerenteCpf: contaCoandrya.gerenteCpf,
      };

      const clienteBruna: Cliente = {
        cpf: '21453687091',
        nome: 'Bruna',
        email: 'cli6@bantads.com.br',
        senha: 'tads',
        salario: 2500,
        endereco: {
          logradouro: 'Rua Das Palmeiras',
          numero: '10',
          complemento: '',
          tipo: 'Residencial',
          cep: '80010-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0006',
        estado: 'APROVADO',
        dadosConta: contaBruna,
        gerenteCpf: contaBruna.gerenteCpf,
      };

      const clienteDiego: Cliente = {
        cpf: '30694125078',
        nome: 'Diego',
        email: 'cli7@bantads.com.br',
        senha: 'tads',
        salario: 8000,
        endereco: {
          logradouro: 'Av. Central',
          numero: '200',
          complemento: 'Ap 101',
          tipo: 'Residencial',
          cep: '80020-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0007',
        estado: 'APROVADO',
        dadosConta: contaDiego,
        gerenteCpf: contaDiego.gerenteCpf,
      };

      const clienteElton: Cliente = {
        cpf: '47812536900',
        nome: 'Elton',
        email: 'cli8@bantads.com.br',
        senha: 'tads',
        salario: 12000,
        endereco: {
          logradouro: 'Rua das Araucárias',
          numero: '55',
          complemento: '',
          tipo: 'Residencial',
          cep: '80030-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0008',
        estado: 'APROVADO',
        dadosConta: contaElton,
        gerenteCpf: contaElton.gerenteCpf,
      };

      const clienteFabiana: Cliente = {
        cpf: '58963074122',
        nome: 'Fabiana',
        email: 'cli9@bantads.com.br',
        senha: 'tads',
        salario: 2200,
        endereco: {
          logradouro: 'Rua XV de Novembro',
          numero: '1500',
          complemento: '',
          tipo: 'Residencial',
          cep: '80040-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0009',
        estado: 'APROVADO',
        dadosConta: contaFabiana,
        gerenteCpf: contaFabiana.gerenteCpf,
      };

      const clienteHelena: Cliente = {
        cpf: '69021478533',
        nome: 'Helena',
        email: 'cli10@bantads.com.br',
        senha: 'tads',
        salario: 4000,
        endereco: {
          logradouro: 'Rua Marechal',
          numero: '789',
          complemento: '',
          tipo: 'Residencial',
          cep: '80050-000',
          cidade: 'Curitiba',
          estado: 'PR',
        },
        telefone: '41 99999-0010',
        estado: 'APROVADO',
        dadosConta: contaHelena,
        gerenteCpf: contaHelena.gerenteCpf,
      };

      localStorage.setItem(
        gerentesKey,
        JSON.stringify([gerenteGenieve, gerenteGodophredo, gerenteGyandula, adminAdamantio])
      );
      localStorage.setItem(
        contasKey,
        JSON.stringify([contaCatharyna, contaCleuddonio, contaCatianna, contaCutardo, contaCoandrya, contaBruna, contaDiego, contaElton, contaFabiana, contaHelena
])
      );
      localStorage.setItem(
        clientesKey,
        JSON.stringify([clienteCatharyna, clienteCleuddonio, clienteCatianna, clienteCutardo, clienteCoandrya,clienteBruna, clienteDiego, clienteElton, clienteFabiana, clienteHelena])
      );
      localStorage.setItem(inicializacaoKey, JSON.stringify([new Date().toISOString()]));

      observer.next({ ok: true, message: 'Banco inicializado com sucesso' });
      observer.complete();
    });
  }
}
