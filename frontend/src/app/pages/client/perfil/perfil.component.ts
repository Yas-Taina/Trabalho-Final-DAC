import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskDirective, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  readonly builder: FormBuilder = inject(FormBuilder);

  perfilForm = this.builder.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    salario: ['', [Validators.required]],
    endereco: this.builder.group({
      tipo: ['', [Validators.required]],
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      cep: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      bairro: ['', [Validators.required]]
    })
  });

  constructor() {}

  onSubmit() {
    if (this.perfilForm.valid) {
      console.log('Dados atualizados:', this.perfilForm.value);
    }
  }
}
