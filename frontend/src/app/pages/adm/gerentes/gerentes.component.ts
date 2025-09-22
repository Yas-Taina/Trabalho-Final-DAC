import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DadoGerente } from '../../../services/model';
import { LocalGerentesService } from '../../../services';

@Component({
  selector: 'app-gerentes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gerentes.component.html',
  styleUrl: './gerentes.component.css'
})
export class GerentesComponent implements OnInit {
  gerentes: DadoGerente[] = [];

  constructor(private gerentesService: LocalGerentesService) {}

  ngOnInit(): void {
    this.carregarGerentes();
  }

  carregarGerentes(): void {
    this.gerentesService.getGerentes().subscribe({
      next: (data) => {
        this.gerentes = data;
      },
      error: (err) => {
        console.error('Erro ao carregar gerentes', err);
      }
    });
  }

  removerGerente(cpf: string): void {
    this.gerentesService.removerGerente(cpf).subscribe({
      next: () => {
        this.carregarGerentes();
      },
      error: (err) => {
        console.error('Erro ao remover gerente', err);
      }
    });
  }
}
