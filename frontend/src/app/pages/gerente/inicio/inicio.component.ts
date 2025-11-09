import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgxMaskPipe } from "ngx-mask";
import { ClientesService } from "../../../services/clientes.service";
import { ClienteParaAprovarResponse } from "../../../services/models";

@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NgxMaskPipe],
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.css"],
})
export class InicioManagerComponent implements OnInit {
  clientes: ClienteParaAprovarResponse[] = [];
  clienteRecusando: ClienteParaAprovarResponse | null = null;
  motivoRecusa: string = "";
  carregando: boolean = false;

  constructor(private clientesService: ClientesService) {}

  ngOnInit() {
    this.carregarClientesAguardando();
  }

  carregarClientesAguardando() {
    this.carregando = true;
    this.clientesService.getClientes("para_aprovar").subscribe({
      next: (clientes) => {
        this.clientes = clientes as ClienteParaAprovarResponse[];
        this.carregando = false;
      },
      error: (err) => {
        console.error("Erro ao carregar clientes:", err);
        alert("Não foi possível carregar os clientes.");
        this.carregando = false;
      },
    });
  }

  aprovar(cliente: ClienteParaAprovarResponse) {
    this.clientesService.aprovarCliente(cliente.cpf).subscribe({
      next: () => {
        this.clientes = this.clientes.filter((c) => c.cpf !== cliente.cpf);
        alert(`Cliente ${cliente.nome} aprovado com sucesso.`);
      },
      error: (err) => {
        console.error("Erro ao aprovar cliente:", err);
        alert("Não foi possível aprovar o cliente.");
      },
    });
  }

  abrirModalRecusa(cliente: ClienteParaAprovarResponse) {
    this.clienteRecusando = cliente;
    this.motivoRecusa = "";
  }

  confirmarRecusa() {
    if (!this.motivoRecusa.trim()) {
      alert("Informe o motivo da recusa.");
      return;
    }
    if (this.clienteRecusando) {
      this.clientesService
        .rejeitarCliente(this.clienteRecusando.cpf, this.motivoRecusa)
        .subscribe({
          next: () => {
            this.clientes = this.clientes.filter(
              (c) => c.cpf !== this.clienteRecusando!.cpf
            );
            alert(`Cliente ${this.clienteRecusando!.nome} recusado com sucesso.`);
            this.clienteRecusando = null;
            this.motivoRecusa = "";
          },
          error: (err) => {
            console.error("Erro ao rejeitar cliente:", err);
            alert("Não foi possível recusar o cliente.");
          },
        });
    }
  }

  cancelarRecusa() {
    this.clienteRecusando = null;
    this.motivoRecusa = "";
  }
}
