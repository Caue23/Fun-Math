import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProgressoService } from '../../services/progresso.service';

/** Uma célula da tabuada que a criança precisa preencher */
interface Celula {
  a: number;
  b: number;
  resposta: number;
  /** o que a criança digitou (null = em branco) */
  valor: number | null;
}

@Component({
  selector: 'app-tabuada',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabuada.component.html',
  styleUrl: './tabuada.component.scss',
})
export class TabuadaComponent {
  private readonly router = inject(Router);
  private readonly progresso = inject(ProgressoService);

  /** número da tabuada escolhida (1 a 10) ou 'todas' para a tabela completa */
  tabelaSelecionada: number | 'todas' = 1;

  /** células exibidas atualmente */
  celulas: Celula[] = [];

  enviado = false;
  acertos = 0;

  readonly numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor() {
    this.gerarTabela();
  }

  /** (Re)monta a lista de células conforme a seleção */
  gerarTabela(): void {
    this.enviado = false;
    this.acertos = 0;
    this.celulas = [];

    if (this.tabelaSelecionada === 'todas') {
      // Tabela completa: 1 a 10 multiplicando por 1 a 10 (100 células)
      for (const a of this.numeros) {
        for (const b of this.numeros) {
          this.celulas.push({ a, b, resposta: a * b, valor: null });
        }
      }
    } else {
      const a = this.tabelaSelecionada;
      for (const b of this.numeros) {
        this.celulas.push({ a, b, resposta: a * b, valor: null });
      }
    }
  }

  selecionar(valor: number | 'todas'): void {
    this.tabelaSelecionada = valor;
    this.gerarTabela();
  }

  corrigir(): void {
    this.acertos = this.celulas.reduce(
      (total, c) => total + (c.valor === c.resposta ? 1 : 0),
      0
    );
    this.enviado = true;

    // Guarda o desempenho no histórico do aluno (localStorage)
    this.progresso.registrarResultado(
      'tabuada',
      'tabuada',
      this.acertos,
      this.total
    );
  }

  limpar(): void {
    this.gerarTabela();
  }

  acertou(c: Celula): boolean {
    return c.valor === c.resposta;
  }

  voltarHome(): void {
    this.router.navigate(['/menu']);
  }

  get total(): number {
    return this.celulas.length;
  }

  /** true quando é a tabela completa (muda o layout em grade) */
  get modoCompleto(): boolean {
    return this.tabelaSelecionada === 'todas';
  }

  get mensagemFinal(): string {
    if (this.acertos === this.total) {
      return 'UAU! Você acertou tudo! Mestre da tabuada! 🏆';
    }
    if (this.acertos >= this.total / 2) {
      return 'Muito bom! Confira as que erraram e tente de novo. 💪';
    }
    return 'Vamos treinar mais um pouquinho, você consegue! 😉';
  }
}
