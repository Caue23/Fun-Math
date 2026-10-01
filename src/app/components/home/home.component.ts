import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DadosService } from '../../services/dados.service';
import { ProgressoService } from '../../services/progresso.service';
import { Tema } from '../../models/conteudo.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly dados = inject(DadosService);
  private readonly progresso = inject(ProgressoService);
  private readonly router = inject(Router);

  temas: Tema[] = this.dados.listarTemas();
  nomeAluno: string = this.progresso.obterNomeAtual() ?? '';

  abrirModulo(tema: Tema): void {
    this.router.navigate(['/modulo', tema.slug]);
  }

  trocarAluno(): void {
    this.progresso.sair();
    this.router.navigate(['/']);
  }
}
