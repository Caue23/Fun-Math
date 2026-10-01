/** Resultado de uma rodada (quiz ou tabuada) feita por um aluno */
export interface Registro {
  /** data/hora em ISO (ex.: 2026-10-01T14:30:00.000Z) */
  data: string;
  /** tipo da atividade */
  tipo: 'quiz' | 'tabuada';
  /** tema estudado (slug): adicao, subtracao, ... ou "tabuada" */
  tema: string;
  acertos: number;
  erros: number;
  total: number;
}

/** Dados de um aluno, com todo o histórico de atividades */
export interface Aluno {
  nome: string;
  /** data de criação do perfil (ISO) */
  criadoEm: string;
  registros: Registro[];
}
