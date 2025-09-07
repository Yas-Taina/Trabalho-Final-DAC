import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-editar-gerentes',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxMaskDirective],
  templateUrl: './editar-gerentes.component.html',
  styleUrl: './editar-gerentes.component.css'
})
export class EditarGerentesComponent {

}
