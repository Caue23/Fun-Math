import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

/**
 * Serverless Function da Vercel.
 * Devolve o histórico de todos os alunos (para a tela dos pais).
 *
 * Rota: GET /api/relatorio
 * Resposta (JSON): { alunos: [ { nome, criadoEm, registros: [...] } ] }
 *
 * Opcional: GET /api/relatorio?nome=Fulano para um aluno só.
 */

const redis = Redis.fromEnv();

interface Registro {
  data: string;
  tipo: 'quiz' | 'tabuada';
  tema: string;
  acertos: number;
  erros: number;
  total: number;
}

/** Lê e normaliza a lista de registros de um aluno */
async function lerRegistros(nome: string): Promise<Registro[]> {
  const brutos = await redis.lrange<unknown>(`aluno:${nome}`, 0, -1);
  return brutos.map((item) =>
    // o Upstash pode devolver objeto já parseado ou string
    typeof item === 'string' ? (JSON.parse(item) as Registro) : (item as Registro)
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ erro: 'Use GET' });
    return;
  }

  try {
    const nomeFiltro = (req.query?.nome ?? '').toString().trim();

    const nomes = nomeFiltro
      ? [nomeFiltro]
      : await redis.smembers('alunos');

    const alunos = [];
    for (const nome of nomes) {
      const registros = await lerRegistros(nome);
      alunos.push({ nome, criadoEm: '', registros });
    }

    // evita cache para sempre trazer o dado mais recente
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ alunos });
  } catch (e) {
    res.status(500).json({ erro: 'Falha ao ler', detalhe: String(e) });
  }
}
