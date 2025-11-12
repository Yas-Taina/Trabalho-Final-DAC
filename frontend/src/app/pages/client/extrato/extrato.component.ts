import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";

import { AuthService } from "../../../services/auth.service";
import { ClientesService } from "../../../services/clientes.service";
import {
  ContasService,
  ExtratoResponse,
  ItemExtratoResponse,
  DadosClienteResponse,
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
  numeroConta = "";

  constructor(
    private readonly authService: AuthService,
    private readonly clientesService: ClientesService,
    private readonly contasService: ContasService,
  ) {}

  ngOnInit(): void {
    this.inicializarUsuario();
  }

  private inicializarUsuario(): void {
    const cpf = this.authService.getUserCpf();
    if (!cpf) {
      alert("Usuário não logado.");
      return;
    }
    this.cpfLogado = cpf;
    this.clientesService.getCliente(cpf).subscribe({
      next: (cliente: DadosClienteResponse) => {
        if (!cliente.conta) {
          alert("Conta não encontrada para o usuário.");
          return;
        }
        this.numeroConta = cliente.conta;
        this.carregarExtrato();
      },
      error: (err) => alert("Erro ao obter dados do cliente: " + err.message),
    });
  }

  toggleFiltro(): void {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  aplicarFiltro(): void {
    this.carregarExtrato(this.dataInicio, this.dataFim);
  }

  private carregarExtrato(inicio?: string, fim?: string): void {
    if (!this.numeroConta) return;

    this.contasService.extrato(this.numeroConta).subscribe({
      next: (extrato: ExtratoResponse) => {
        let movimentos = extrato.movimentacoes;
        if (inicio) {
          const dtInicio = new Date(inicio);
          movimentos = movimentos.filter((m) => new Date(m.data) >= dtInicio);
        }
        if (fim) {
          const dtFim = new Date(fim);
          movimentos = movimentos.filter((m) => new Date(m.data) <= dtFim);
        }

        this.extratosPorDia = this.formatarExtratoPorDia(
          movimentos,
          extrato.saldo,
        );
      },
      error: (err) => alert("Erro ao carregar extrato: " + err.message),
    });
  }

  private formatarExtratoPorDia(
    movimentos: ItemExtratoResponse[],
    saldoConsolidado: number,
  ): Record<string, ExtratoDia> {
    const grouped: Record<string, ExtratoDia> = {};

    movimentos.forEach((m) => {
      const dia = new Date(m.data).toLocaleDateString();
      if (!grouped[dia]) {
        grouped[dia] = { movimentos: [], saldoConsolidado };
      }
      grouped[dia].movimentos.push({
        data: new Date(m.data).toLocaleTimeString(),
        tipo: m.tipo.toLowerCase(),
        origem: m.origem || "-",
        destino: m.destino || "-",
        valor: m.valor,
      });
    });

    return grouped;
  }
}
