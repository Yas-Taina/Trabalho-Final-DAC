import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../../services';
import { DadosClienteResponse } from '../../../services';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-clientes-adm',
  standalone: true,
  imports: [CommonModule, NgxMaskPipe],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesAdmComponent implements OnInit {

  clientes: DadosClienteResponse[] = [];
  erroCarregamento = false;

  constructor(private clientesService: ClientesService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clientesService.getClientes('adm_relatorio_clientes').subscribe({
      next: (response) => {
        const clientesResponse = response as DadosClienteResponse[];

        if (Array.isArray(clientesResponse)) {
          this.clientes = clientesResponse.map(cliente => ({
            ...cliente,
            saldo: cliente.saldo ?? '0',
            gerente_cpf: (cliente as any).gerente_cpf ?? null,
            gerente_nome: (cliente as any).gerente_nome ?? '—'
          }));
        } else {
          console.error('Resposta inesperada do servidor:', response);
          this.erroCarregamento = true;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar clientes:', err);
        this.erroCarregamento = true;
      }
    });
  }

  getSaldoNumerico(saldo: string): number {
    return Number(saldo) || 0;
  }
}
