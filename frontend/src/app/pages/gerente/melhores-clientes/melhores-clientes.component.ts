import { Component, OnInit } from "@angular/core";
import { LocalClientesService } from "../../../services";
import { LocalLoginService } from "../../../services";
import { Cliente } from "../../../services/local/models/cliente";
import { ClienteResponse, DadoGerente } from "../../../services";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgxMaskPipe } from "ngx-mask";

@Component({
  selector: "app-melhores-clientes",
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskPipe],
  templateUrl: "./melhores-clientes.component.html",
  styleUrls: ["./melhores-clientes.component.css"],
})
export class MelhoresClientesComponent implements OnInit {
  clientes: (Cliente & { saldo?: number })[] = [];

  constructor(
    private clientesService: LocalClientesService,
    private loginService: LocalLoginService,
  ) {}

  ngOnInit(): void {
    this.carregarMelhoresClientes();
  }

  carregarMelhoresClientes(): void {
    const session = this.loginService.sessionInfo();
    if (!session || session.tipo !== "GERENTE") return;

    const gerenteCpf = (session.usuario as DadoGerente).cpf!;
    const top3 = this.clientesService.consultarTop3(gerenteCpf);
    this.clientes = top3.map((c) => ({
      ...c,
      saldo: c.dadosConta?.saldo,
    }));
  }
}
