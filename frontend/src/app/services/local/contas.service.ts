import { Injectable } from '@angular/core';
import { LocalBaseService } from '../local.base.service';
import { Conta } from './models/conta';
import { HistoricoMovimentacao } from './models/historico';
import { Cliente } from './models/cliente';

@Injectable({
  providedIn: 'root'
})
export class LocalContasService {
  private contasBase = new LocalBaseService<Conta>('contas');
  private clientesBase = new LocalBaseService<Cliente>('clientes');

  consultarSaldo(numeroConta: string): number {
    const conta = this.getConta(numeroConta);
    return conta?.saldo ?? 0;
  }

  depositar(numeroConta: string, valor: number): void {
    if (valor <= 0) throw new Error('Valor inválido para depósito');
    const conta = this.getConta(numeroConta);
    if (!conta) throw new Error('Conta não encontrada');

    conta.saldo += valor;
    this.adicionarMovimento(conta, {
      dataHora: new Date().toISOString(),
      tipo: 'DEPOSITO',
      clienteOrigemCpf: this.getClientePorConta(numeroConta)?.cpf,
      valor
    });
    this.contasBase.update(conta.numero, 'numero', conta);
  }

  sacar(numeroConta: string, valor: number): void {
    if (valor <= 0) throw new Error('Valor inválido');
    const conta = this.getConta(numeroConta);
    if (!conta) throw new Error('Conta não encontrada');
    if (valor > conta.saldo + conta.limite) throw new Error('Saldo insuficiente');

    conta.saldo -= valor;
    this.adicionarMovimento(conta, {
      dataHora: new Date().toISOString(),
      tipo: 'SAQUE',
      clienteOrigemCpf: this.getClientePorConta(numeroConta)?.cpf,
      valor
    });
    this.contasBase.update(conta.numero, 'numero', conta);
  }

  transferir(contaOrigemNum: string, contaDestinoNum: string, valor: number): void {
    if (valor <= 0) throw new Error('Valor inválido');
    const origem = this.getConta(contaOrigemNum);
    if (!origem) throw new Error('Conta de origem não encontrada');
    if (valor > origem.saldo + origem.limite) throw new Error('Saldo insuficiente');

    origem.saldo -= valor;

    const destino = this.getConta(contaDestinoNum);
    if (destino) {
      destino.saldo += valor;
      this.contasBase.update(destino.numero, 'numero', destino);
    }

    this.adicionarMovimento(origem, {
      dataHora: new Date().toISOString(),
      tipo: 'TRANSFERENCIA',
      clienteOrigemCpf: this.getClientePorConta(contaOrigemNum)?.cpf,
      clienteDestinoCpf: this.getClientePorConta(contaDestinoNum)?.cpf,
      valor
    });

    this.contasBase.update(origem.numero, 'numero', origem);
  }

  consultarExtrato(numeroConta: string, inicio?: string, fim?: string): any[] {
    const conta = this.getConta(numeroConta);
    if (!conta) throw new Error('Conta não encontrada');

    let historico = conta.historico || [];

    if (inicio) {
      historico = historico.filter(h => new Date(h.dataHora) >= new Date(inicio));
    }
    if (fim) {
      historico = historico.filter(h => new Date(h.dataHora) <= new Date(fim));
    }

    const agrupado: Record<string, HistoricoMovimentacao[]> = {};
    historico.forEach(h => {
      const dia = h.dataHora.split('T')[0];
      if (!agrupado[dia]) agrupado[dia] = [];
      agrupado[dia].push(h);
    });

    const resultado = Object.entries(agrupado).map(([dia, movimentos]) => {
      let saldoDia = 0;
      movimentos.forEach(m => {
        if (m.tipo === 'DEPOSITO') saldoDia += m.valor;
        if (m.tipo === 'SAQUE' || m.tipo === 'TRANSFERENCIA') saldoDia -= m.valor;
      });
      return { dia, movimentos, saldoConsolidado: saldoDia };
    });

    return resultado;
  }

  private getConta(numero: string): Conta | undefined {
    return this.contasBase.getById(numero, 'numero');
  }

  private getClientePorConta(numero: string): Cliente | undefined {
    return this.clientesBase.getAll().find(c => c.dadosConta?.numero === numero);
  }

  private adicionarMovimento(conta: Conta, movimento: HistoricoMovimentacao): void {
    if (!conta.historico) conta.historico = [];
    conta.historico.push(movimento);
  }
}
