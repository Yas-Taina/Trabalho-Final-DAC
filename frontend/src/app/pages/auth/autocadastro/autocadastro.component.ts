import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalClientesService } from '../../../services';
import { Cliente } from '../../../services/local/models/cliente';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-autocadastro',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './autocadastro.component.html',
  styleUrls: ['./autocadastro.component.css']
})
export class AutocadastroComponent implements OnInit {
  clienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientesService: LocalClientesService
  ) {
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      cpf: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      salario: [0, [Validators.required, Validators.min(0)]],
      endereco: this.fb.group({
        tipo: ['', Validators.required],
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        cep: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', [Validators.required, Validators.maxLength(2)]]
      })
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const novoCliente: Cliente = this.clienteForm.value;

    try {
      this.clientesService.cadastrarCliente(novoCliente);
      alert('Cadastro enviado com sucesso! Aguarde aprovação do gerente.');
      this.clienteForm.reset({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
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
      });
    } catch (error: any) {
      alert(error.message || 'Erro ao cadastrar cliente');
    }
  }
}
