import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalClientesService, AutocadastroInfo } from '../../../services';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './autocadastro.component.html',
  styleUrl: './autocadastro.component.css'
})
export class AutocadastroComponent {
  readonly clienteService: LocalClientesService = inject(LocalClientesService);
  readonly router: Router = inject(Router);
  readonly builder: FormBuilder = inject(FormBuilder);

  clienteModel: AutocadastroInfo = {
    cpf: '',
    email: '',
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
    }
  }

  clienteForm = this.builder.group({
    cpf: [this.clienteModel.cpf, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    email: [this.clienteModel.email, [Validators.required, Validators.email]],
    nome: [this.clienteModel.nome, [Validators.required, Validators.minLength(3)]],
    salario: [this.clienteModel.salario, [Validators.required, Validators.min(0)]],
    telefone: [this.clienteModel.telefone, [Validators.required]],
    endereco: this.builder.group({
      tipo: [this.clienteModel.endereco?.tipo ?? '', [Validators.required]],
      logradouro: [this.clienteModel.endereco?.logradouro ?? '', [Validators.required]],
      numero: [this.clienteModel.endereco?.numero ?? '', [Validators.required]],
      complemento: [this.clienteModel.endereco?.complemento ?? ''],
      cep: [this.clienteModel.endereco?.cep ?? '', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      cidade: [this.clienteModel.endereco?.cidade ?? '', [Validators.required]],
      estado: [this.clienteModel.endereco?.estado ?? '', [Validators.required]],
    })
  });

  constructor(){}

  async onSubmit() {
    console.log(this.clienteForm.value);
    if (!this.clienteForm.valid) {
      return;
    }

    this.clienteService.autocadastroCliente(this.clienteForm.value as AutocadastroInfo).subscribe({
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
