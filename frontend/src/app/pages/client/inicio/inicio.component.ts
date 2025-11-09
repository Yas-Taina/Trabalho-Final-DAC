import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMaskDirective } from "ngx-mask";
import { ClientesService } from "../../../services/clientes.service";
import { AuthService } from "../../../services/auth.service";
import { DadosClienteResponse } from "../../../services/models";

@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.css"],
})
export class InicioClientComponent implements OnInit {
  saldo: number | null = null;
  loading: boolean = false;

  constructor(
    private clientesService: ClientesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarSaldo();
  }

  private carregarSaldo(): void {
    const cpf = this.authService.getUserCpf();
    if (!cpf) {
      alert("Usuário não logado.");
      return;
    }

    this.loading = true;

    this.clientesService.getCliente(cpf).subscribe({
      next: (res: DadosClienteResponse) => {
        const valor = parseFloat(res.saldo as string);
        this.saldo = isNaN(valor) ? 0 : valor;
        this.loading = false;
      },
      error: (err) => {
        alert(err?.error?.message || "Erro ao consultar saldo");
        this.loading = false;
      },
    });
  }
}
