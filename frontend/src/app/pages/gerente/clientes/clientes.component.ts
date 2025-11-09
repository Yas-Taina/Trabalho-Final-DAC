import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";
import { ClientesService } from "../../../services/clientes.service";
import { AuthService } from "../../../services/auth.service";
import { DadosClienteResponse } from "../../../services/models";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-clientesmanager",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.css"],
})
export class ClientesManagerComponent implements OnInit {
  clientes: DadosClienteResponse[] = [];
  clientesFiltrados: DadosClienteResponse[] = [];
  searchType: string = "";
  search: string = "";
  loading: boolean = false;
  errorMessage: string = "";

  constructor(
    private clientesService: ClientesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

carregarClientes(): void {
  this.loading = true;
  this.errorMessage = "";

  this.clientesService.getClientesByGerente()
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (clientes: any[]) => { 
        this.clientes = clientes.map((c) => ({
          ...c,
          salario: (c as any).salario ?? 0,
          gerente_nome: (c as any).gerente_nome ?? "",
          gerente_email: (c as any).gerente_email ?? "",
        })) as DadosClienteResponse[];

        this.clientesFiltrados = [...this.clientes];
      },
      error: (err) => {
        this.errorMessage =
          "Erro ao carregar clientes. Verifique a autenticação e permissões.";
        console.error("Erro na API de clientes:", err);
        this.clientes = [];
        this.clientesFiltrados = [];
      },
    });
}


  aplicarFiltro(): void {
    if (!this.searchType || !this.search) {
      this.clientesFiltrados = [...this.clientes];
      return;
    }
    const termo = this.search.toLowerCase().trim();

    this.clientesFiltrados = this.clientes.filter((c) => {
      if (this.searchType === "nome") return c.nome.toLowerCase().includes(termo);
      if (this.searchType === "cpf") return c.cpf.toLowerCase().includes(termo);
      return false;
    });
  }
}
