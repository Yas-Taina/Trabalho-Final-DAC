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
import { LocalGerentesService } from "../../../services";
import { Gerente } from "../../../services/local/models/gerente";

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
    return senha === confirmarSenha ? null : { senhaDiferente: true };
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly gerentesService: LocalGerentesService,
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
        cpf: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        telefone: ["", Validators.required],
        senha: ["", [Validators.minLength(4), Validators.maxLength(4)]],
        confirmarSenha: [""],
        tipo: ["GERENTE", Validators.required],
      },
      { validators: this.confirmarSenhaValidator },
    );
  }

  private ativarModoEdicao(cpf: string): void {
    const gerente = this.gerentesService
      .listarGerentes()
      .find((g) => g.cpf === cpf);
    if (!gerente) return;
    this.editMode = true;
    this.form.patchValue({
      nome: gerente.nome,
      cpf: gerente.cpf,
      email: gerente.email,
      telefone: gerente.telefone,
      tipo: gerente.tipo,
    });
    this.form.get("cpf")?.disable();
  }

  salvar(): void {
    if (this.form.invalid) {
      this.mensagem = "Preencha todos os campos corretamente.";
      return;
    }

    const { confirmarSenha, senha, ...dadosForm } = this.form.getRawValue();
    const dados: Gerente = { ...dadosForm };
    if (senha) dados.senha = senha;

    try {
      if (this.editMode) {
        this.gerentesService.editarGerente(dados.cpf!, dados);
        this.router.navigate(["/gerentes"]);
        alert("Gerente atualizado com sucesso!");
      } else {
        this.gerentesService.inserirUsuario(dados);
        this.mensagem = "Gerente cadastrado com sucesso!";
        this.form.reset({ tipo: "GERENTE" });
      }
    } catch (e: any) {
      this.mensagem = e.message;
    }
  }
}
