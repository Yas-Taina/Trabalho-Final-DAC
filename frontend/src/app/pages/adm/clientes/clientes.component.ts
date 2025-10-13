import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgxMaskPipe } from "ngx-mask";
import { LocalClientesService, LocalGerentesService } from "../../../services";
import { Cliente } from "../../../services/local/models/cliente";
import { Gerente } from "../../../services/local/models/gerente";

interface ClienteExibicao {
  cpf: string;
  nome: string;
  email: string;
  salario: number;
  conta?: string;
  saldo?: number;
  limite?: number;
  gerenteCpf?: string;
  gerenteNome?: string;
}

@Component({
  selector: "app-clientes-adm",
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskPipe],
  templateUrl: "./clientes.component.html",
  styleUrls: ["./clientes.component.css"],
})
export class ClientesAdmComponent implements OnInit {
  clientes: ClienteExibicao[] = [];

  constructor(
    private readonly clientesService: LocalClientesService,
    private readonly gerentesService: LocalGerentesService,
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  private carregarClientes(): void {
    const gerentesMap = this.criarMapaGerentes(
      this.gerentesService.listarGerentes(),
    );
    this.clientes = this.clientesService
      .listarClientes()
      .filter((cliente) => cliente.estado === "APROVADO")
      .map((cliente) => this.mapearClienteParaExibicao(cliente, gerentesMap));
  }

  private criarMapaGerentes(gerentes: Gerente[]): Record<string, Gerente> {
    return gerentes.reduce(
      (map, gerente) => {
        map[gerente.cpf] = gerente;
        return map;
      },
      {} as Record<string, Gerente>,
    );
  }

  private mapearClienteParaExibicao(
    cliente: Cliente,
    gerentesMap: Record<string, Gerente>,
  ): ClienteExibicao {
    const gerente = cliente.gerenteCpf
      ? gerentesMap[cliente.gerenteCpf]
      : undefined;
    return {
      cpf: cliente.cpf,
      nome: cliente.nome,
      email: cliente.email,
      salario: cliente.salario,
      conta: cliente.dadosConta?.numero,
      saldo: cliente.dadosConta?.saldo,
      limite: cliente.dadosConta?.limite,
      gerenteCpf: cliente.gerenteCpf,
      gerenteNome: gerente?.nome,
    };
  }
}
