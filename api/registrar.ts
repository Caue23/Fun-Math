import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarRedis } from './_redis';

/**
 * Serverless Function da Vercel.
 * Recebe um resultado de atividade e salva na nuvem (Upstash Redis).
 *
 * Rota: POST /api/registrar
 * Corpo (JSON): { nome, tipo, tema, acertos, erros, total, data }
 *
 * Os dados de cada aluno ficam numa lista Redis na chave "aluno:<nome>".
 * Um "set" (chave "alunos") guarda os nomes de todos os alunos.
 */

// As variáveis de ambiente são injetadas pela Vercel ao conectar o Upstash.
const redis = criarRedis();

interface CorpoRegistro {
  nome: string;
  tipo: 'quiz' | 'tabuada';
  tema: string;
  acertos: number;
  erros: number;
  total: number;
  data?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ erro: 'Use POST' });
    return;
  }

  try {
    const corpo: CorpoRegistro =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const nome = (corpo?.nome ?? '').trim();
    if (!nome) {
      res.status(400).json({ erro: 'Nome é obrigatório' });
      return;
    }

    const registro = {
      data: corpo.data ?? new Date().toISOString(),
      tipo: corpo.tipo,
      tema: corpo.tema,
      acertos: Number(corpo.acertos) || 0,
      erros: Number(corpo.erros) || 0,
      total: Number(corpo.total) || 0,
    };

    // guarda o nome no conjunto de alunos e o registro na lista do aluno
    await redis.sadd('alunos', nome);
    await redis.rpush(`aluno:${nome}`, JSON.stringify(registro));

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ erro: 'Falha ao salvar', detalhe: String(e) });
  }
}
