import { Component, OnInit } from '@angular/core';
import { LocalClientesService } from '../../../services';
import { Cliente } from '../../../services/local/models/cliente';
import { Gerente } from '../../../services/local/models/gerente';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ClienteExibicao {
  cpf: string;
  nome: string;
  email: string;
  salario: number;
  conta?: string;
  saldo?: number;
  limite?: number;
  gerenteCpf?: string;
  gerente_nome?: string;
}

@Component({
  selector: 'app-clientes-adm',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesAdmComponent implements OnInit {
  clientes: ClienteExibicao[] = [];

  constructor(private clientesService: LocalClientesService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    const todos: Cliente[] = this.clientesService.listarClientes();
    this.clientes = todos
      .filter(c => c.estado === 'APROVADO')
      .map(c => {
        const gerente: Gerente | undefined = (c as any).gerente; 
        return {
          cpf: c.cpf,
          nome: c.nome,
          email: c.email,
          salario: c.salario,
          conta: c.dadosConta?.numero,
          saldo: c.dadosConta?.saldo,
          limite: c.dadosConta?.limite,
          gerenteCpf: c.gerenteCpf,
          gerente_nome: gerente?.nome
        };
      });
  }
}
