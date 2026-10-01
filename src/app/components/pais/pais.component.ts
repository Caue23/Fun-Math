import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressoService } from '../../services/progresso.service';
import { Aluno, Registro } from '../../models/progresso.model';

/** Resumo agregado por tema */
interface ResumoTema {
  tema: string;
  rotulo: string;
  emoji: string;
  atividades: number;
  acertos: number;
  erros: number;
  total: number;
  percentual: number;
}

@Component({
  selector: 'app-pais',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pais.component.html',
  styleUrl: './pais.component.scss',
})
export class PaisComponent implements OnInit {
  private readonly progresso = inject(ProgressoService);
  private readonly router = inject(Router);

  /** rótulos amigáveis por slug de tema */
  private readonly rotulos: Record<string, { nome: string; emoji: string }> = {
    adicao: { nome: 'Adição', emoji: '➕' },
    subtracao: { nome: 'Subtração', emoji: '➖' },
    multiplicacao: { nome: 'Multiplicação', emoji: '✖️' },
    divisao: { nome: 'Divisão', emoji: '➗' },
    tabuada: { nome: 'Tabuada', emoji: '🔢' },
  };

  // --- login simples da área dos pais ---
  private readonly USUARIO = 'pais';
  private readonly SENHA = 'pais1234';
  liberado = false;
  usuario = '';
  senha = '';
  erroTrava = false;

  alunos: Aluno[] = [];
  alunoSelecionado?: Aluno;

  resumo: ResumoTema[] = [];
  historico: Registro[] = [];

  /** indica que os dados da nuvem estão sendo buscados */
  carregando = false;

  ngOnInit(): void {
    // nada a preparar; o login é exibido primeiro
  }

  /** Busca os dados da nuvem (chamado após destravar) */
  private async carregarDados(): Promise<void> {
    this.carregando = true;
    this.alunos = await this.progresso.obterRelatorio();
    const atual = this.progresso.obterNomeAtual();
    this.alunoSelecionado =
      this.alunos.find((a) => a.nome === atual) ?? this.alunos[0];
    this.recalcular();
    this.carregando = false;
  }

  entrar(): void {
    if (
      this.usuario.trim().toLowerCase() === this.USUARIO &&
      this.senha === this.SENHA
    ) {
      this.liberado = true;
      this.erroTrava = false;
      this.senha = '';
      void this.carregarDados();
    } else {
      this.erroTrava = true;
      this.senha = '';
    }
  }

  selecionarAluno(nome: string): void {
    this.alunoSelecionado = this.alunos.find((a) => a.nome === nome);
    this.recalcular();
  }

  /** Agrega os registros do aluno selecionado por tema */
  private recalcular(): void {
    const aluno = this.alunoSelecionado;
    if (!aluno) {
      this.resumo = [];
      this.historico = [];
      return;
    }

    const mapa = new Map<string, ResumoTema>();
    for (const r of aluno.registros) {
      const info = this.rotulos[r.tema] ?? { nome: r.tema, emoji: '📘' };
      const atual =
        mapa.get(r.tema) ??
        ({
          tema: r.tema,
          rotulo: info.nome,
          emoji: info.emoji,
          atividades: 0,
          acertos: 0,
          erros: 0,
          total: 0,
          percentual: 0,
        } as ResumoTema);

      atual.atividades += 1;
      atual.acertos += r.acertos;
      atual.erros += r.erros;
      atual.total += r.total;
      mapa.set(r.tema, atual);
    }

    this.resumo = Array.from(mapa.values()).map((item) => ({
      ...item,
      percentual:
        item.total > 0 ? Math.round((item.acertos / item.total) * 100) : 0,
    }));

    // histórico mais recente primeiro (últimos 20)
    this.historico = [...aluno.registros]
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, 20);
  }

  recarregar(): void {
    void this.carregarDados();
  }

  rotuloTema(slug: string): string {
    return this.rotulos[slug]?.nome ?? slug;
  }

  emojiTema(slug: string): string {
    return this.rotulos[slug]?.emoji ?? '📘';
  }

  async limpar(): Promise<void> {
    if (!this.alunoSelecionado) return;
    const ok = confirm(
      `Apagar todo o histórico de ${this.alunoSelecionado.nome}? Esta ação não pode ser desfeita.`
    );
    if (!ok) return;
    await this.progresso.limparHistorico(this.alunoSelecionado.nome);
    // recarrega os dados da nuvem
    await this.carregarDados();
  }

  // Totais gerais do aluno selecionado
  get totalAcertos(): number {
    return this.resumo.reduce((s, r) => s + r.acertos, 0);
  }
  get totalErros(): number {
    return this.resumo.reduce((s, r) => s + r.erros, 0);
  }
  get totalAtividades(): number {
    return this.resumo.reduce((s, r) => s + r.atividades, 0);
  }
  get percentualGeral(): number {
    const tot = this.totalAcertos + this.totalErros;
    return tot > 0 ? Math.round((this.totalAcertos / tot) * 100) : 0;
  }

  sair(): void {
    this.router.navigate(['/menu']);
  }
}
