import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemDashboardResponse } from '../../../services';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioAdmComponent {
  dashboards: ItemDashboardResponse[] = [
    {
      gerente:'Gerente',
      clientes: 0,
      saldo_positivo: 0,
      saldo_negativo: 0,
    },
    {
      gerente:'Gerente',
      clientes: 0,
      saldo_positivo: 0,
      saldo_negativo: 0,
    },
    {
      gerente:'Gerente',
      clientes: 0,
      saldo_positivo: 0,
      saldo_negativo: 0,
    },
    {
      gerente:'Gerente',
      clientes: 0,
      saldo_positivo: 0,
      saldo_negativo: 0,
    },
    {
      gerente:'Gerente',
      clientes: 0,
      saldo_positivo: 0,
      saldo_negativo: 0,
    },
    {
      gerente:'Gerente',
      clientes: 0,
      saldo_positivo: 0,
      saldo_negativo: 0,
    },
  ]

}
