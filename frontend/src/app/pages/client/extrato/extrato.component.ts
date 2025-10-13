import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import {
  LocalContasService,
  LocalLoginService,
  ClienteResponse,
  DadoGerente,
} from "../../../services";

interface ExtratoLinha {
  data: string;
  tipo: string;
  origem: string;
  destino: string;
  valor: number;
}

interface ExtratoDia {
  movimentos: ExtratoLinha[];
  saldoConsolidado: number;
}

@Component({
  selector: "app-extrato",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: "./extrato.component.html",
  styleUrls: ["./extrato.component.css"],
})
export class ExtratoComponent implements OnInit {
  mostrarFiltro = false;
  dataInicio = "";
  dataFim = "";
  extratosPorDia: Record<string, ExtratoDia> = {};
  cpfLogado = "";

  constructor(
    private readonly contasService: LocalContasService,
    private readonly loginService: LocalLoginService,
  ) {}

  ngOnInit(): void {
    this.inicializarCpfLogado();
    this.carregarExtrato();
  }

  private inicializarCpfLogado(): void {
    const session = this.loginService.sessionInfo();
    if (session && this.isCliente(session.usuario)) {
      this.cpfLogado = session.usuario.cpf ?? "0";
    }
  }

  private isCliente(
    usuario: ClienteResponse | DadoGerente,
  ): usuario is ClienteResponse {
    return (usuario as ClienteResponse).conta !== undefined;
  }

  toggleFiltro(): void {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  aplicarFiltro(): void {
    this.carregarExtrato(this.dataInicio, this.dataFim);
  }

  private carregarExtrato(inicio?: string, fim?: string): void {
    const session = this.loginService.sessionInfo();
    if (!session || !this.isCliente(session.usuario)) {
      alert("Sessão inválida ou usuário não é cliente");
      return;
    }

    const numeroConta = session.usuario.conta;
    if (!numeroConta) {
      alert("Número da conta não disponível");
      return;
    }

    try {
      const resultado = this.contasService.consultarExtrato(
        numeroConta,
        this.cpfLogado,
        inicio,
        fim,
      );
      this.extratosPorDia = this.formatarExtratoPorDia(resultado);
    } catch (e: any) {
      alert(e.message || "Erro ao consultar extrato");
    }
  }

  private formatarExtratoPorDia(dados: any[]): Record<string, ExtratoDia> {
    return dados.reduce(
      (acc, dia) => {
        acc[dia.dia] = {
          movimentos: dia.movimentos.map((m: any) => ({
            data: new Date(m.dataHora).toLocaleTimeString(),
            tipo: m.tipo.toLowerCase(),
            origem: m.clienteOrigemCpf || "-",
            destino: m.clienteDestinoCpf || "-",
            valor: m.valor,
          })),
          saldoConsolidado: dia.saldoConsolidado,
        };
        return acc;
      },
      {} as Record<string, ExtratoDia>,
    );
  }
}
