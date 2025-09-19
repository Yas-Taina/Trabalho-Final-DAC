import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DadoGerente, DadoGerenteInsercao, DadoGerenteAtualizacao } from '../model';
import { LocalBaseService } from '../local.base.service';

@Injectable({
  providedIn: 'root',
})
export class LocalGerentesService extends LocalBaseService {
  private storageKey = 'dac_gerentes';

  private read(): DadoGerente[] {
    return this.readLocalArray<DadoGerente>(this.storageKey);
  }

  private write(list: DadoGerente[]): void {
    this.writeLocalArray<DadoGerente>(this.storageKey, list);
  }

  // GET /gerentes?numero=dashboard
  getGerentes(numero?: 'dashboard'): Observable<any> {
    
  }

  // POST /gerentes
  inserirGerente(data: DadoGerenteInsercao): Observable<DadoGerente> {
    
  }

  // GET /gerentes/{cpf}
  getGerente(cpf: string): Observable<DadoGerente> {
    
  }

  // DELETE /gerentes/{cpf}
  removerGerente(cpf: string): Observable<DadoGerente> {
    
  }

  // PUT /gerentes/{cpf}
  atualizarGerente(cpf: string, data: DadoGerenteAtualizacao): Observable<DadoGerente> {
    
  }
}
