import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalClientesService } from '../../../services';
import { Cliente } from '../../../services/local/models/cliente';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioManagerComponent {
  clientes: Cliente[] = [];
  clienteRecusando: Cliente | null = null;
  motivoRecusa: string = '';

  constructor(private clientesService: LocalClientesService) {}

  ngOnInit() {
    
    const session = JSON.parse(localStorage.getItem('dac_token') || '{}');
    const gerenteCpf = session.usuario?.cpf;
    if (gerenteCpf) {
      this.clientes = this.clientesService.consultarClientesAguardando(gerenteCpf);
    }

    console.log('Token:', localStorage.getItem('dac_token'));
    console.log('Gerente CPF:', session.usuario?.cpf);

  }

  aprovar(cliente: Cliente) {
    try {
      this.clientesService.aprovarCliente(cliente.cpf);
      this.clientes = this.clientes.filter(c => c.cpf !== cliente.cpf);
      alert(`Cliente ${cliente.nome} aprovado com sucesso.`);
    } catch (error: any) {
      alert(error.message);
    }
  }

  abrirModalRecusa(cliente: Cliente) {
    this.clienteRecusando = cliente;
    this.motivoRecusa = '';
  }

  confirmarRecusa() {
    if (!this.motivoRecusa.trim()) {
      alert('Informe o motivo da recusa.');
      return;
    }
    if (this.clienteRecusando) {
      try {
        this.clientesService.recusarCliente(this.clienteRecusando.cpf, this.motivoRecusa);
        this.clientes = this.clientes.filter(c => c.cpf !== this.clienteRecusando!.cpf);
        alert(`Cliente ${this.clienteRecusando.nome} recusado.`);
        this.clienteRecusando = null;
        this.motivoRecusa = '';
      } catch (error: any) {
        alert(error.message);
      }
    }
  }

  cancelarRecusa() {
    this.clienteRecusando = null;
    this.motivoRecusa = '';
  }
}