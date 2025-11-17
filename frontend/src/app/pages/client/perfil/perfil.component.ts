import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { NgxMaskDirective } from "ngx-mask";
import { ClientesService } from "../../../services/clientes.service";
import { AuthService } from "../../../services/auth.service";
import { PerfilInfo, DadosClienteResponse } from "../../../services/models";
import { CustomValidators } from "../../../validators/custom.validators";

@Component({
  selector: "app-perfil",
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskDirective, ReactiveFormsModule],
  templateUrl: "./perfil.component.html",
  styleUrls: ["./perfil.component.css"],
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  mensagem: string | null = null;
  loading$ = this.clientesService.getLoadingState();

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      nome: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      email: [
        "",
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      telefone: ["", [Validators.required, CustomValidators.phoneFormat()]],
      salario: ["", [Validators.required, CustomValidators.positiveNumber(), CustomValidators.decimalPlaces(2)]],
      endereco: ["", [Validators.required]],
      CEP: ["", [Validators.required, CustomValidators.cepFormat()]],
      cidade: ["", [Validators.required]],
      estado: ["", [Validators.required, Validators.maxLength(2), CustomValidators.stateBrazil()]],
    });
  }

  ngOnInit(): void {
    const cpf = this.authService.getUserCpf();
    if (!cpf) {
      alert("Sessão inválida ou usuário não é cliente");
      this.router.navigate(["/login"]);
      return;
    }

    this.clientesService.getCliente(cpf).subscribe({
      next: (cliente: DadosClienteResponse) => {
        const perfil: PerfilInfo = {
          nome: cliente.nome,
          email: cliente.email,
          salario: cliente.salario,
          endereco: cliente.endereco || "",
          CEP: "",
          cidade: cliente.cidade,
          estado: cliente.estado,
        };
        this.form.patchValue(perfil);
      },
      error: () => {
        alert("Cliente não encontrado");
        this.router.navigate(["/client/home"]);
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.mensagem = "Preencha todos os campos corretamente.";
      return;
    }

    const cpf = this.authService.getUserCpf();
    if (!cpf) return;

    const salario = parseFloat(this.form.value.salario);
    if (salario <= 0) {
      this.mensagem = "Salário deve ser maior que zero";
      return;
    }

    const dados: PerfilInfo = { ...this.form.value, salario };
    this.clientesService.atualizarCliente(cpf, dados).subscribe({
      next: () => {
        this.mensagem = "Dados atualizados com sucesso!";
      },
      error: (err) => {
        this.mensagem = err?.error?.message || "Erro ao atualizar perfil.";
      },
    });
  }
}
