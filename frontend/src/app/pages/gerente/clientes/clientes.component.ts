import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { LocalClientesService } from '../../../services'
import { LocalLoginService } from '../../../services'
import { Cliente } from '../../../services/local/models/cliente'
import { NgxMaskDirective } from 'ngx-mask'

@Component({
  selector: 'app-clientesmanager',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesManagerComponent {
  clientes: any[] = []
  clientesFiltrados: any[] = []
  searchType: string = ''
  search: string = ''

  constructor(
    private clientesService: LocalClientesService,
    private loginService: LocalLoginService
  ) {}

  ngOnInit(): void {
    this.carregarClientes()
  }

  carregarClientes(): void {
  const session = this.loginService.sessionInfo()
  if (!session || session.tipo !== 'GERENTE') {
    this.clientes = []
    this.clientesFiltrados = []
    return
  }

  const gerenteCpf = (session.usuario as any).cpf as string
  const lista: Cliente[] = this.clientesService.consultarClientesDoGerente(gerenteCpf)
  this.clientes = lista.map(c => ({
    cpf: c.cpf,
    nome: c.nome,
    email: c.email,
    endereco: c.endereco,
    conta: c.dadosConta?.numero,
    saldo: c.dadosConta?.saldo,
    limite: c.dadosConta?.limite,
    gerenteCpf: c.gerenteCpf
  }))
  this.clientesFiltrados = [...this.clientes]
}


  aplicarFiltro(): void {
    if (!this.searchType || !this.search) {
      this.clientesFiltrados = [...this.clientes]
      return
    }
    const termo = this.search.toLowerCase()
    this.clientesFiltrados = this.clientes.filter(c => {
      if (this.searchType === 'nome') return c.nome.toLowerCase().includes(termo)
      if (this.searchType === 'cpf') return c.cpf.toLowerCase().includes(termo)
      return true
    })
  }
}
