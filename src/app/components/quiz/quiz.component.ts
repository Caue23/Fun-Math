import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DadosService } from '../../services/dados.service';
import { GeradorService } from '../../services/gerador.service';
import { ProgressoService } from '../../services/progresso.service';
import { Pergunta, Tema } from '../../models/conteudo.model';

/** Quantas perguntas por rodada de quiz */
const PERGUNTAS_POR_RODADA = 10;

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export class QuizComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dados = inject(DadosService);
  private readonly gerador = inject(GeradorService);
  private readonly progresso = inject(ProgressoService);
  private readonly fb = inject(FormBuilder);

  tema?: Tema;
  form!: FormGroup;

  /** Perguntas sorteadas para a rodada atual (aleatórias) */
  perguntas: Pergunta[] = [];

  /** true depois que a criança clica em "Enviar Respostas" */
  enviado = false;
  acertos = 0;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('tema') ?? '';
      this.tema = this.dados.obterTema(slug);

      if (!this.tema) {
        this.router.navigate(['/']);
        return;
      }

      this.novaRodada();
    });
  }

  /** Sorteia novas perguntas e remonta o formulário do zero */
  private novaRodada(): void {
    if (!this.tema) return;
    this.perguntas = this.gerador.gerarPerguntas(
      this.tema.slug,
      PERGUNTAS_POR_RODADA
    );
    this.montarFormulario(this.perguntas);
  }

  /** Cria um controle obrigatório para cada pergunta */
  private montarFormulario(perguntas: Pergunta[]): void {
    const grupo: Record<string, unknown> = {};
    for (const p of perguntas) {
      grupo['pergunta_' + p.id] = [null, Validators.required];
    }
    this.form = this.fb.group(grupo);
    this.enviado = false;
    this.acertos = 0;
  }

  /** Resposta marcada pela criança para uma pergunta (ou null) */
  respostaDaCrianca(perguntaId: number): number | null {
    return this.form.get('pergunta_' + perguntaId)?.value ?? null;
  }

  /** Diz se a resposta marcada está correta (só faz sentido após enviar) */
  acertou(pergunta: Pergunta): boolean {
    return this.respostaDaCrianca(pergunta.id) === pergunta.respostaCorreta;
  }

  enviarRespostas(): void {
    if (!this.tema || this.form.invalid) {
      // Marca os campos para mostrar o aviso de "responda todas"
      this.form.markAllAsTouched();
      return;
    }

    this.acertos = this.perguntas.reduce(
      (total, p) => total + (this.acertou(p) ? 1 : 0),
      0
    );
    this.enviado = true;

    // Guarda o desempenho no histórico do aluno (localStorage)
    this.progresso.registrarResultado(
      'quiz',
      this.tema.slug,
      this.acertos,
      this.totalPerguntas
    );
  }

  /** "Tentar de novo" sorteia perguntas NOVAS (não repete as anteriores) */
  refazer(): void {
    this.novaRodada();
  }

  voltarHome(): void {
    this.router.navigate(['/menu']);
  }

  get totalPerguntas(): number {
    return this.perguntas.length;
  }

  /** Mensagem final de incentivo conforme o desempenho */
  get mensagemFinal(): string {
    if (this.acertos === this.totalPerguntas) {
      return 'Perfeito! Você é um gênio da matemática! 🏆';
    }
    if (this.acertos >= this.totalPerguntas / 2) {
      return 'Muito bem! Está quase lá! 💪';
    }
    return 'Não desista! Assista a aula de novo e tente outra vez. 😉';
  }
}
