import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../api.base.service';

@Injectable({
  providedIn: 'root',
})
export class InicializacaoService extends BaseService {
  // GET /reboot
  inicializarBanco(): Observable<any> {
    return this.get<any>('/reboot');
  }
}
