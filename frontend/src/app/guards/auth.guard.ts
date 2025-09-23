import { CanActivateFn, Router } from '@angular/router';
import { LocalLoginService, LoginService } from '../services';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LocalLoginService);
  const router = inject(Router);

  const sessao = loginService.sessionInfo();
  const requiredRole = route.data["requiredRole"] as 'CLIENTE' | 'GERENTE' | 'ADMINISTRADOR';

  if (!sessao) {
    router.navigate(["/auth/login"]);
    return false;
  }

  if (sessao.tipo !== requiredRole) {
    if (sessao.tipo === 'CLIENTE') {
      router.navigate(["/client/home"]);
      return false;
    }

    if (sessao.tipo === 'ADMINISTRADOR') {
      router.navigate(["/adm/home"]);
      return false;
    }

    if (sessao.tipo === 'GERENTE') {
      router.navigate(["/gerente/home"]);
      return false;
    }
  }

  return true;
};

