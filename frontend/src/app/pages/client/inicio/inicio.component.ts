import { Component, OnInit } from '@angular/core';
import { LocalContasService } from '../../../services';
import { LocalLoginService } from '../../../services';
import { ClienteResponse, DadoGerente } from '../../../services';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioClientComponent implements OnInit {
    conta: { saldo: number } | null = null;

  constructor(
    private contasService: LocalContasService,
    private loginService: LocalLoginService
  ) {}

  ngOnInit(): void {
    this.carregarSaldo();
  }

  private isCliente(usuario: ClienteResponse | DadoGerente): usuario is ClienteResponse {
    return (usuario as ClienteResponse).conta !== undefined;
  }

  private carregarSaldo(): void {
    const session = this.loginService.sessionInfo();
    if (!session || !this.isCliente(session.usuario)) {
      alert('Sessão inválida ou usuário não é cliente');
      return;
    }

    const numeroConta = session.usuario.conta;
    if (!numeroConta) {
      alert('Número da conta não disponível');
      return;
    }

    try {
      const saldo = this.contasService.consultarSaldo(numeroConta);
      this.conta = { saldo };
    } catch (error: any) {
      alert(error.message || 'Erro ao consultar saldo');
    }
  }
}