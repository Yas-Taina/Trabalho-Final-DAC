import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { LocalClientesService, LocalLoginService } from '../../../services';
import { Cliente } from '../../../services/local/models/cliente';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskDirective, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  mensagem: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientesService: LocalClientesService,
    private loginService: LocalLoginService,
    private router: Router,
  ) {
    this.form = this.fb.group({
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
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', [Validators.required, Validators.maxLength(2)]]
      })
    });
  }

  ngOnInit(): void {
    const cpf = this.loginService.sessionInfo()?.usuario.cpf;
    if (!cpf) {
      alert('Sessão inválida ou usuário não é cliente');
      this.router.navigate(['/login']);
      return;
    }

    const cliente = this.clientesService.listarClientes().find(g => g.cpf === cpf);
    if (!cliente) {
      alert('Cliente não encontrado');
      this.router.navigate(['/client/home']);
      return;
    }

    this.form.patchValue(cliente);
    this.form.get('cpf')?.disable();
  }

  salvar(): void {
    if (this.form.invalid) {
      this.mensagem = 'Preencha todos os campos corretamente.';
      return;
    }

    const dados: Cliente = { ...this.form.getRawValue() };
    try {
      this.clientesService.editarPerfil(dados.cpf!, dados);
      this.mensagem = 'Dados atualizados com sucesso!';
    } catch (error: any) {
      this.mensagem = error.message;
    }
  }
}
