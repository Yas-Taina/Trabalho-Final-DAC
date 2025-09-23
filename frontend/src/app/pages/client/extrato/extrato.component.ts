import { Component, OnInit, inject } from '@angular/core';
import { LocalContasService } from '../../../services';
import { LocalLoginService } from '../../../services';
import { ClienteResponse, DadoGerente } from '../../../services';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

interface ExtratoLinha {
  data: string;
  tipo: string;
  origem: string;
  destino: string;
  valor: number;
}

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.css']
})
export class ExtratoComponent implements OnInit {
  mostrarFiltro = false;
  dataInicio: string = '';
  dataFim: string = '';
  extratosPorDia: Record<string, ExtratoLinha[]> = {};

  constructor(
    private contasService: LocalContasService,
    private loginService: LocalLoginService
  ) {}

  ngOnInit(): void {
    this.carregarExtrato();
  }

  private isCliente(usuario: ClienteResponse | DadoGerente): usuario is ClienteResponse {
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
      alert('Sessão inválida ou usuário não é cliente');
      return;
    }

    const numeroConta = session.usuario.conta;
    if (!numeroConta) {
      alert('Número da conta não disponível');
      return;
    }

    try {
      const resultado = this.contasService.consultarExtrato(numeroConta, inicio, fim);
      const porDia: Record<string, ExtratoLinha[]> = {};
      resultado.forEach(dia => {
        porDia[dia.dia] = dia.movimentos.map((m: any) => ({
          data: new Date(m.dataHora).toLocaleTimeString(),
          tipo: m.tipo.toLowerCase(),
          origem: m.clienteOrigemCpf || '-',
          destino: m.clienteDestinoCpf || '-',
          valor: m.valor
        }));
      });
      this.extratosPorDia = porDia;
    } catch (error: any) {
      alert(error.message || 'Erro ao consultar extrato');
    }
  }
}
