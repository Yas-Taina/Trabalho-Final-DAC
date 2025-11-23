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
  saldo: string = "";
  limite: number = 0;
  gerente_nome: string = "";

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      cpf: [{ value: "", disabled: true }],
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
      telefone: [{ value: "", disabled: true }],
      salario: ["", [Validators.required, CustomValidators.positiveNumber()]],
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
        this.saldo = cliente.saldo;
        this.limite = cliente.limite;
        this.gerente_nome = cliente.gerente_nome;
        this.form.patchValue({
          cpf: cliente.cpf,
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
          salario: cliente.salario,
          endereco: cliente.endereco || "",
          CEP: cliente.CEP || "",
          cidade: cliente.cidade,
          estado: cliente.estado,
        });
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

  const formValue = this.form.getRawValue();
  const salario = parseFloat(formValue.salario);
  
  if (isNaN(salario) || salario <= 0) {
    this.mensagem = "Salário deve ser um número válido maior que zero";
    return;
  }

  const dados = {
    nome: formValue.nome.trim(),
    email: formValue.email.trim(),
    salario: salario,
    endereco: formValue.endereco.trim(),
    CEP: formValue.CEP.replace(/\D/g, ""),
    cidade: formValue.cidade.trim(),
    estado: formValue.estado.trim().toUpperCase(),
  };

  console.log("Dados enviados para atualizar cliente:", dados);

  this.clientesService.atualizarCliente(cpf, dados).subscribe({
    next: () => {
      this.mensagem = "Dados atualizados com sucesso!";
    },
    error: (err) => {
      console.error("Erro ao atualizar perfil:", err);
      const errorMsg =
        err?.error?.message ||
        err?.message ||
        "Erro ao atualizar perfil.";
      this.mensagem = errorMsg;
    },
  });
}
}