import { Injectable } from "@angular/core";
import { LocalBaseService } from "../local.base.service";
import { Gerente } from "./models/gerente";
import { Conta } from "./models/conta";
import { Cliente } from "./models/cliente";

@Injectable({
  providedIn: "root",
})
export class LocalGerentesService {
  private gerentesBase = new LocalBaseService<Gerente>("gerentes");
  private contasBase = new LocalBaseService<Conta>("contas");
  private clientesBase = new LocalBaseService<Cliente>("clientes");

  inserirUsuario(gerente: Gerente): void {
    const gerentes = this.gerentesBase.getAll();
    if (gerentes.some((g) => g.cpf === gerente.cpf))
      throw new Error("Gerente já cadastrado");

    this.gerentesBase.add(gerente);

    this.redistribuirContas(gerente);
  }

  private redistribuirContas(gerenteDestino: Gerente): void {
    const contas = this.contasBase.getAll();
    const gerentes = this.dashboard()
      .filter((g) => g.cpf !== gerenteDestino.cpf)
      .sort((a, b) => b.total - a.total);

    const contasPorGerente = gerentes.map((g) => {
      return {
        cpf: g.cpf,
        contas: contas.filter((c) => c.gerenteCpf === g.cpf),
        saldoPositivo: g.saldoPositivo,
      };
    });

    if (contas.length < 2) {
      return;
    }

    let contaParaRedistribuir = contasPorGerente[0].contas[0];

    const gerentesComMaisContas = contasPorGerente.filter(
      (c) => c.contas.length === contasPorGerente[0].contas.length,
    );
    console.log(gerentesComMaisContas);

    if (gerentesComMaisContas.length > 1) {
      contaParaRedistribuir = gerentesComMaisContas
        .sort((a, b) => a.saldoPositivo - b.saldoPositivo)[0]
        .contas.pop()!;
    }

    const cliente = this.clientesBase
      .getAll()
      .find((x) => x.dadosConta?.numero === contaParaRedistribuir?.numero);

    contaParaRedistribuir!.gerenteCpf = gerenteDestino.cpf;
    cliente!.gerenteCpf = gerenteDestino.cpf;
    cliente!.dadosConta = contaParaRedistribuir;

    this.contasBase.update(
      contaParaRedistribuir!.numero,
      "numero",
      contaParaRedistribuir!,
    );
    this.clientesBase.update(cliente!.cpf, "cpf", cliente!);
  }

  listarGerentes(): Gerente[] {
    return this.gerentesBase
      .getAll()
      .filter((g) => g.tipo === "GERENTE")
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  listarTodosGerentes(): Gerente[] {
    return this.gerentesBase
      .getAll()
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  editarGerente(cpf: string, novo: Partial<Gerente>): void {
    const gerente = this.gerentesBase.getById(cpf, "cpf");
    if (!gerente) throw new Error("Gerente não encontrado");
    Object.assign(gerente, novo, { cpf: gerente.cpf });
    this.gerentesBase.update(cpf, "cpf", gerente);
  }

  removerGerente(cpf: string): void {
    this.redistribuirContasRemoverGerente(cpf);

    this.gerentesBase.delete(cpf, "cpf");
  }

  private redistribuirContasRemoverGerente(gerenteAntigoCpf: string) {
    const contas = this.contasBase.getAll();
    const gerentes = this.dashboard()
      .filter((g) => g.cpf !== gerenteAntigoCpf)
      .sort((a, b) => a.total - b.total);

    const contasPorGerente = gerentes.map((g) => {
      return {
        cpf: g.cpf,
        contas: contas.filter((c) => c.gerenteCpf === g.cpf),
        saldoPositivo: g.saldoPositivo,
      };
    });

    const contasParaRedistribuir = contas.filter(
      (x) => x.gerenteCpf === gerenteAntigoCpf,
    );

    const gerenteComMenosContas = contasPorGerente
      .filter((c) => c.contas.length === contasPorGerente[0].contas.length)
      .pop();

    const clientesPraRedistribuir = this.clientesBase
      .getAll()
      .filter((x) => x.gerenteCpf === gerenteAntigoCpf);

    contasParaRedistribuir.forEach((conta) => {
      conta.gerenteCpf = gerenteComMenosContas?.cpf!;
    });

    clientesPraRedistribuir.forEach((cliente) => {
      cliente.gerenteCpf = gerenteComMenosContas?.cpf!;
      cliente.dadosConta!.gerenteCpf = gerenteComMenosContas?.cpf!;
    });

    for (const conta of contasParaRedistribuir) {
      this.contasBase.update(conta!.numero, "numero", conta!);
    }

    for (const cliente of clientesPraRedistribuir) {
      this.clientesBase.update(cliente!.cpf, "cpf", cliente!);
    }
  }

  dashboard(): {
    cpf: string;
    nome: string;
    total: number;
    saldoPositivo: number;
    saldoNegativo: number;
  }[] {
    const gerentes = this.gerentesBase
      .getAll()
      .filter((g) => g.tipo === "GERENTE");
    const contas = this.contasBase.getAll();

    return gerentes.map((g) => {
      const contasGerente = contas.filter((c) => c.gerenteCpf === g.cpf);
      const total = contasGerente.length;
      const saldoPositivo = contasGerente.filter((c) => c.saldo > 0).length;
      const saldoNegativo = contasGerente.filter((c) => c.saldo <= 0).length;

      return { cpf: g.cpf, nome: g.nome, total, saldoPositivo, saldoNegativo };
    });
  }

  private getGerenteMenosContas(excluirCpf: string): Gerente {
    const gerentes = this.gerentesBase
      .getAll()
      .filter((g) => g.cpf !== excluirCpf && g.tipo === "GERENTE");
    const contas = this.contasBase.getAll();

    const contasPorGerente: Record<string, number> = {};
    gerentes.forEach((g) => {
      contasPorGerente[g.cpf] = contas.filter(
        (c) => c.gerenteCpf === g.cpf,
      ).length;
    });

    const menor = Math.min(...Object.values(contasPorGerente));
    return gerentes.find((g) => contasPorGerente[g.cpf] === menor)!;
  }
}
