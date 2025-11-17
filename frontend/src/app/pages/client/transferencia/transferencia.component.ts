import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

import { ContasService, ClientesService, AuthService } from "../../../services";
import { DadosClienteResponse } from "../../../services/models";
import { CustomValidators } from "../../../validators/custom.validators";

@Component({
  selector: "app-transferencia",
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./transferencia.component.html",
  styleUrls: ["./transferencia.component.css"],
})
export class TransferenciaComponent implements OnInit {
  transferenciaForm: FormGroup;
  numeroContaOrigem: string | null = null;
  clienteDados: DadosClienteResponse | null = null;
  loading$ = this.contasService.getLoadingState();

  constructor(
    private fb: FormBuilder,
    private contasService: ContasService,
    private clientesService: ClientesService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.transferenciaForm = this.fb.group({
      valor: ["", [Validators.required, CustomValidators.positiveNumber(), CustomValidators.decimalPlaces(2)]],
      numeroContaDestino: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.carregarContaOrigem();
  }

  private carregarContaOrigem(): void {
    const cpf = this.authService.getUserCpf();
    if (!cpf) {
      alert("Usuário não está logado.");
      this.router.navigate(["/login"]);
      return;
    }

    this.clientesService.getCliente(cpf).subscribe({
      next: (cliente) => {
        this.clienteDados = cliente;
        this.numeroContaOrigem = cliente.conta ?? null;

        if (!this.numeroContaOrigem) {
          alert("Número da conta do cliente não disponível.");
        }
      },
      error: (err) => {
        alert("Erro ao carregar dados do cliente.");
      },
    });
  }

  onSubmit(): void {
    if (this.transferenciaForm.invalid) return;
    if (!this.numeroContaOrigem) return;

    const valor = parseFloat(this.transferenciaForm.value.valor);
    const contaDestino = this.transferenciaForm.value.numeroContaDestino.trim();

    if (valor <= 0) {
      alert("Valor deve ser maior que zero");
      return;
    }

    if (this.numeroContaOrigem === contaDestino) {
      alert("Não é permitido transferir para a mesma conta");
      return;
    }

    this.contasService
      .transferir(this.numeroContaOrigem, contaDestino, valor)
      .subscribe({
        next: (res) => {
          alert(
            `Transferência de R$ ${res.valor.toFixed(2)} para a conta ${res.destino} realizada com sucesso!`,
          );
          this.transferenciaForm.reset();
          this.router.navigate(["/client/home"]);
        },
        error: (err) => {
          alert(err?.error?.message || "Erro ao realizar transferência");
        },
      });
  }
}
