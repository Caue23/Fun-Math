import { Injectable } from '@angular/core';
import { Tema } from '../models/conteudo.model';

/**
 * Serviço de dados (mock) com os METADADOS de cada tema:
 * título, cor, emoji, descrição e o vídeo da aula.
 *
 * Os exercícios do quiz NÃO ficam aqui: eles são gerados
 * aleatoriamente pelo GeradorService a cada rodada.
 *
 * Os IDs de vídeo do YouTube abaixo são exemplos; troque pelos
 * vídeos que preferir (use apenas o ID que vem depois de "v=").
 */
@Injectable({ providedIn: 'root' })
export class DadosService {
  private readonly temas: Tema[] = [
    {
      slug: 'adicao',
      titulo: 'Adição',
      emoji: '➕',
      cor: '#22c55e',
      descricao: 'Aprenda a juntar os números e somar tudo!',
      videoId: '2o9yZ106bL0',
      passos: [
        {
          icone: '🧱',
          titulo: 'Arme a conta',
          texto:
            'Coloque um número embaixo do outro, alinhando as unidades com as unidades e as dezenas com as dezenas.',
          exemplo: '  23\n+ 15\n----',
        },
        {
          icone: '1️⃣',
          titulo: 'Some as unidades',
          texto: 'Comece pela coluna da direita (unidades) e some os dois números.',
          exemplo: '3 + 5 = 8',
        },
        {
          icone: '🔟',
          titulo: 'Some as dezenas',
          texto: 'Agora some a coluna da esquerda (dezenas).',
          exemplo: '2 + 1 = 3',
        },
        {
          icone: '🎉',
          titulo: 'Pronto!',
          texto: 'Junte os resultados e você tem a resposta final!',
          exemplo: '23 + 15 = 38',
        },
      ],
    },
    {
      slug: 'subtracao',
      titulo: 'Subtração',
      emoji: '➖',
      cor: '#f97316',
      descricao: 'Vamos tirar e descobrir quanto sobra!',
      videoId: 'uwGY7OVNg38',
      passos: [
        {
          icone: '🧱',
          titulo: 'Arme a conta',
          texto:
            'Coloque o número maior em cima e o menor embaixo, alinhando unidades com unidades.',
          exemplo: '  42\n- 17\n----',
        },
        {
          icone: '👀',
          titulo: 'Olhe as unidades',
          texto:
            'Se o número de cima for menor que o de baixo (2 é menor que 7), precisamos pedir emprestado!',
          exemplo: '2 < 7 🤔',
        },
        {
          icone: '🤝',
          titulo: 'Peça emprestado',
          texto:
            'Pegue 1 dezena emprestada. O 2 vira 12 e a dezena de cima diminui 1 (o 4 vira 3).',
          exemplo: '12 - 7 = 5',
        },
        {
          icone: '🔟',
          titulo: 'Subtraia as dezenas',
          texto: 'Agora subtraia as dezenas que sobraram.',
          exemplo: '3 - 1 = 2',
        },
        {
          icone: '🎉',
          titulo: 'Resposta!',
          texto: 'Junte tudo e descubra quanto sobrou.',
          exemplo: '42 - 17 = 25',
        },
      ],
    },
    {
      slug: 'multiplicacao',
      titulo: 'Multiplicação',
      emoji: '✖️',
      cor: '#3b82f6',
      descricao: 'Somar grupos iguais de um jeito mais rápido!',
      videoId: 'Y57ZqzRhnsQ',
      passos: [
        {
          icone: '🍎',
          titulo: 'O que é multiplicar?',
          texto:
            'Multiplicar é somar grupos iguais. 3 × 4 quer dizer "3 grupos de 4".',
          exemplo: '3 × 4',
        },
        {
          icone: '📦',
          titulo: 'Monte os grupos',
          texto: 'Imagine 3 caixinhas, cada uma com 4 maçãs dentro.',
          exemplo: '🍎🍎🍎🍎 ×3',
        },
        {
          icone: '➕',
          titulo: 'Some tudo',
          texto: 'Agora é só somar os grupos: 4 + 4 + 4.',
          exemplo: '4 + 4 + 4 = 12',
        },
        {
          icone: '🎉',
          titulo: 'Pronto!',
          texto: 'Esse é o resultado da multiplicação. Mais rápido que somar!',
          exemplo: '3 × 4 = 12',
        },
      ],
    },
    {
      slug: 'divisao',
      titulo: 'Divisão',
      emoji: '➗',
      cor: '#a855f7',
      descricao: 'Vamos repartir tudo em partes iguais!',
      videoId: 'cfbQnJNmsLI',
      passos: [
        {
          icone: '🍬',
          titulo: 'O que é dividir?',
          texto:
            'Dividir é repartir uma quantidade em partes iguais. 12 ÷ 3 quer dizer "repartir 12 em 3 partes".',
          exemplo: '12 ÷ 3',
        },
        {
          icone: '🧒',
          titulo: 'Quem vai receber?',
          texto: 'Imagine 12 balas para dividir igualzinho entre 3 amigos.',
          exemplo: '🧒🧒🧒',
        },
        {
          icone: '🤲',
          titulo: 'Reparta igual',
          texto: 'Dê uma bala para cada amigo, de novo e de novo, até acabar.',
          exemplo: '4 para cada um',
        },
        {
          icone: '🎉',
          titulo: 'Resposta!',
          texto: 'Cada amigo ficou com a mesma quantidade. Esse é o resultado!',
          exemplo: '12 ÷ 3 = 4',
        },
      ],
    },
    {
      slug: 'tabuada',
      titulo: 'Tabuada (1 a 10)',
      emoji: '🔢',
      cor: '#ec4899',
      descricao: 'Treine a tabuada do 1 ao 10 e fique craque!',
      videoId: 'n9Q47CF04qc',
      passos: [
        {
          icone: '📖',
          titulo: 'O que é a tabuada?',
          texto:
            'A tabuada é a lista das multiplicações de um número. A do 2 é 2×1, 2×2, 2×3...',
          exemplo: '2 × 1 = 2',
        },
        {
          icone: '🪜',
          titulo: 'Vá de pulinho',
          texto:
            'Cada linha pula de tantos em tantos. Na tabuada do 2, vai somando 2: 2, 4, 6, 8...',
          exemplo: '2, 4, 6, 8, 10',
        },
        {
          icone: '🔁',
          titulo: 'A ordem não muda',
          texto: 'Dica de ouro: 3 × 4 dá o mesmo que 4 × 3. Isso ajuda a decorar!',
          exemplo: '3 × 4 = 4 × 3',
        },
        {
          icone: '🏆',
          titulo: 'Treine todo dia',
          texto:
            'Repetir um pouquinho por dia faz você ficar craque. Use o quiz e a tabela para treinar!',
          exemplo: '',
        },
      ],
    },
  ];

  /** Retorna todos os temas (para o menu da home) */
  listarTemas(): Tema[] {
    return this.temas;
  }

  /** Busca um tema pelo slug da rota. Retorna undefined se não existir. */
  obterTema(slug: string): Tema | undefined {
    return this.temas.find((t) => t.slug === slug);
  }
}
