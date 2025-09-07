import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DadosClienteResponse } from '../../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})
export class ConsultaComponent {
  cliente: DadosClienteResponse = 
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
      salario: 5000.00,
      conta: '2222',
      saldo: '9999.99',
      limite: 2500.00,
      gerente: '01',
      gerente_nome: 'José',
      gerente_email: 'jose@gmail.com'
    }

}
