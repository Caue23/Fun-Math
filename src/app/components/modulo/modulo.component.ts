import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DadosService } from '../../services/dados.service';
import { Tema } from '../../models/conteudo.model';

@Component({
  selector: 'app-modulo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modulo.component.html',
  styleUrl: './modulo.component.scss',
})
export class ModuloComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dados = inject(DadosService);
  private readonly sanitizer = inject(DomSanitizer);

  tema?: Tema;
  /** URL já "sanitizada" para ser usada com segurança no [src] do iframe */
  videoUrl?: SafeResourceUrl;

  /** só libera o quiz depois que a criança confirma que leu a explicação */
  explicacaoLida = false;

  ngOnInit(): void {
    // Reage a mudanças de parâmetro na rota (ex.: navegar de um tema para outro)
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('tema') ?? '';
      this.tema = this.dados.obterTema(slug);

      if (!this.tema) {
        // Tema inexistente -> volta ao menu
        this.router.navigate(['/']);
        return;
      }

      // Ao abrir (ou trocar de) tema, a explicação precisa ser lida de novo
      this.explicacaoLida = false;

      // Monta a URL de embed e marca como segura via DomSanitizer
      const url = `https://www.youtube.com/embed/${this.tema.videoId}`;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  marcarComoLido(): void {
    this.explicacaoLida = true;
  }

  irParaQuiz(): void {
    if (this.tema) {
      this.router.navigate(['/quiz', this.tema.slug]);
    }
  }

  irParaTabuadaCompleta(): void {
    this.router.navigate(['/tabuada']);
  }

  voltarHome(): void {
    this.router.navigate(['/menu']);
  }
}
