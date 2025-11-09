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

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefone: ["", [Validators.required]],
      salario: [0, [Validators.required, Validators.min(0)]],
      endereco: ["", [Validators.required]],
      CEP: ["", [Validators.required]],
      cidade: ["", [Validators.required]],
      estado: ["", [Validators.required, Validators.maxLength(2)]],
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

    const dados: PerfilInfo = { ...this.form.value };
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
