import { Component, DoCheck } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { LocalLoginService } from "../../services";
import { LoginResponse } from "../../services";
import { CommonModule } from "@angular/common";

interface MenuLink {
  label: string;
  path: string;
}

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements DoCheck {
  isOpen = false;
  session: LoginResponse | null = null;
  links: MenuLink[] = [];
  private lastSessionJson = "";

  constructor(
    private loginService: LocalLoginService,
    private router: Router,
  ) {
    this.updateSession();
  }

  ngDoCheck() {
    const currentSessionJson = localStorage.getItem("dac_token") || "";
    if (currentSessionJson !== this.lastSessionJson) {
      this.updateSession();
      this.lastSessionJson = currentSessionJson;
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.loginService.logout().subscribe(() => {
      this.router.navigate(["/login"]);
      this.links = [];
      this.session = null;
      this.isOpen = false;
      this.lastSessionJson = "";
    });
  }

  get isLoggedIn(): boolean {
    return this.session != null;
  }

  private updateSession() {
    const newSession = this.loginService.sessionInfo();
    if (JSON.stringify(newSession) !== JSON.stringify(this.session)) {
      this.session = newSession;
      this.isOpen = false;
      this.links = [];
      if (this.session) this.setupLinks();
    }
  }

  private setupLinks() {
    if (!this.session) {
      this.links = [];
      return;
    }

    const tipo = this.session.tipo;
    let newLinks: MenuLink[] = [];

    if (tipo === "CLIENTE") {
      newLinks = [
        { label: "Home", path: "client/home" },
        { label: "Depositar", path: "depositar" },
        { label: "Saque", path: "sacar" },
        { label: "Transferência", path: "transferir" },
        { label: "Minha Conta", path: "perfil" },
        { label: "Consultar Extrato", path: "extrato" },
      ];
    } else if (tipo === "GERENTE") {
      newLinks = [
        { label: "Home", path: "gerente/home" },
        { label: "Clientes", path: "gerente/clients" },
        { label: "Consultar Cliente", path: "clients/consulta" },
        { label: "Melhores Clientes", path: "clientes/melhores" },
      ];
    } else if (tipo === "ADMINISTRADOR") {
      newLinks = [
        { label: "Home", path: "adm/home" },
        { label: "Clientes", path: "adm/clients" },
        { label: "Gerentes", path: "gerentes" },
        { label: "Novo Gerente", path: "adm/gerentes/novo" },
      ];
    }

    this.links = newLinks;
  }
}
