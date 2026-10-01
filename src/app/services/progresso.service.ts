import { Injectable } from '@angular/core';
import { Aluno, Registro } from '../models/progresso.model';

/**
 * Gerencia o progresso do aluno.
 *
 * - A IDENTIDADE (quem está usando o app agora) fica no localStorage,
 *   pois é específica de cada dispositivo.
 * - O HISTÓRICO de acertos/erros vai para a NUVEM (Serverless Functions
 *   da Vercel + Upstash Redis), para você poder ver de qualquer navegador
 *   na tela dos pais.
 *
 * As APIs usadas:
 *   POST /api/registrar  -> salva um resultado
 *   GET  /api/relatorio  -> lista todos os alunos e históricos
 *   POST /api/limpar     -> apaga o histórico de um aluno
 */
@Injectable({ providedIn: 'root' })
export class ProgressoService {
  private readonly CHAVE_ATUAL = 'reforco_aluno_atual';

  // ----- Identidade local (localStorage) -----

  private ler<T>(chave: string, padrao: T): T {
    try {
      const bruto = localStorage.getItem(chave);
      return bruto ? (JSON.parse(bruto) as T) : padrao;
    } catch {
      return padrao;
    }
  }

  private salvar(chave: string, valor: unknown): void {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      /* ignora se o navegador bloquear */
    }
  }

  /** Nome do aluno que está usando o app agora (ou null) */
  obterNomeAtual(): string | null {
    return this.ler<string | null>(this.CHAVE_ATUAL, null);
  }

  temAlunoAtual(): boolean {
    return !!this.obterNomeAtual();
  }

  /** Define o aluno atual neste dispositivo */
  definirAluno(nome: string): void {
    const limpo = nome.trim();
    if (!limpo) return;
    this.salvar(this.CHAVE_ATUAL, limpo);
  }

  /** "Sair": esquece quem está usando agora */
  sair(): void {
    this.salvar(this.CHAVE_ATUAL, null);
  }

  // ----- Histórico na nuvem (APIs) -----

  /**
   * Registra o resultado de uma atividade do aluno atual na nuvem.
   * Falha de rede não quebra a experiência da criança (apenas loga).
   */
  async registrarResultado(
    tipo: Registro['tipo'],
    tema: string,
    acertos: number,
    total: number
  ): Promise<void> {
    const nome = this.obterNomeAtual();
    if (!nome) return;

    const corpo = {
      nome,
      tipo,
      tema,
      acertos,
      erros: Math.max(0, total - acertos),
      total,
      data: new Date().toISOString(),
    };

    try {
      await fetch('/api/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      });
    } catch (e) {
      // Sem internet? Não trava o app; o resultado só não é salvo.
      console.warn('Não foi possível salvar o progresso na nuvem:', e);
    }
  }

  /** Busca o relatório completo (todos os alunos) da nuvem */
  async obterRelatorio(): Promise<Aluno[]> {
    try {
      const resp = await fetch('/api/relatorio');
      if (!resp.ok) return [];
      const dados = (await resp.json()) as { alunos: Aluno[] };
      return (dados.alunos ?? []).sort((a, b) => a.nome.localeCompare(b.nome));
    } catch (e) {
      console.warn('Não foi possível carregar o relatório:', e);
      return [];
    }
  }

  /** Apaga o histórico de um aluno na nuvem */
  async limparHistorico(nome: string): Promise<void> {
    try {
      await fetch('/api/limpar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });
    } catch (e) {
      console.warn('Não foi possível limpar o histórico:', e);
    }
  }
}
