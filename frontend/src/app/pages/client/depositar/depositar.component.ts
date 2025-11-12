import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

import { ContasService } from "../../../services/contas.service";
import { ClientesService } from "../../../services/clientes.service";
import { AuthService } from "../../../services/auth.service";
import {
  DadosClienteResponse,
  OperacaoResponse,
} from "../../../services/models";

@Component({
  selector: "app-depositar",
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./depositar.component.html",
  styleUrls: ["./depositar.component.css"],
})
export class DepositarComponent implements OnInit {
  depositoForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contasService: ContasService,
    private clientesService: ClientesService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.depositoForm = this.fb.group({
      valor: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  onSubmit(): void {
    if (this.depositoForm.invalid) return;

    const cpf = this.authService.getUserCpf();
    if (!cpf) {
      alert("Usuário não logado ou CPF não encontrado");
      return;
    }

    this.loading = true;

    this.clientesService.getCliente(cpf).subscribe({
      next: (cliente: DadosClienteResponse) => {
        const numeroConta = cliente.conta;
        if (!numeroConta) {
          alert("Conta do cliente não encontrada");
          this.loading = false;
          return;
        }

        const valor = this.depositoForm.value.valor;

        this.contasService.depositar(numeroConta, valor).subscribe({
          next: (res: OperacaoResponse) => {
            alert(
              `Depósito de R$ ${valor.toFixed(2)} realizado com sucesso!\nSaldo atual: R$ ${res.saldo.toFixed(2)}`,
            );
            this.depositoForm.reset();
            this.router.navigate(["/client/home"]);
          },
          error: (err) => {
            console.error(err);
            alert(err?.error?.message || "Erro ao realizar depósito");
          },
          complete: () => (this.loading = false),
        });
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || "Erro ao buscar dados do cliente");
        this.loading = false;
      },
    });
  }
}
