import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemExtratoResponse, LocalContasService, LocalLoginService, ClienteResponse } from '../../../services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.css']
})
export class ExtratoComponent implements OnInit {
  readonly contaService: LocalContasService = inject(LocalContasService);
  readonly loginService: LocalLoginService = inject(LocalLoginService);

  mostrarFiltro = false;
  dataInicio?: string;
  dataFim?: string;

  extratos: ItemExtratoResponse[] = [];
  extratosPorDia: { [data: string]: ItemExtratoResponse[] } = {};

  ngOnInit() {
    const session = this.loginService.sessionInfo();
    if (session?.tipo === 'CLIENTE') {
      const cliente = session.usuario as ClienteResponse;
      this.contaService.getExtrato(cliente.conta!).subscribe({
        next: (resp) => {
          this.extratos = resp.movimentacoes ?? [];
          this.agruparPorDia();
        },
        error: (err) => alert('Erro ao carregar extrato: ' + err.message)
      });
    }
  }

  toggleFiltro() {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  aplicarFiltro() {
    let filtrados = this.extratos;
    if (this.dataInicio) {
      const inicio = new Date(this.dataInicio);
      filtrados = filtrados.filter(m => new Date(m.data) >= inicio);
    }
    if (this.dataFim) {
      const fim = new Date(this.dataFim);
      filtrados = filtrados.filter(m => new Date(m.data) <= fim);
    }
    this.extratosPorDia = this.agrupar(filtrados);
  }

  private agruparPorDia() {
    this.extratosPorDia = this.agrupar(this.extratos);
  }

  private agrupar(movs: ItemExtratoResponse[]) {
    return movs.reduce((acc, curr) => {
      const dia = new Date(curr.data).toLocaleDateString('pt-BR');
      if (!acc[dia]) acc[dia] = [];
      acc[dia].push(curr);
      return acc;
    }, {} as { [data: string]: ItemExtratoResponse[] });
  }
}
