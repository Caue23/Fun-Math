import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarRedis } from './_redis';

/**
 * Serverless Function da Vercel.
 * Apaga o histórico de um aluno (e o remove da lista de alunos).
 *
 * Rota: POST /api/limpar  { nome }
 */

const redis = criarRedis();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ erro: 'Use POST' });
    return;
  }

  try {
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
