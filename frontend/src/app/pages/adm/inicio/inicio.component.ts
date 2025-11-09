import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { GerentesService } from "../../../services";
import { ItemDashboardResponse } from "../../../services";

interface DashboardData {
  gerenteNome: string;
  gerenteEmail: string;
  gerenteCpf: string;
  clientesTotal: number;
  saldo_positivo: number;
  saldo_negativo: number;
}

@Component({
  selector: "app-inicio-adm",
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.css"],
})
export class InicioAdmComponent implements OnInit {
  dashboards: DashboardData[] = [];
  loading: boolean = true;
  errorMessage: string = "";

  constructor(private gerentesService: GerentesService) {}

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.loading = true;
    this.errorMessage = "";

    this.gerentesService.getGerentes("dashboard").subscribe({
      next: (response) => {
        const dashboardResponse = response as ItemDashboardResponse[];

        this.dashboards = dashboardResponse.map((item) => ({
          gerenteNome: item.gerente.nome,
          gerenteEmail: item.gerente.email,
          gerenteCpf: item.gerente.cpf,
          clientesTotal: item.clientes?.length || 0,
          saldo_positivo: item.saldo_positivo,
          saldo_negativo: item.saldo_negativo,
        }));

        this.loading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar o dashboard:", error);
        this.errorMessage = "Falha ao carregar os dados do dashboard.";
        this.loading = false;
      },
    });
  }
}
