import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClienteResponse, ContasService, LoginService } from '../../../services';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depositar',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './depositar.component.html',
  styleUrl: './depositar.component.css'
})
export class DepositarComponent {
  readonly contaService: ContasService = inject(ContasService);
  readonly loginService: LoginService = inject(LoginService);
  readonly router: Router = inject(Router);
  readonly builder: FormBuilder = inject(FormBuilder);

  depositoModel = {
    numeroConta: '',
    valor: 0
  };

  depositoForm = this.builder.group({
    numeroConta: [this.depositoModel.numeroConta, [Validators.required]],
    valor: [this.depositoModel.valor, [Validators.required, Validators.min(1.0)]],
  });

  constructor() {
    const session = this.loginService.sessionInfo();
    if (session?.tipo === 'CLIENTE') { // Guarda de autenticação teoricamente já cuidaria disso
      const cliente = session.usuario as ClienteResponse;
      this.depositoForm.patchValue({ numeroConta: cliente.conta ?? "" });
    }
  }

  async onSubmit() {
    console.log(this.depositoForm.value);
    if (!this.depositoForm.valid) {
      return;
    }

    const { numeroConta, valor } = this.depositoForm.value;
    this.contaService.depositar(numeroConta!, valor!).subscribe({
      next: () => {
        alert(`Depósito de R$${valor?.toFixed(2)} realizado com sucesso.`);
        this.router.navigate(['/client/home']);
      },
      error: (err) => {
        alert('Erro no depósito: ' + (err.error?.message || err.message || 'Erro desconhecido'));
      }
    });
  }
}
