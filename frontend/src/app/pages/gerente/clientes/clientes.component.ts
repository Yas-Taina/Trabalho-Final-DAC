import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DadosClienteResponse } from '../../../services';

@Component({
  selector: 'app-clientesmanager',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesManagerComponent {

  clientes: DadosClienteResponse[] = [
    {
      cpf: '111.111.111.11',
      nome: 'Maria Terezinha',
      email: 'mariazinha@gmail.com',
      endereco: {
        tipo: 'Avenida',
        logradouro: 'Rua das Flores',
        numero: '56',
        complemento: 'ap09',
        cep: '88888-888',
        cidade: 'Curitiba',
        estado: 'PR'
      },
      conta: '2222',
      saldo: '9999.99',
      limite: 2500.00,
      gerente: '01',
      gerente_nome: 'José',
      gerente_email: 'jose@gmail.com'
    },
    {
      cpf: '222.222.222.22',
      nome: 'João maria',
      email: 'joaozinho@gmail.com',
      endereco: {
        tipo: 'Avenida',
        logradouro: 'Rua das Flores',
        numero: '56',
        complemento: 'ap09',
        cep: '88888-888',
        cidade: 'Curitiba',
        estado: 'PR'
      },
      conta: '3333',
      saldo: '9999.99',
      limite: 2500.00,
      gerente: '01',
      gerente_nome: 'José',
      gerente_email: 'jose@gmail.com'
    },
    {
      cpf: '333.333.333.33',
      nome: 'Ricardão',
      email: 'ricardao@gmail.com',
      endereco: {
        tipo: 'Avenida',
        logradouro: 'Rua das Flores',
        numero: '56',
        complemento: 'ap09',
        cep: '88888-888',
        cidade: 'Curitiba',
        estado: 'PR'
      },
      conta: '5555',
      saldo: '9999.99',
      limite: 2500.00,
      gerente: '01',
      gerente_nome: 'José',
      gerente_email: 'jose@gmail.com'
    }
  ]

}
