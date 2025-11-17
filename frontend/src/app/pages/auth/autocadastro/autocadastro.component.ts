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
import { CustomValidators } from "../../../validators/custom.validators";

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
  loading$ = this.clientesService.getLoadingState();

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
  ) {
    this.clienteForm = this.fb.group({
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
      cpf: ["", [Validators.required, CustomValidators.cpfFormat()]],
      telefone: ["", [Validators.required, CustomValidators.phoneFormat()]],
      salario: ["", [Validators.required, CustomValidators.positiveNumber()]],
      endereco: ["", Validators.required],
      CEP: ["", [Validators.required, CustomValidators.cepFormat()]],
      cidade: ["", Validators.required],
      estado: ["", [Validators.required, Validators.maxLength(2), CustomValidators.stateBrazil()]],
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
    const salario = parseFloat(formValue.salario);

    if (salario <= 0) {
      this.mensagem = "Salário deve ser maior que zero";
      this.erro = true;
      return;
    }

    const data: AutocadastroInfo = {
      nome: formValue.nome.trim(),
      email: formValue.email.trim(),
      cpf: formValue.cpf.replace(/\D/g, ""),
      telefone: formValue.telefone.trim(),
      salario: salario,
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
        }),
      )
      .subscribe();
  }
}
