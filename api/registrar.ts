import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

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

interface CorpoRegistro {
  nome: string;
  tipo: 'quiz' | 'tabuada';
  tema: string;
  acertos: number;
  erros: number;
  total: number;
  data?: string;
}

/**
 * Cria o cliente Redis sob demanda, aceitando as credenciais tanto no padrão
 * Upstash (UPSTASH_REDIS_REST_URL/TOKEN) quanto no padrão KV/Vercel
 * (KV_REST_API_URL/TOKEN). Fica inline para evitar imports relativos entre
 * funções, que quebram no runtime da Vercel.
 */
function obterRedis(): Redis {
  const url =
    process.env['UPSTASH_REDIS_REST_URL'] ?? process.env['KV_REST_API_URL'];
  const token =
    process.env['UPSTASH_REDIS_REST_TOKEN'] ?? process.env['KV_REST_API_TOKEN'];

  if (!url || !token) {
    throw new Error(
      'Credenciais do Redis ausentes. Esperado UPSTASH_REDIS_REST_URL/TOKEN ou KV_REST_API_URL/TOKEN.'
    );
  }

  return new Redis({ url, token });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ erro: 'Use POST' });
    return;
  }

  try {
    const redis = obterRedis();

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
