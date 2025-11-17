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
import { CustomValidators } from "../../../validators/custom.validators";

@Component({
  selector: "app-saque",
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./saque.component.html",
  styleUrls: ["./saque.component.css"],
})
export class SaqueComponent implements OnInit {
  saqueForm!: FormGroup;
  loading$ = this.contasService.getLoadingState();

  constructor(
    private fb: FormBuilder,
    private contasService: ContasService,
    private clientesService: ClientesService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.saqueForm = this.fb.group({
      valor: ["", [Validators.required, CustomValidators.positiveNumber(), CustomValidators.decimalPlaces(2)]],
    });
  }

  onSubmit(): void {
    if (this.saqueForm.invalid) return;

    const cpf = this.authService.getUserCpf();
    if (!cpf) {
      alert("Usuário não logado ou CPF não encontrado");
      return;
    }

    this.clientesService.getCliente(cpf).subscribe({
      next: (cliente: DadosClienteResponse) => {
        const numeroConta = cliente.conta;
        if (!numeroConta) {
          alert("Conta do cliente não encontrada");
          return;
        }

        const valor = parseFloat(this.saqueForm.value.valor);

        if (valor <= 0) {
          alert("Valor deve ser maior que zero");
          return;
        }

        this.contasService.sacar(numeroConta, valor).subscribe({
          next: (res: OperacaoResponse) => {
            alert(
              `Saque de R$ ${valor.toFixed(2)} realizado com sucesso!\nSaldo atual: R$ ${res.saldo.toFixed(2)}`,
            );
            this.saqueForm.reset();
            this.router.navigate(["/client/home"]);
          },
          error: (err) => {
            alert(err?.error?.message || "Erro ao realizar saque");
          },
        });
      },
      error: (err) => {
        alert(err?.error?.message || "Erro ao buscar dados do cliente");
      },
    });
  }
}
