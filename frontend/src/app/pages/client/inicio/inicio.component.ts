import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContaResponse, DadosClienteResponse } from '../../../services';
import { LocalClientesService } from '../../../services';
import { from } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioClientComponent implements OnInit {
  conta?: ContaResponse;
  cliente?: DadosClienteResponse;

  constructor(
    private router: Router,
    private clientesService: LocalClientesService
  ) {}

  ngOnInit(): void {
    const cpfLogado = sessionStorage.getItem('cpf_logado'); 
    if (cpfLogado) {
      this.clientesService.getCliente(cpfLogado).subscribe({
        next: (cliente) => {
          this.cliente = cliente;
          this.conta = cliente.conta as unknown as ContaResponse; 
        },
        error: (err) => {
          console.error('Erro ao buscar cliente', err);
        }
      });
    }
  }
}
