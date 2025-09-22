import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemDashboardResponse } from '../../../services/model';
import { LocalGerentesService } from '../../../services';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioAdmComponent implements OnInit {
  dashboards: ItemDashboardResponse[] = [];

  constructor(private gerentesService: LocalGerentesService) {}

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.gerentesService.getGerentes('dashboard').subscribe({
      next: (data) => {
        this.dashboards = data.map((d: any) => ({
          gerente: d.gerente?.nome ?? '---',
          clientes: d.clientes?.length ?? 0,
          saldo_positivo: d.saldo_positivo,
          saldo_negativo: d.saldo_negativo,
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard', err);
      }
    });
  }
}
