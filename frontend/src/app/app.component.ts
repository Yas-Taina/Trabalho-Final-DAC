import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { LocalInicializacaoService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  readonly InicializacaoService: LocalInicializacaoService = inject(LocalInicializacaoService);

  constructor() {
    this.InicializacaoService.inicializarBanco().subscribe({
      next: (res) => {
        console.log('Banco inicializado', res);
      },
      error: (err) => {
        console.error('Erro ao inicializar o banco', err);
      }
    });
  }
}
