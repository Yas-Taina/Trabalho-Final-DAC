import { Routes } from '@angular/router';
import { AutocadastroComponent } from './pages/auth/autocadastro/autocadastro.component';
import { HomeComponent } from './pages/auth/home/home.component'; 
import { LoginComponent } from './pages/auth/login/login.component';
import { DepositarComponent } from './pages/client/depositar/depositar.component';
import { InicioComponent } from './pages/client/inicio/inicio.component';
import { PerfilComponent } from './pages/client/perfil/perfil.component';

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
        component: InicioComponent
    },
    {
        path: 'perfil',
        component: PerfilComponent
    },
    {
        path: 'depositar',
        component: DepositarComponent
    },

    { path: "", redirectTo: "home", pathMatch: "full"},
];
