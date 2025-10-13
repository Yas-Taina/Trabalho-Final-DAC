import { Component, OnInit } from "@angular/core";
import { LocalGerentesService } from "../../../services";
import { Gerente } from "../../../services/local/models/gerente";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgxMaskPipe } from "ngx-mask";

@Component({
  selector: "app-gerentes",
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskPipe],
  templateUrl: "./gerentes.component.html",
  styleUrls: ["./gerentes.component.css"],
})
export class GerentesComponent implements OnInit {
  gerentes: Gerente[] = [];

  constructor(private gerentesService: LocalGerentesService) {}

  ngOnInit(): void {
    this.carregarGerentes();
  }

  carregarGerentes(): void {
    this.gerentes = this.gerentesService.listarGerentes();
  }

  removerGerente(cpf: string): void {
    if (confirm("Tem certeza que deseja remover este gerente?")) {
      try {
        this.gerentesService.removerGerente(cpf);
        this.carregarGerentes();
      } catch (error: any) {
        alert(error.message);
      }
    }
  }
}
