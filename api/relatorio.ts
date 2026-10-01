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

interface Registro {
  data: string;
  tipo: 'quiz' | 'tabuada';
  tema: string;
  acertos: number;
  erros: number;
  total: number;
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

/** Lê e normaliza a lista de registros de um aluno */
async function lerRegistros(redis: Redis, nome: string): Promise<Registro[]> {
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
    const redis = obterRedis();

    const nomeFiltro = (req.query?.nome ?? '').toString().trim();

    const nomes = nomeFiltro ? [nomeFiltro] : await redis.smembers('alunos');

    const alunos = [];
    for (const nome of nomes) {
      const registros = await lerRegistros(redis, nome);
      alunos.push({ nome, criadoEm: '', registros });
    }

    // evita cache para sempre trazer o dado mais recente
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ alunos });
  } catch (e) {
    res.status(500).json({ erro: 'Falha ao ler', detalhe: String(e) });
  }
}
