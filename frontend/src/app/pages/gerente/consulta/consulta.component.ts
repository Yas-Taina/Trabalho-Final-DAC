import { Component, OnInit, inject } from "@angular/core";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { ClientesService } from "../../../services";
import { DadosClienteResponse } from "../../../services/models";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-consulta",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: "./consulta.component.html",
  styleUrls: ["./consulta.component.css"],
})
export class ConsultaComponent implements OnInit {
  cliente: DadosClienteResponse | null = null;
  searchCpf: string = "";

  private clientesService = inject(ClientesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const cpfParam = this.route.snapshot.paramMap.get("cpf");
    if (cpfParam) {
      this.consultarCliente(cpfParam);
    }
  }

  consultarCliente(cpf?: string): void {
    const cpfBusca = cpf ?? this.searchCpf;
    const cpfLimpo = cpfBusca.replace(/\D/g, "");

    if (!cpfLimpo) {
      this.cliente = null;
      return;
    }

    this.clientesService.getCliente(cpfLimpo).subscribe({
      next: (dadosCliente: DadosClienteResponse) => {
        this.cliente = dadosCliente;
      },
      error: (error: HttpErrorResponse) => {
        this.cliente = null;
        if (error.status === 404) {
          console.warn(`Cliente com CPF ${cpfLimpo} não encontrado.`);
        } else if (error.status === 401) {
          console.error("Não autorizado. Redirecionando para login.");
          this.router.navigate(["/login"]);
        } else if (error.status === 403) {
          console.error("Proibido. Usuário sem permissão.");
        } else {
          console.error("Erro ao buscar cliente:", error);
        }
      },
    });
  }
}
