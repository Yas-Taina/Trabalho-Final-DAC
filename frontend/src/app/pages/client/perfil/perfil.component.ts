import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { DadosClienteResponse, LocalClientesService, PerfilInfo, toPerfilInfo } from '../../../services';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskDirective],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  readonly clienteService: LocalClientesService = inject(LocalClientesService);
  readonly router: Router = inject(Router);
  readonly builder: FormBuilder = inject(FormBuilder);
  readonly activatedRoute = inject(ActivatedRoute);

  readonly cpf: string = this.activatedRoute.snapshot.paramMap.get('cpf') ?? '';

  clienteModel: DadosClienteResponse = {
    cpf: '',
    email: '',
    telefone: '',
    nome: '',
    salario: 0,
    endereco: {
      tipo: '',
      logradouro: '',
      numero: '',
      complemento: '',
      cep: '',
      cidade: '',
      estado: ''
    },
    gerente_nome: '',
    gerente_email: ''
  }

  clienteForm = this.builder.group({
    cpf: [this.clienteModel.cpf, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    email: [this.clienteModel.email, [Validators.required, Validators.email]],
    nome: [this.clienteModel.nome, [Validators.required, Validators.minLength(3)]],
    salario: [this.clienteModel.salario, [Validators.required]],
    telefone: [this.clienteModel.telefone, [Validators.required]],
    endereco: this.builder.group({
      tipo: [this.clienteModel.endereco?.tipo ?? '', [Validators.required]],
      logradouro: [this.clienteModel.endereco?.logradouro ?? '', [Validators.required]],
      numero: [this.clienteModel.endereco?.numero ?? '', [Validators.required]],
      complemento: [this.clienteModel.endereco?.complemento ?? ''],
      cep: [this.clienteModel.endereco?.cep ?? '', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      cidade: [this.clienteModel.endereco?.cidade ?? '', [Validators.required]],
      estado: [this.clienteModel.endereco?.estado ?? '', [Validators.required]],
    }),
    gerente_nome: [this.clienteModel.gerente_nome ?? ''],
    gerente_email: [this.clienteModel.gerente_email ?? ''],
  });

  constructor(){}

  ngOnInit() {
    this.clienteService.getCliente(this.cpf).subscribe({
      next: (cliente) => {
        this.clienteModel = cliente;
        this.clienteForm.patchValue(this.clienteModel);
      },
      error: (err) => {
        alert('Erro ao carregar dados do cliente: ' + (err.error?.message || err.message || 'Unknown error'));
        this.router.navigate(['/cliente']);
      }
    });
  }

  async onSubmit() {
    console.log(this.clienteForm.value);
    if (!this.clienteForm.valid) {
      return;
    }

    this.clienteService.atualizarCliente(this.clienteModel.cpf!, toPerfilInfo(this.clienteForm.value as DadosClienteResponse)).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso! Aguarde a aprovação do gerente.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Erro no cadastro: ' + (err.error?.message || err.message || 'Unknown error'));
      }
    });
  }
}
