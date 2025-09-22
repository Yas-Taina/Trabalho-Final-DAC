import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DadosClienteResponse } from '../../../services/model';
import { LocalClientesService } from '../../../services';
@Component({
  selector: 'app-clientesadm',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesAdmComponent implements OnInit {
  clientes: DadosClienteResponse[] = [];

  constructor(private clientesService: LocalClientesService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => {
        console.error('Erro ao carregar clientes', err);
      }
    });
  }
}
