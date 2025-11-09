import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgxMaskDirective } from "ngx-mask";
import { ClientesService } from "../../../services";
import { AutocadastroInfo } from "../../../services/models";
import { catchError, of, tap } from "rxjs";

@Component({
  selector: "app-autocadastro",
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: "./autocadastro.component.html",
  styleUrls: ["./autocadastro.component.css"],
})
export class AutocadastroComponent implements OnInit {
  clienteForm: FormGroup;
  mensagem: string | null = null;
  erro: boolean = false;

  constructor(private fb: FormBuilder, private clientesService: ClientesService) {
    this.clienteForm = this.fb.group({
      nome: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ["", [Validators.required, Validators.email, Validators.maxLength(100)]],
      cpf: ["", [Validators.required]],
      telefone: ["", [Validators.required]],
      salario: [0, [Validators.required, Validators.min(0)]],
      endereco: ["", Validators.required],
      CEP: ["", Validators.required], // 🔹 corrigido: maiúsculo conforme schema
      cidade: ["", Validators.required],
      estado: ["", [Validators.required, Validators.maxLength(2)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.mensagem = null;
    this.erro = false;

    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const formValue = this.clienteForm.value;
    const data: AutocadastroInfo = {
      nome: formValue.nome.trim(),
      email: formValue.email.trim(),
      cpf: formValue.cpf.replace(/\D/g, ""),
      telefone: formValue.telefone.trim(),
      salario: parseFloat(formValue.salario),
      endereco: formValue.endereco.trim(),
      CEP: formValue.CEP.replace(/\D/g, ""),
      cidade: formValue.cidade.trim(),
      estado: formValue.estado.toUpperCase(),
    };

    this.clientesService
      .autocadastro(data)
      .pipe(
        tap(() => {
          this.mensagem =
            "Cadastro enviado com sucesso! Aguarde aprovação do gerente.";
          this.erro = false;
          this.clienteForm.reset();
        }),
        catchError((err) => {
          this.mensagem =
            err.error?.message ||
            "Erro ao cadastrar cliente. Verifique os dados e tente novamente.";
          this.erro = true;
          return of(null);
        })
      )
      .subscribe();
  }
}
