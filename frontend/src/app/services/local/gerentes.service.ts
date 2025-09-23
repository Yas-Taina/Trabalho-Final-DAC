import { Injectable } from '@angular/core';
import { LocalBaseService } from '../local.base.service';
import { Gerente } from './models/gerente';
import { Conta } from './models/conta';

@Injectable({
  providedIn: 'root'
})
export class LocalGerentesService {
  private gerentesBase = new LocalBaseService<Gerente>('gerentes');
  private contasBase = new LocalBaseService<Conta>('contas');

  inserirUsuario(gerente: Gerente): void {
    const gerentes = this.gerentesBase.getAll();
    if (gerentes.some(g => g.cpf === gerente.cpf)) throw new Error('Gerente já cadastrado');

    this.gerentesBase.add(gerente);

    if (gerente.tipo === 'GERENTE') {
      const contas = this.contasBase.getAll();
      if (contas.length > 0) {
        const contasPorGerente: Record<string, number> = {};
        gerentes.filter(g => g.tipo === 'GERENTE').forEach(g => {
          contasPorGerente[g.cpf] = contas.filter(c => c.gerenteCpf === g.cpf).length;
        });

        const max = Math.max(...Object.values(contasPorGerente));
        const gerenteOrigem = gerentes.find(g => g.tipo === 'GERENTE' && contasPorGerente[g.cpf] === max);
        if (gerenteOrigem) {
          contas.filter(c => c.gerenteCpf === gerenteOrigem.cpf).forEach(c => {
            c.gerenteCpf = gerente.cpf;
            this.contasBase.update(c.numero, 'numero', c);
          });
        }
      }
    }
  }

  listarGerentes(): Gerente[] {
    return this.gerentesBase.getAll()
      .filter(g => g.tipo === 'GERENTE')
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  listarTodosGerentes(): Gerente[] {
    return this.gerentesBase.getAll()
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  editarGerente(cpf: string, novo: Partial<Gerente>): void {
    const gerente = this.gerentesBase.getById(cpf, 'cpf');
    if (!gerente) throw new Error('Gerente não encontrado');
    Object.assign(gerente, novo, { cpf: gerente.cpf });
    this.gerentesBase.update(cpf, 'cpf', gerente);
  }

  removerGerente(cpf: string): void {
    const gerentes = this.gerentesBase.getAll().filter(g => g.tipo === 'GERENTE');
    if (gerentes.length <= 1) throw new Error('Não é possível remover o último gerente');

    const contas = this.contasBase.getAll();
    const destino = this.getGerenteMenosContas(cpf);
    contas.filter(c => c.gerenteCpf === cpf).forEach(c => {
      c.gerenteCpf = destino.cpf;
      this.contasBase.update(c.numero, 'numero', c);
    });

    this.gerentesBase.delete(cpf, 'cpf');
  }

  dashboard(): { nome: string, total: number, saldoPositivo: number, saldoNegativo: number }[] {
    const gerentes = this.gerentesBase.getAll().filter(g => g.tipo === 'GERENTE');
    const contas = this.contasBase.getAll();

    return gerentes.map(g => {
      const contasGerente = contas.filter(c => c.gerenteCpf === g.cpf);
      const total = contasGerente.length;
      const saldoPositivo = contasGerente.filter(c => c.saldo > 0).length;
      const saldoNegativo = contasGerente.filter(c => c.saldo <= 0).length;

      return { nome: g.nome, total, saldoPositivo, saldoNegativo };
    });
  }

  private getGerenteMenosContas(excluirCpf: string): Gerente {
    const gerentes = this.gerentesBase.getAll().filter(g => g.cpf !== excluirCpf && g.tipo === 'GERENTE');
    const contas = this.contasBase.getAll();

    const contasPorGerente: Record<string, number> = {};
    gerentes.forEach(g => {
      contasPorGerente[g.cpf] = contas.filter(c => c.gerenteCpf === g.cpf).length;
    });

    const menor = Math.min(...Object.values(contasPorGerente));
    return gerentes.find(g => contasPorGerente[g.cpf] === menor)!;
  }
}
