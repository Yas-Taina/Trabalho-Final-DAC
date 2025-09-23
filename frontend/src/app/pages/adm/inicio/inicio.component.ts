import { Component, OnInit } from '@angular/core';
import { LocalGerentesService } from '../../../services';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface DashboardData {
  gerente: string;
  clientes: number;
  saldo_positivo: number;
  saldo_negativo: number;
}

@Component({
  selector: 'app-inicio-adm',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioAdmComponent implements OnInit {
  dashboards: DashboardData[] = [];

  constructor(private gerentesService: LocalGerentesService) {}

  ngOnInit(): void {
    const dadosGerentes = this.gerentesService.dashboard(); 
    this.dashboards = dadosGerentes.map(d => ({
      gerente: d.nome,
      clientes: d.total,
      saldo_positivo: d.saldoPositivo,
      saldo_negativo: d.saldoNegativo
    }));
  }
}

