import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalClientesService } from '../../../services';
import { Cliente } from '../../../services/local/models/cliente';
import { LocalLoginService } from '../../../services';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {
  cliente: Cliente | null = null;
  searchCpf: string = '';

  constructor(
    private clientesService: LocalClientesService,
    private loginService: LocalLoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const cpfParam = this.route.snapshot.paramMap.get('cpf');
    if (cpfParam) {
      this.consultarCliente(cpfParam);
    }
  }

  consultarCliente(cpf?: string): void {
    const cpfBusca = cpf ?? this.searchCpf;
    if (!cpfBusca) return;

    let clienteEncontrado: Cliente | undefined;

    const session = this.loginService.sessionInfo();
    if (session?.tipo === 'GERENTE') {
      const gerenteCpf = (session.usuario as any).cpf;
      clienteEncontrado = this.clientesService.consultarClientesDoGerente(gerenteCpf)
        .find(c => c.cpf.replace(/\D/g, '') === cpfBusca.replace(/\D/g, ''));
    } else {
      clienteEncontrado = this.clientesService.consultarCliente(cpfBusca);
    }

    this.cliente = clienteEncontrado ?? null;
  }
}
