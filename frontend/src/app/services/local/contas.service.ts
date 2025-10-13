import { Injectable } from "@angular/core";
import { LocalBaseService } from "../local.base.service";
import { Conta } from "./models/conta";
import { HistoricoMovimentacao } from "./models/historico";
import { Cliente } from "./models/cliente";

@Injectable({
  providedIn: "root",
})
export class LocalContasService {
  private contasBase = new LocalBaseService<Conta>("contas");
  private clientesBase = new LocalBaseService<Cliente>("clientes");

  consultarSaldo(numeroConta: string): number {
    const conta = this.getConta(numeroConta);
    return conta?.saldo ?? 0;
  }

  depositar(numeroConta: string, valor: number): void {
    if (valor <= 0) throw new Error("Valor inválido para depósito");
    const conta = this.getConta(numeroConta);
    const cliente = this.getClientePorConta(numeroConta);

    if (!conta) throw new Error("Conta não encontrada");
    if (!cliente) throw new Error("Cliente não encontrado");

    conta.saldo += valor;
    cliente.dadosConta = conta;

    this.adicionarMovimento(conta, {
      dataHora: new Date().toISOString(),
      tipo: "DEPOSITO",
      clienteOrigemCpf: this.getClientePorConta(numeroConta)?.cpf,
      valor,
    });

    this.contasBase.update(conta.numero, "numero", conta);
    this.clientesBase.update(cliente.cpf, "cpf", cliente);
  }

  sacar(numeroConta: string, valor: number): void {
    if (valor <= 0) throw new Error("Valor inválido");
    const conta = this.getConta(numeroConta);
    const cliente = this.getClientePorConta(numeroConta);

    if (!conta) throw new Error("Conta não encontrada");
    if (!cliente) throw new Error("Cliente não encontrado");

    if (valor > conta.saldo + conta.limite)
      throw new Error("Saldo insuficiente");

    conta.saldo -= valor;
    cliente.dadosConta = conta;

    this.adicionarMovimento(conta, {
      dataHora: new Date().toISOString(),
      tipo: "SAQUE",
      clienteOrigemCpf: this.getClientePorConta(numeroConta)?.cpf,
      valor,
    });

    this.contasBase.update(conta.numero, "numero", conta);
    this.clientesBase.update(cliente.cpf, "cpf", cliente);
  }

  transferir(
    contaOrigemNum: string,
    contaDestinoNum: string,
    valor: number,
  ): void {
    if (valor <= 0) throw new Error("Valor inválido");
    const origem = this.getConta(contaOrigemNum);
    const destino = this.getConta(contaDestinoNum);
    const clienteOrigem = this.getClientePorConta(contaOrigemNum);
    const clienteDestino = this.getClientePorConta(contaDestinoNum);

    if (!origem) throw new Error("Conta de origem não encontrada");
    if (!destino) throw new Error("Conta de destino não encontrada");
    if (!clienteOrigem) throw new Error("Cliente de origem não encontrado");
    if (!clienteDestino) throw new Error("Cliente de destino não encontrado");

    if (valor > origem.saldo + origem.limite)
      throw new Error("Saldo insuficiente");
    if (contaOrigemNum === contaDestinoNum)
      throw new Error("Não é possível transferir para a mesma conta");

    origem.saldo -= valor;
    destino.saldo += valor;

    clienteOrigem.dadosConta = origem;
    clienteDestino.dadosConta = destino;

    this.adicionarMovimento(origem, {
      dataHora: new Date().toISOString(),
      tipo: "TRANSFERENCIA",
      clienteOrigemCpf: clienteOrigem?.cpf,
      clienteDestinoCpf: clienteDestino?.cpf,
      valor,
    });

    this.adicionarMovimento(destino!, {
      dataHora: new Date().toISOString(),
      tipo: "TRANSFERENCIA",
      clienteOrigemCpf: clienteOrigem?.cpf,
      clienteDestinoCpf: clienteDestino?.cpf,
      valor,
    });

    this.contasBase.update(origem.numero, "numero", origem);
    this.contasBase.update(destino!.numero, "numero", destino!);

    this.clientesBase.update(clienteOrigem.cpf, "cpf", clienteOrigem);
    this.clientesBase.update(clienteDestino.cpf, "cpf", clienteDestino);
  }

  consultarExtrato(
    numeroConta: string,
    clienteCpf: string,
    inicio?: string,
    fim?: string,
  ): any[] {
    const conta = this.getConta(numeroConta);
    if (!conta) throw new Error("Conta não encontrada");

    let historico = conta.historico || [];

    if (inicio) {
      const dataInicio = new Date(inicio + "T00:00:00");
      historico = historico.filter((h) => new Date(h.dataHora) >= dataInicio);
    }
    if (fim) {
      const dataFim = new Date(fim + "T23:59:59");
      historico = historico.filter((h) => new Date(h.dataHora) <= dataFim);
    }

    const agrupado: Record<string, HistoricoMovimentacao[]> = {};
    historico.forEach((h) => {
      const dia = new Date(h.dataHora).toLocaleDateString();
      if (!agrupado[dia]) agrupado[dia] = [];
      agrupado[dia].push(h);
    });

    const resultado = Object.entries(agrupado).map(([dia, movimentos]) => {
      let saldoDia = 0;
      movimentos.forEach((m) => {
        if (m.tipo === "DEPOSITO") saldoDia += m.valor;
        if (m.tipo === "SAQUE") saldoDia -= m.valor;
        if (m.tipo === "TRANSFERENCIA") {
          if (m.clienteDestinoCpf === clienteCpf) saldoDia += m.valor;
          else if (m.clienteOrigemCpf === clienteCpf) saldoDia -= m.valor;
        }
      });
      return { dia, movimentos, saldoConsolidado: saldoDia };
    });

    return resultado;
  }

  private getConta(numero: string): Conta | undefined {
    const contas = this.contasBase.getAll();
    console.log("contas", contas);
    const conta = contas.find((c) => c.numero == numero);

    console.log("conta", conta, numero);
    return conta;
  }

  private getClientePorConta(numero: string): Cliente | undefined {
    return this.clientesBase
      .getAll()
      .find((c) => c.dadosConta?.numero == numero);
  }

  private adicionarMovimento(
    conta: Conta,
    movimento: HistoricoMovimentacao,
  ): void {
    if (!conta.historico) conta.historico = [];
    conta.historico.push(movimento);
  }
}
