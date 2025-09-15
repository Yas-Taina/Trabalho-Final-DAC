import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ContasService, LoginService, ClienteResponse } from '../../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transferencia',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './transferencia.component.html',
  styleUrl: './transferencia.component.css'
})
export class TransferenciaComponent {
  readonly contaService: ContasService = inject(ContasService);
  readonly loginService: LoginService = inject(LoginService);
  readonly router: Router = inject(Router);
  readonly builder: FormBuilder = inject(FormBuilder);

  transferenciaModel = {
    numeroConta: '',
    numeroContaDestino: '',
    valor: 0
  };

  transferenciaForm = this.builder.group({
    numeroConta: [this.transferenciaModel.numeroConta, [Validators.required]],
    numeroContaDestino: [this.transferenciaModel.numeroContaDestino, [Validators.required]],
    valor: [this.transferenciaModel.valor, [Validators.required, Validators.min(1.0)]],
  });

  constructor() {
    const session = this.loginService.sessionInfo();
    if (session?.tipo === 'CLIENTE') { // Guarda de autenticação teoricamente já cuidaria disso
      const cliente = session.usuario as ClienteResponse;
      this.transferenciaForm.patchValue({ numeroConta: cliente.conta ?? "" });
    }
  }

  async onSubmit() {
    console.log(this.transferenciaForm.value);
    if (!this.transferenciaForm.valid) {
      return;
    }

    const { numeroConta, numeroContaDestino, valor } = this.transferenciaForm.value;
    this.contaService.transferir(numeroConta!, numeroContaDestino!, valor!).subscribe({
      next: (res) => {
        alert(`Transferência de R$${valor?.toFixed(2)} para a conta ${numeroContaDestino} realizado com sucesso.`);
        this.router.navigate(['/client/home']);
      },
      error: (err) => {
        alert('Erro na transferência: ' + (err.error?.message || err.message || 'Erro desconhecido'));
      }
    });
  } 
}
