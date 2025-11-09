import { Component, OnInit } from '@angular/core';
import { GerentesService } from '../../../services/gerentes.service';
import { DadoGerente } from '../../../services/models';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gerentes',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskPipe, FormsModule],
  templateUrl: './gerentes.component.html',
  styleUrls: ['./gerentes.component.css'],
})
export class GerentesComponent implements OnInit {
  gerentes: DadoGerente[] = [];
  gerentesFiltrados: DadoGerente[] = [];
  termoBusca: string = '';

  constructor(private gerentesService: GerentesService) {}

  ngOnInit(): void {
    this.carregarGerentes();
  }

  private isArrayDeGerentes(dados: any): dados is DadoGerente[] {
    return Array.isArray(dados) && dados.every(g => 'cpf' in g && 'nome' in g && 'email' in g);
  }

  carregarGerentes(): void {
    this.gerentesService.getGerentes().subscribe({
      next: (dados) => {
        if (this.isArrayDeGerentes(dados)) {
          this.gerentes = dados;
        } else {
          console.warn('Resposta é DashboardResponse:', dados);
          this.gerentes = [];
        }
        this.aplicarFiltro();
      },
      error: (err) => {
        console.error('Erro ao carregar gerentes:', err);
        let msg = 'Erro ao carregar gerentes.';
        if (err.status === 401) msg = 'Usuário não está logado.';
        else if (err.status === 403) msg = 'Você não tem permissão para listar gerentes.';
        alert(msg);
      },
    });
  }

  aplicarFiltro(): void {
    const termo = this.termoBusca.toLowerCase().trim();
    if (!termo) {
      this.gerentesFiltrados = this.gerentes;
      return;
    }

    this.gerentesFiltrados = this.gerentes.filter((g) => {
      const nome = g.nome?.toLowerCase().includes(termo);
      const cpf = g.cpf?.replace(/\D/g, '').includes(termo.replace(/\D/g, ''));
      const email = g.email?.toLowerCase().includes(termo);
      return nome || cpf || email;
    });
  }

  removerGerente(cpf: string): void {
    if (confirm('Tem certeza que deseja remover este gerente?')) {
      this.gerentesService.removerGerente(cpf).subscribe({
        next: () => {
          alert('Gerente removido com sucesso!');
          this.carregarGerentes();
        },
        error: (err) => {
          console.error('Erro ao remover gerente:', err);
          let msg = 'Erro ao remover gerente.';
          if (err.status === 404) msg = 'Gerente não encontrado.';
          else if (err.status === 403) msg = 'Você não tem permissão para remover gerentes.';
          else if (err.status === 401) msg = 'Usuário não está logado.';
          alert(msg);
        },
      });
    }
  }
}
