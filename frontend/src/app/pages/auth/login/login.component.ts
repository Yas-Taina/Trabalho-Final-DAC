import { Component, inject } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LoginInfo } from "../../../services/models";
import { CustomValidators } from "../../../validators/custom.validators";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly builder = inject(FormBuilder);
  loading$ = this.authService.getLoadingState();

  loginForm = this.builder.group({
    email: ["", [Validators.required, Validators.email]],
    senha: ["", [Validators.required, Validators.minLength(4)]],
  });

  async onSubmit() {
    if (!this.loginForm.valid) return;

    const data = this.loginForm.value as LoginInfo;

    this.authService.login(data).subscribe({
      next: (res) => {
        if (res.tipo === "ADMINISTRADOR") {
          this.router.navigate(["/adm/home"]);
        } else if (res.tipo === "GERENTE") {
          this.router.navigate(["/gerente/home"]);
        } else if (res.tipo === "CLIENTE") {
          this.router.navigate(["/client/home"]);
        } else {
          alert("Tipo de usuário não reconhecido.");
        }
      },
      error: (err) => {
        if (err.status === 401) {
          alert("Usuário ou senha incorretos.");
        } else {
          alert(
            "Erro no login: " +
              (err.error?.message || err.message || "Erro desconhecido"),
          );
        }
      },
    });
  }
}
