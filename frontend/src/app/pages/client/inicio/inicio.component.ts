import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ContaResponse } from '../../../services';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioClientComponent {
  constructor(private router: Router){}
  conta: ContaResponse = {
    saldo: 9999.99,
  }
}
