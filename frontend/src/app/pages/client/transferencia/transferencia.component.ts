import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalContasService } from '../../../services';
import { LocalLoginService } from '../../../services';
import { ClienteResponse, DadoGerente } from '../../../services';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transferencia',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.css']
})
export class TransferenciaComponent implements OnInit {
  transferenciaForm: FormGroup;
  numeroContaOrigem: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contasService: LocalContasService,
    private loginService: LocalLoginService,
    private router: Router
  ) {
    this.transferenciaForm = this.fb.group({
      valor: [0, [Validators.required, Validators.min(0.01)]],
      numeroContaDestino: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.carregarContaOrigem();
  }

  private isCliente(usuario: ClienteResponse | DadoGerente): usuario is ClienteResponse {
    return (usuario as ClienteResponse).conta !== undefined;
  }

  private carregarContaOrigem(): void {
    const session = this.loginService.sessionInfo();
    if (!session || !this.isCliente(session.usuario)) {
      alert('Sessão inválida ou usuário não é cliente');
      return;
    }

    if (!session.usuario.conta) {
      alert('Número da conta não disponível');
      return;
    }

    this.numeroContaOrigem = session.usuario.conta;
  }

  onSubmit(): void {
    if (!this.numeroContaOrigem) return;

    const valor = this.transferenciaForm.value.valor;
    const contaDestino = this.transferenciaForm.value.numeroContaDestino;

    try {
      this.contasService.transferir(this.numeroContaOrigem, contaDestino, valor);
      alert(`Transferência de R$ ${valor.toFixed(2)} para a conta ${contaDestino} realizada com sucesso!`);
      this.transferenciaForm.reset({ valor: 0, numeroContaDestino: '' });

      this.router.navigate(['/client/home']);
    } catch (error: any) {
      alert(error.message || 'Erro ao realizar transferência');
    }
  }
}
