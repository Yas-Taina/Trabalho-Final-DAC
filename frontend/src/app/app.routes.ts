import { Routes } from '@angular/router';
import { AutocadastroComponent } from './pages/auth/autocadastro/autocadastro.component';
import { HomeComponent } from './pages/auth/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { DepositarComponent } from './pages/client/depositar/depositar.component';
import { SaqueComponent } from './pages/client/saque/saque.component';
import { InicioClientComponent } from './pages/client/inicio/inicio.component';
import { PerfilComponent } from './pages/client/perfil/perfil.component';
import { ExtratoComponent } from './pages/client/extrato/extrato.component';
import { TransferenciaComponent } from './pages/client/transferencia/transferencia.component';
import { InicioManagerComponent } from './pages/gerente/inicio/inicio.component';
import { InicioAdmComponent } from './pages/adm/inicio/inicio.component';
import { ClientesManagerComponent } from './pages/gerente/clientes/clientes.component';
import { ClientesAdmComponent } from './pages/adm/clientes/clientes.component';
import { ConsultaComponent } from './pages/gerente/consulta/consulta.component';
import { MelhoresClientesComponent } from './pages/gerente/melhores-clientes/melhores-clientes.component';
import { GerentesComponent } from './pages/adm/gerentes/gerentes.component';
import { EditarGerentesComponent } from './pages/adm/editar-gerentes/editar-gerentes.component';
//import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  //public routes
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'cadastro',
    component: AutocadastroComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },

  //client routes
  {
    path: 'client/home',
    component: InicioClientComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'CLIENTE',
    },
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'CLIENTE',
    },
  },
  {
    path: 'depositar',
    component: DepositarComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'CLIENTE',
    },
  },
  {
    path: 'sacar',
    component: SaqueComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'CLIENTE',
    },
  },
  {
    path: 'extrato',
    component: ExtratoComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'CLIENTE',
    },
  },
  {
    path: 'transferir',
    component: TransferenciaComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'CLIENTE',
    },
  },

  //manager routes
  {
    path: 'gerente/home',
    component: InicioManagerComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'GERENTE',
    },
  },
  {
    path: 'gerente/clients',
    component: ClientesManagerComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'GERENTE',
    },
  },
  {
    path: 'clients/consulta',
    component: ConsultaComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'GERENTE',
    },
  },
  {
    path: 'clients/melhores',
    component: MelhoresClientesComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'GERENTE',
    },
  },

  //adm routes
  {
    path: 'adm/home',
    component: InicioAdmComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'ADMIN',
    },
  },
  {
    path: 'adm/clients',
    component: ClientesAdmComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'ADMIN',
    },
  },
  {
    path: 'gerentes',
    component: GerentesComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'ADMIN',
    },
  },
  {
    path: 'gerentes/edit',
    component: EditarGerentesComponent,
    //canActivate: [authGuard],
    data: {
      requiredRole: 'ADMIN',
    },
  },

  //default
  { path: "", redirectTo: "home", pathMatch: "full" },

  { path: '**', redirectTo: "home", pathMatch: "full" },
];
