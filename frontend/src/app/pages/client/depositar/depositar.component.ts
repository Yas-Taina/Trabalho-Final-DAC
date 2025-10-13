import { Component, OnInit, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { LocalLoginService } from "../../../services";
import { LocalContasService } from "../../../services";
import { ClienteResponse, DadoGerente } from "../../../services";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-depositar",
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./depositar.component.html",
  styleUrls: ["./depositar.component.css"],
})
export class DepositarComponent implements OnInit {
  depositoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LocalLoginService,
    private contasService: LocalContasService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.depositoForm = this.fb.group({
      valor: [null, [Validators.required, Validators.min(1)]],
    });
  }

  private isCliente(
    usuario: ClienteResponse | DadoGerente,
  ): usuario is ClienteResponse {
    return (usuario as ClienteResponse).conta !== undefined;
  }

  onSubmit(): void {
    if (this.depositoForm.valid) {
      const session = this.loginService.sessionInfo();
      if (!session || !this.isCliente(session.usuario)) {
        alert("Sessão inválida ou usuário não é cliente");
        return;
      }

      const numeroConta = session.usuario.conta;
      const valor = this.depositoForm.value.valor;

      try {
        this.contasService.depositar(numeroConta!, valor);
        alert("Depósito realizado com sucesso!");
        this.depositoForm.reset();

        this.router.navigate(["/client/home"]);
      } catch (error: any) {
        alert(error.message || "Erro ao realizar depósito");
      }
    }
  }
}
