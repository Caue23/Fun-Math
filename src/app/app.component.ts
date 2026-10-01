import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="topo">
      <span class="topo__logo">🧮 Matemática Divertida</span>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .topo {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
        padding: 14px 20px;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
        position: sticky;
        top: 0;
        z-index: 10;
      }
      .topo__logo {
        font-size: 1.3rem;
        font-weight: 800;
        letter-spacing: 0.5px;
      }
      main {
        display: block;
      }
      @media (max-width: 600px) {
        .topo {
          padding: 12px 14px;
        }
        .topo__logo {
          font-size: 1.1rem;
        }
      }
    `,
  ],
})
export class AppComponent {}
