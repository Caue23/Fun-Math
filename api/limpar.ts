import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

/**
 * Serverless Function da Vercel.
 * Apaga o histórico de um aluno (e o remove da lista de alunos).
 *
 * Rota: POST /api/limpar  { nome }
 */

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

    const corpo = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const nome = (corpo?.nome ?? '').trim();
    if (!nome) {
      res.status(400).json({ erro: 'Nome é obrigatório' });
      return;
    }

    await redis.del(`aluno:${nome}`);
    await redis.srem('alunos', nome);

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ erro: 'Falha ao limpar', detalhe: String(e) });
  }
}
