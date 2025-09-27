import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LocalGerentesService } from '../../../services';
import { Gerente } from '../../../services/local/models/gerente';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-editar-gerentes',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './editar-gerentes.component.html',
  styleUrls: ['./editar-gerentes.component.css']
})
export class EditarGerentesComponent implements OnInit {
  form: FormGroup;
  tipos = ['GERENTE', 'ADMINISTRADOR'];
  editMode = false;
  mensagem: string | null = null;

  confirmarSenhaValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const s = group.get('senha')?.value;
    const c = group.get('confirmarSenha')?.value;
    return s === c ? null : { senhaDiferente: true };
  };

  constructor(
    private fb: FormBuilder,
    private gerentesService: LocalGerentesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      senha: ['', [Validators.minLength(4), Validators.maxLength(4)]],
      confirmarSenha: [''],
      tipo: ['GERENTE', Validators.required]
    }, { validators: this.confirmarSenhaValidator });
  }

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) {
      this.editMode = true;
      const gerente = this.gerentesService.listarGerentes().find(g => g.cpf === cpf);
      if (gerente) {
        this.form.patchValue({
          nome: gerente.nome,
          cpf: gerente.cpf,
          email: gerente.email,
          telefone: gerente.telefone,
          tipo: gerente.tipo
        });
        this.form.get('cpf')?.disable();
      }
    }
  }

  salvar(): void {
    if (this.form.invalid) {
      this.mensagem = 'Preencha todos os campos corretamente.';
      return;
    }

    const raw = this.form.getRawValue();
    const { confirmarSenha, senha, ...resto } = raw;
    const dados: Gerente = { ...resto };
    if (senha) {
      dados.senha = senha;
    }

    try {
      if (this.editMode) {
        this.gerentesService.editarGerente(dados.cpf!, dados);
        this.mensagem = 'Gerente atualizado com sucesso!';
      } else {
        this.gerentesService.inserirUsuario(dados);
        this.mensagem = 'Gerente cadastrado com sucesso!';
        this.form.reset({ tipo: 'GERENTE' });
      }
    } catch (error: any) {
      this.mensagem = error.message;
    }
  }
}
