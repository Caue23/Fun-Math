import { Injectable } from '@angular/core';
import { Pergunta } from '../models/conteudo.model';

/**
 * Gera exercícios de matemática ALEATÓRIOS para cada tema.
 * Assim a criança nunca vê sempre as mesmas perguntas: a cada quiz
 * (ou ao clicar em "Tentar de novo") novos exercícios são sorteados.
 *
 * Os níveis de dificuldade são pensados para o 3º ano (crianças de 8 anos).
 */
@Injectable({ providedIn: 'root' })
export class GeradorService {
  /** Número inteiro aleatório entre min e max (ambos inclusos) */
  private aleatorio(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** Embaralha um array (Fisher-Yates) */
  private embaralhar<T>(arr: T[]): T[] {
    const copia = [...arr];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = this.aleatorio(0, i);
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  /**
   * Monta uma pergunta de múltipla escolha a partir do enunciado e da
   * resposta correta. Cria 3 "distratores" (respostas erradas plausíveis),
   * embaralha tudo e descobre o índice da resposta certa.
   */
  private montarPergunta(
    id: number,
    enunciado: string,
    correta: number
  ): Pergunta {
    const erradas = new Set<number>();

    // Gera opções erradas próximas do valor certo (mais convincentes)
    let tentativas = 0;
    while (erradas.size < 3 && tentativas < 50) {
      tentativas++;
      const desvio = this.aleatorio(-5, 5);
      const candidato = correta + desvio;
      if (candidato !== correta && candidato >= 0) {
        erradas.add(candidato);
      }
    }
    // Garantia: se não conseguiu 3 distratores, completa com valores simples
    let extra = 1;
    while (erradas.size < 3) {
      const candidato = correta + extra;
      if (candidato !== correta) erradas.add(candidato);
      extra++;
    }

    const valores = this.embaralhar([correta, ...erradas]);
    const opcoes = valores.map((v) => String(v));
    const respostaCorreta = valores.indexOf(correta);

    return { id, enunciado, opcoes, respostaCorreta };
  }

  /**
   * Gera "quantidade" de perguntas aleatórias para o tema (slug) informado.
   */
  gerarPerguntas(slug: string, quantidade = 10): Pergunta[] {
    const perguntas: Pergunta[] = [];

    for (let i = 1; i <= quantidade; i++) {
      perguntas.push(this.gerarUma(slug, i));
    }
    return perguntas;
  }

  /** Gera uma única pergunta conforme o tema */
  private gerarUma(slug: string, id: number): Pergunta {
    switch (slug) {
      case 'adicao': {
        const a = this.aleatorio(2, 50);
        const b = this.aleatorio(2, 50);
        return this.montarPergunta(id, `Quanto é ${a} + ${b}?`, a + b);
      }

      case 'subtracao': {
        // Garante que o resultado não seja negativo
        const maior = this.aleatorio(10, 60);
        const menor = this.aleatorio(1, maior);
        return this.montarPergunta(
          id,
          `Quanto é ${maior} - ${menor}?`,
          maior - menor
        );
      }

      case 'multiplicacao': {
        const a = this.aleatorio(2, 10);
        const b = this.aleatorio(2, 10);
        return this.montarPergunta(id, `Quanto é ${a} × ${b}?`, a * b);
      }

      case 'divisao': {
        // Monta a divisão a partir da multiplicação para dar sempre exata
        const divisor = this.aleatorio(2, 10);
        const quociente = this.aleatorio(1, 10);
        const dividendo = divisor * quociente;
        return this.montarPergunta(
          id,
          `Quanto é ${dividendo} ÷ ${divisor}?`,
          quociente
        );
      }

      case 'tabuada':
      default: {
        const a = this.aleatorio(1, 10);
        const b = this.aleatorio(1, 10);
        return this.montarPergunta(id, `Quanto é ${a} × ${b}?`, a * b);
      }
    }
  }
}
