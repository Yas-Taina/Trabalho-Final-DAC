import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalGerentesService } from '../../../services';
import { DadoGerente, TipoGerente } from '../../../services/model';

@Component({
  selector: 'app-editar-gerentes',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskDirective, ReactiveFormsModule],
  templateUrl: './editar-gerentes.component.html',
  styleUrl: './editar-gerentes.component.css'
})
export class EditarGerentesComponent implements OnInit {
  form!: FormGroup;
  tipos: TipoGerente[] = ['ADMINISTRADOR', 'GERENTE'];
  mensagem: string | null = null;
  editMode = false; // true se for edição
  cpfParam!: string;

  constructor(
    private fb: FormBuilder,
    private gerentesService: LocalGerentesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      tipo: ['GERENTE', [Validators.required]]
    });

    // verificar se veio cpf na rota → edição
    this.cpfParam = this.route.snapshot.paramMap.get('cpf') ?? '';
    if (this.cpfParam) {
      this.editMode = true;
      this.carregarGerente(this.cpfParam);
      // se for edição, CPF não pode ser alterado
      this.form.get('cpf')?.disable();
    }
  }

  carregarGerente(cpf: string): void {
    this.gerentesService.getGerente(cpf).subscribe({
      next: (g) => {
        this.form.patchValue({
          nome: g.nome,
          cpf: g.cpf,
          email: g.email,
          telefone: g.telefone,
          tipo: g.tipo ?? 'GERENTE'
        });
      },
      error: (err) => this.mensagem = err.message
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.mensagem = 'Preencha todos os campos corretamente!';
      return;
    }

    const dados: DadoGerente = {
      ...this.form.getRawValue() // pega inclusive CPF desabilitado
    };

    if (this.editMode) {
      this.gerentesService.atualizarGerente(this.cpfParam, dados).subscribe({
        next: (res) => {
          this.mensagem = `Gerente ${res.nome} atualizado com sucesso!`;
          setTimeout(() => this.router.navigate(['/adm/home']), 1500);
        },
        error: (err) => this.mensagem = err.message
      });
    } else {
      this.gerentesService.inserirGerente(dados).subscribe({
        next: (res) => {
          this.mensagem = `Gerente ${res.nome} cadastrado com sucesso!`;
          this.form.reset();
        },
        error: (err) => this.mensagem = err.message
      });
    }
  }
}
