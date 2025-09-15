import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ContasService, LoginService, ClienteResponse } from '../../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saque',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './saque.component.html',
  styleUrl: './saque.component.css'
})
export class SaqueComponent {
  readonly contaService: ContasService = inject(ContasService);
  readonly loginService: LoginService = inject(LoginService);
  readonly router: Router = inject(Router);
  readonly builder: FormBuilder = inject(FormBuilder);

  saqueModel = {
    numeroConta: '',
    valor: 0
  };

  saqueForm = this.builder.group({
    numeroConta: [this.saqueModel.numeroConta, [Validators.required]],
    valor: [this.saqueModel.valor, [Validators.required, Validators.min(1.0)]],
  });

  constructor() {
    const session = this.loginService.sessionInfo();
    if (session?.tipo === 'CLIENTE') { // Guarda de autenticação teoricamente já cuidaria disso
      const cliente = session.usuario as ClienteResponse;
      this.saqueForm.patchValue({ numeroConta: cliente.conta ?? "" });
    }
  }

  async onSubmit() {
    console.log(this.saqueForm.value);
    if (!this.saqueForm.valid) {
      return;
    }

    const { numeroConta, valor } = this.saqueForm.value;
    this.contaService.sacar(numeroConta!, valor!).subscribe({
      next: (res) => {
        alert(`Saque de R$${valor?.toFixed(2)} realizado com sucesso.`);
        this.router.navigate(['/client/home']);
      },
      error: (err) => {
        alert('Erro no saque: ' + (err.error?.message || err.message || 'Erro desconhecido'));
      }
    });
  }
}
