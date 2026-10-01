/** Uma pergunta de múltipla escolha do quiz */
export interface Pergunta {
  id: number;
  enunciado: string;
  opcoes: string[];
  /** índice (0-based) da opção correta dentro de "opcoes" */
  respostaCorreta: number;
}

/** Um passo da explicação "passo a passo" (card do infográfico) */
export interface Passo {
  /** emoji/ícone grande do card */
  icone: string;
  titulo: string;
  /** texto curto e lúdico explicando o passo */
  texto: string;
  /** exemplo visual opcional (ex.: "23 + 15 = 38") */
  exemplo?: string;
}

/** Um tema de estudo (ex.: adição, subtração...) */
export interface Tema {
  /** usado na rota, ex.: "adicao" */
  slug: string;
  titulo: string;
  emoji: string;
  cor: string;
  descricao: string;
  /** ID do vídeo do YouTube (apenas o ID, não a URL completa) */
  videoId: string;
  /**
   * Perguntas fixas (opcional). Hoje os exercícios são gerados
   * aleatoriamente pelo GeradorService, mas o campo fica disponível
   * caso queira cadastrar perguntas manuais no futuro.
   */
  perguntas?: Pergunta[];
  /** Explicação passo a passo exibida no módulo (cards do infográfico) */
  passos: Passo[];
}
