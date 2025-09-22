import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DadosClienteResponse, LocalClientesService } from '../../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-melhores-clientes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './melhores-clientes.component.html',
  styleUrl: './melhores-clientes.component.css'
})
export class MelhoresClientesComponent {

  clienteService = inject(LocalClientesService);

  clientes: DadosClienteResponse[] = [];

  ngOnInit() {
    this.clienteService.getClientes("melhores_clientes").subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (err) => {
        alert('Erro ao carregar melhores clientes: ' + (err.error?.message || err.message || 'Unknown error'));
      }
    });
  }
}
