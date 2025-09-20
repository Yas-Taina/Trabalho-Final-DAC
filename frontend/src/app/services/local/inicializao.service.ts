import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalBaseService } from '../local.base.service';

@Injectable({
  providedIn: 'root',
})
export class LocalInicializacaoService extends LocalBaseService {
  // // GET /reboot
  // inicializarBanco(): Observable<any> {
  // }
}
