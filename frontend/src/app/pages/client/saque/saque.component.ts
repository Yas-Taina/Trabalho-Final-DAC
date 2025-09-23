import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalContasService } from '../../../services';
import { LocalLoginService } from '../../../services';
import { ClienteResponse, DadoGerente } from '../../../services';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saque',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './saque.component.html',
  styleUrls: ['./saque.component.css']
})
export class SaqueComponent implements OnInit {
  saqueForm: FormGroup;
  numeroConta: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contasService: LocalContasService,
    private loginService: LocalLoginService
  ) {
    this.saqueForm = this.fb.group({
      valor: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.carregarConta();
  }

  private isCliente(usuario: ClienteResponse | DadoGerente): usuario is ClienteResponse {
    return (usuario as ClienteResponse).conta !== undefined;
  }

  private carregarConta(): void {
    const session = this.loginService.sessionInfo();
    if (!session || !this.isCliente(session.usuario)) {
      alert('Sessão inválida ou usuário não é cliente');
      return;
    }

    if (!session.usuario.conta) {
      alert('Número da conta não disponível');
      return;
    }

    this.numeroConta = session.usuario.conta;
  }

  onSubmit(): void {
    if (!this.numeroConta) return;

    const valor = this.saqueForm.value.valor;
    try {
      this.contasService.sacar(this.numeroConta, valor);
      alert(`Saque de R$ ${valor.toFixed(2)} realizado com sucesso!`);
      this.saqueForm.reset({ valor: 0 });
    } catch (error: any) {
      alert(error.message || 'Erro ao realizar saque');
    }
  }
}
