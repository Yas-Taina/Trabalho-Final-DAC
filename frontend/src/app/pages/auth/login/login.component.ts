import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LoginInfo, LocalLoginService } from '../../../services';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  readonly loginService: LocalLoginService = inject(LocalLoginService);
  readonly router: Router = inject(Router);
  readonly builder: FormBuilder = inject(FormBuilder);

  loginModel: LoginInfo = {
    email: '',
    senha: ''
  }

  loginForm = this.builder.group({
    email: [this.loginModel.email, [Validators.required, Validators.email]],
    senha: [this.loginModel.senha, [Validators.required, Validators.minLength(4)]]
  });

  constructor() { }

  async onSubmit() {
    console.log(this.loginForm.value);
    if (!this.loginForm.valid) {
      return;
    }

    // this.loginService.login(this.loginForm.value as LoginInfo).subscribe({
    //   next: () => {
    //     this.router.navigate(['/client/home']);
    //   },
    //   error: (err) => {
    //     alert('Erro no login: ' + (err.error?.message || err.message || 'Unknown error'));
    //   }
    // });
  }
}
