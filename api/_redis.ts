import { Redis } from '@upstash/redis';

/**
 * Cria o cliente Redis (Upstash) de forma tolerante aos nomes de variáveis.
 *
 * A integração do Upstash na Vercel pode criar as credenciais com nomes
 * diferentes dependendo de como o banco foi conectado:
 *   - Padrão Upstash:  UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *   - Padrão KV/Vercel: KV_REST_API_URL / KV_REST_API_TOKEN
 *
 * Este helper usa o primeiro par disponível, evitando depender de um
 * nome específico (como faria Redis.fromEnv()).
 */
export function criarRedis(): Redis {
  const url =
    process.env['UPSTASH_REDIS_REST_URL'] ?? process.env['KV_REST_API_URL'];
  const token =
    process.env['UPSTASH_REDIS_REST_TOKEN'] ?? process.env['KV_REST_API_TOKEN'];

  if (!url || !token) {
    throw new Error(
      'Credenciais do Redis ausentes: defina UPSTASH_REDIS_REST_URL/TOKEN ou KV_REST_API_URL/TOKEN.'
    );
  }

  return new Redis({ url, token });
}
