import { Injectable } from '@angular/core';
import { Cliente } from './models/cliente';
import { LocalBaseService } from '../local.base.service';
import { Gerente } from './models/gerente';
import { Conta } from './models/conta';

@Injectable({
  providedIn: 'root'
})
export class LocalClientesService {
  private base = new LocalBaseService<Cliente>('clientes');
  private gerentesBase = new LocalBaseService<Gerente>('gerentes');
  private contasBase = new LocalBaseService<Conta>('contas');

  listarClientes(): Cliente[] {
    return this.base.getAll();
  }

cadastrarCliente(cliente: Cliente): void {
  const jaExiste = this.listarClientes().some(c => c.cpf === cliente.cpf);
  if (jaExiste) throw new Error('Cliente já cadastrado');

  const gerentes = this.gerentesBase.getAll().filter(g => g.tipo === 'GERENTE');
  if (!gerentes.length) throw new Error('Nenhum gerente disponível');

  const clientes = this.listarClientes();
  const clientesPorGerente: Record<string, number> = {};
  gerentes.forEach(g => {
    clientesPorGerente[g.cpf] = clientes.filter(
      c => c.gerenteCpf === g.cpf && (c.estado === 'AGUARDANDO' || c.estado === 'APROVADO')
    ).length;
  });

  const menorNumeroClientes = Math.min(...Object.values(clientesPorGerente));
  const gerentesComMenosClientes = gerentes.filter(
    g => clientesPorGerente[g.cpf] === menorNumeroClientes
  );
  const gerenteEscolhido = gerentesComMenosClientes[Math.floor(Math.random() * gerentesComMenosClientes.length)];

  cliente.estado = 'AGUARDANDO';
  cliente.gerenteCpf = gerenteEscolhido.cpf;
  this.base.add(cliente);
}


  aprovarCliente(cpf: string): void {
    const cliente = this.base.getById(cpf, 'cpf');
    if (!cliente) throw new Error('Cliente não encontrado');
    if (cliente.estado !== 'AGUARDANDO') throw new Error('Cliente não pode ser aprovado');

    const senha = (Math.floor(1000 + Math.random() * 9000)).toString();
    const numeroConta = this.gerarNumeroContaUnico();

    const conta: Conta = {
      numero: numeroConta,
      dataCriacao: new Date().toISOString(),
      saldo: 0,
      limite: cliente.salario > 2000 ? cliente.salario / 2 : 0,
      gerenteCpf: cliente.gerenteCpf!,
      historico: []
    };

    cliente.estado = 'APROVADO';
    cliente.senha = senha;
    cliente.dadosConta = conta;

    this.contasBase.add(conta);
    this.base.update(cliente.cpf, 'cpf', cliente);
  }

  recusarCliente(cpf: string, motivo: string): void {
    const cliente = this.base.getById(cpf, 'cpf');
    if (!cliente) throw new Error('Cliente não encontrado');
    cliente.estado = 'RECUSADO';
    cliente.motivoRecusa = motivo;
    this.base.update(cliente.cpf, 'cpf', cliente);
  }

  editarPerfil(cpf: string, novo: Partial<Cliente>): void {
    const cliente = this.base.getById(cpf, 'cpf');
    if (!cliente) throw new Error('Cliente não encontrado');

    if (novo.salario && novo.salario !== cliente.salario) {
      if (cliente.dadosConta) {
        cliente.dadosConta.limite = novo.salario > 2000 ? novo.salario / 2 : 0;
      }
    }

    Object.assign(cliente, novo, { cpf: cliente.cpf });
    this.base.update(cliente.cpf, 'cpf', cliente);
  }

  consultarClientesAguardando(gerenteCpf: string): Cliente[] {
    return this.listarClientes().filter(c => c.gerenteCpf === gerenteCpf && c.estado === 'AGUARDANDO');
  }

  consultarClientesDoGerente(gerenteCpf: string): Cliente[] {
    return this.listarClientes()
      .filter(c => c.gerenteCpf === gerenteCpf && c.estado === 'APROVADO')
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  consultarTodosClientes(): Cliente[] {
    const gerentes = this.gerentesBase.getAll().filter(g => g.tipo === 'GERENTE');
    return this.listarClientes()
      .filter(c => c.estado === 'APROVADO')
      .map(c => ({ ...c, gerente: gerentes.find(g => g.cpf === c.gerenteCpf) }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  consultarCliente(cpf: string): Cliente | undefined {
    return this.base.getById(cpf, 'cpf');
  }

  consultarTop3(gerenteCpf: string): Cliente[] {
    return this.listarClientes()
      .filter(c => c.gerenteCpf === gerenteCpf && c.estado === 'APROVADO')
      .sort((a, b) => (b.dadosConta?.saldo || 0) - (a.dadosConta?.saldo || 0))
      .slice(0, 3);
  }

  private gerarNumeroContaUnico(): string {
    const contas = this.contasBase.getAll();
    let numero: string;
    do {
      numero = (Math.floor(1000 + Math.random() * 9000)).toString();
    } while (contas.some(c => c.numero === numero));
    return numero;
  }
}
