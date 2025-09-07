import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DadoGerente } from '../../../services';

@Component({
  selector: 'app-gerentes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gerentes.component.html',
  styleUrl: './gerentes.component.css'
})
export class GerentesComponent {
  gerentes: DadoGerente[] = [
    {
      cpf: '111.111.111-11',
      nome: 'Gerente',
      email:'gerente@gerente.com',
      telefone:'(11)11111-1111'
    },
    {
      cpf: '111.111.111-11',
      nome: 'Gerente',
      email:'gerente@gerente.com',
      telefone:'(11)11111-1111'
    },
    {
      cpf: '111.111.111-11',
      nome: 'Gerente',
      email:'gerente@gerente.com',
      telefone:'(11)11111-1111'
    },
    {
      cpf: '111.111.111-11',
      nome: 'Gerente',
      email:'gerente@gerente.com',
      telefone:'(11)11111-1111'
    },
    {
      cpf: '111.111.111-11',
      nome: 'Gerente',
      email:'gerente@gerente.com',
      telefone:'(11)11111-1111'
    }
  ]

}
