import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgxMaskDirective } from "ngx-mask";
import { GerentesService } from "../../../services";
import {
  DadoGerente,
  DadoGerenteInsercao,
  DadoGerenteAtualizacao,
} from "../../../services";

@Component({
  selector: "app-editar-gerentes",
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: "./editar-gerentes.component.html",
  styleUrls: ["./editar-gerentes.component.css"],
})
export class EditarGerentesComponent implements OnInit {
  form: FormGroup;
  tipos = ["GERENTE", "ADMINISTRADOR"];
  editMode = false;
  mensagem: string | null = null;

  private confirmarSenhaValidator: ValidatorFn = (
    group: AbstractControl,
  ): ValidationErrors | null => {
    const senha = group.get("senha")?.value;
    const confirmarSenha = group.get("confirmarSenha")?.value;
    if (this.editMode && !senha && !confirmarSenha) return null;
    return senha === confirmarSenha ? null : { senhaDiferente: true };
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly gerentesService: GerentesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.form = this.criarFormulario();
  }

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get("cpf");
    if (cpf) {
      this.ativarModoEdicao(cpf);
    }
  }

  private criarFormulario(): FormGroup {
    return this.fb.group(
      {
        nome: ["", Validators.required],
        cpf: ["", [Validators.required, Validators.pattern(/^\d{11}$/)]],
        email: ["", [Validators.required, Validators.email]],
        senha: ["", [Validators.minLength(4), Validators.maxLength(4)]],
        confirmarSenha: [""],
        tipo: ["GERENTE", Validators.required],
      },
      { validators: this.confirmarSenhaValidator },
    );
  }

  private ativarModoEdicao(cpf: string): void {
    this.editMode = true;
    this.form.get("cpf")?.disable();
    this.form.get("tipo")?.disable();

    this.form.get("senha")?.clearValidators();
    this.form.get("confirmarSenha")?.clearValidators();
    this.form.updateValueAndValidity();

    this.gerentesService.getGerente(cpf).subscribe({
      next: (gerente: DadoGerente) => {
        this.form.patchValue({
          nome: gerente.nome,
          cpf: gerente.cpf,
          email: gerente.email,
          tipo: gerente.tipo,
        });
      },
      error: (e) => {
        this.mensagem = "Erro ao carregar dados do gerente: " + e.message;
        console.error(e);
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.mensagem = "Preencha todos os campos corretamente.";
      return;
    }

    const { confirmarSenha, senha, ...dadosForm } = this.form.getRawValue();
    const cpf = dadosForm.cpf;

    if (this.editMode) {
      const dadosAtualizacao: DadoGerenteAtualizacao = {
        nome: dadosForm.nome,
        email: dadosForm.email,
        senha: senha || undefined,
      };

      this.gerentesService.atualizarGerente(cpf, dadosAtualizacao).subscribe({
        next: () => {
          alert("Gerente atualizado com sucesso!");
          this.router.navigate(["/gerentes"]);
        },
        error: (e) => {
          this.mensagem =
            "Erro ao atualizar gerente: " + (e.error?.message || e.message);
          console.error(e);
        },
      });
    } else {
      if (!senha) {
        this.mensagem = "A senha é obrigatória para o cadastro.";
        return;
      }

      const dadosInsercao: DadoGerenteInsercao = {
        cpf: dadosForm.cpf,
        nome: dadosForm.nome,
        email: dadosForm.email,
        tipo: dadosForm.tipo,
        senha,
      };

      this.gerentesService.inserirGerente(dadosInsercao).subscribe({
        next: () => {
          this.mensagem = "Gerente cadastrado com sucesso!";
          this.form.reset({ tipo: "GERENTE" });
          this.form.get("cpf")?.enable();
          this.form.get("tipo")?.enable();
        },
        error: (e) => {
          this.mensagem =
            "Erro ao cadastrar gerente: " + (e.error?.message || e.message);
          console.error(e);
        },
      });
    }
  }
}
