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

export const routes: Routes = [
    //public routes
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path:'cadastro',
        component: AutocadastroComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },

    //client routes
    {
        path: 'client/home',
        component: InicioClientComponent
    },
    {
        path: 'perfil',
        component: PerfilComponent
    },
    {
        path: 'depositar',
        component: DepositarComponent
    },
    {
        path: 'sacar',
        component: SaqueComponent
    },
    {
        path: 'extrato',
        component: ExtratoComponent
    },
    {
        path: 'transferir',
        component: TransferenciaComponent
    },

    //manager routes
    {
        path: 'gerente/home',
        component: InicioManagerComponent
    },
    {
        path: 'gerente/clients',
        component: ClientesManagerComponent
    },
    {
        path: 'clients/consulta',
        component: ConsultaComponent
    },
    {
        path: 'clients/melhores',
        component: MelhoresClientesComponent
    },

    //adm routes
    {
        path: 'adm/home',
        component: InicioAdmComponent
    },
    {
        path: 'adm/clients',
        component: ClientesAdmComponent
    },
    {
        path: 'gerentes',
        component: GerentesComponent
    },
    {
        path: 'adm/gerentes/novo',
        component: EditarGerentesComponent
    },
    {
        path: 'adm/gerentes/:cpf',
        component: EditarGerentesComponent
    },

    //default
    { path: "", redirectTo: "home", pathMatch: "full"},
];
