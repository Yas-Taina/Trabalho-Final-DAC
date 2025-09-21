import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ContaResponse } from '../../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioClientComponent {
  constructor(private router: Router){}
  conta: ContaResponse = {
    saldo: 9999.99,
  }
}
