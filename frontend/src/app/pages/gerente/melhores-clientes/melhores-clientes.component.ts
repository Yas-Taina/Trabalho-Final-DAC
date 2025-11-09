import { Component, OnInit } from '@angular/core';
import { ClientesService, ClienteResponse } from '../../../services';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-melhores-clientes',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskPipe],
  templateUrl: './melhores-clientes.component.html',
  styleUrls: ['./melhores-clientes.component.css']
})
export class MelhoresClientesComponent implements OnInit {
  clientes: ClienteResponse[] = [];

  constructor(
    private clientesService: ClientesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarMelhoresClientes();
  }

  carregarMelhoresClientes(): void {
    const session = this.authService.getSession();
    if (!session || session.tipo !== 'GERENTE') return;

    this.clientesService.getClientes('melhores_clientes').subscribe({
      next: (clientes) => {
        this.clientes = clientes as ClienteResponse[];
      },
      error: (err) => {
        console.error('Erro ao carregar melhores clientes:', err);
      }
    });
  }
}
