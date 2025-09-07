import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemExtratoResponse } from '../../../services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './extrato.component.html',
  styleUrls: ['./extrato.component.css']
})
export class ExtratoComponent implements OnInit {
  mostrarFiltro = false;

  dataInicio?: string;
  dataFim?: string;

  extratos: ItemExtratoResponse[] = [
    { data: '13/02/2001, 23:59h', tipo: 'depósito', valor: 1500.00 },
    { data: '13/02/2001, 23:59h', tipo: 'saque', valor: 1500.00 },
    { data: '13/02/2001, 23:59h', tipo: 'depósito', valor: 2000.00 },
    { data: '13/02/2001, 23:59h', tipo: 'transferência', origem: '1111', destino: '2222', valor: 1500.00 },
    { data: '13/02/2001, 23:59h', tipo: 'depósito', valor: 2500.00 },
    { data: '14/02/2001, 23:59h', tipo: 'depósito', valor: 1500.00 },
    { data: '14/02/2001, 23:59h', tipo: 'saque', valor: 1500.00 },
    { data: '15/02/2001, 23:59h', tipo: 'depósito', valor: 2000.00 },
    { data: '15/02/2001, 23:59h', tipo: 'transferência', origem: '1111', destino: '2222', valor: 1500.00 },
    { data: '15/02/2001, 23:59h', tipo: 'depósito', valor: 2500.00 },
  ];

  extratosPorDia: { [data: string]: ItemExtratoResponse[] } = {};

  ngOnInit() {
    this.agruparPorDia();
  }

  toggleFiltro() {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  aplicarFiltro() {
    console.log('Data início:', this.dataInicio);
    console.log('Data fim:', this.dataFim);
  }

  agruparPorDia() {
    this.extratosPorDia = this.extratos.reduce((acc, curr) => {
      const dia = curr.data.split(',')[0].trim();
      if (!acc[dia]) acc[dia] = [];
      acc[dia].push(curr);
      return acc;
    }, {} as { [data: string]: ItemExtratoResponse[] });
  }
}
