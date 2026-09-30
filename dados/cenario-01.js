// Cenário 1: a véspera da entrega.
//
// A razão do Tomás é sorteada em cada partida (ver "verdades"). As palavras dele são
// quase sempre as mesmas, o que muda é a linguagem corporal. Os nós com "variantes"
// substituem campos conforme a verdade sorteada.
//
// Cada opção tem:
//   tipo      colaborar | competir | ceder | evitar | leitura | reacao
//   postura   assertiva | agressiva | passiva | passivo-agressiva (revelada no fim)
//   reage     como o Tomás reage: abre | justifica | defende | afasta | nada (usado nas previsões)
//   ouviu     como o Tomás ouviu a resposta (feedback descritivo, não avaliativo)
//   efeitos   variação dos medidores
//   requer    euMax: desfocada acima desta raiva · euMin: só aparece a partir desta raiva
//
// "pensamentos" é a voz interior depois da fala do Tomás, por banda da tua raiva
// (calmo ≤ 3, tenso ≤ 6, quente ≥ 7).
window.CENARIOS = window.CENARIOS || {};

window.CENARIOS.grupo = {
  id: 'grupo',
  numero: 1,
  titulo: 'A véspera da entrega',
  resumo: 'Um colega de grupo que não fez a parte dele.',
  outro: 'Tomás',
  pronome: 'ele',
  artigos: { o: 'o', ao: 'ao', do: 'do', no: 'no' },
  momentoLeitura: 'Quando o Tomás disse «umas semanas complicadas»',
  emocoes: ['Raiva', 'Frustração', 'Medo de chumbar', 'Desrespeito', 'Cansaço'],
  cena: {
    local: 'sala',
    outro: { pele: '#b9784f', camisola: '#6bd475', cabelo: '#3b2314', cabeloTipo: 'curto' },
    aderecos: { eu: 'portatil', outro: 'caneca' }
  },
  gatilhos: {
    'injustiça': 'O primeiro gatilho da tua raiva foi a sensação de injustiça: fizeste a tua parte e ele não. É um dos gatilhos de raiva mais fortes, porque junta um prejuízo a alguém que podia ter agido de outra forma.',
    'ameaça': 'O primeiro gatilho da tua raiva foi a ameaça à tua nota. Aqui a raiva vem misturada com medo, e o medo tende a procurar um culpado depressa.',
    'desrespeito': 'O primeiro gatilho da tua raiva foi o desrespeito: ele nem avisou. A raiva, neste caso, é sobre não ter sido tido em conta.',
    'curiosidade': 'Começaste por te perguntar o que teria acontecido, sem concluir logo porquê. Isso deixou mais respostas ao teu alcance no início da conversa.',
    'evitamento': 'Começaste por afastar o problema. A raiva inicial foi baixa, mas o problema ficou por falar.'
  },
  verdades: ['trabalho', 'desinteresse'],
  descricaoVerdade: {
    trabalho: 'o Tomás tinha começado a trabalhar à noite num restaurante',
    desinteresse: 'o Tomás tinha perdido o interesse pelo projeto'
  },
  inicial: { eu: 2, outro: 2, relacao: 5 },
  explosao: 'fim_explosao',
  reacaoPausa: 'Estás bem? Estás a olhar para o vazio há um bocado.',
  distanciamento: 'Vista de fora, a cena é esta: duas pessoas cansadas às onze da noite, uma secção por escrever, e ainda ninguém sabe porquê.',
  introducao: 'Projeto de grupo de Desenvolvimento de Jogos. A entrega é amanhã às 9h. O Tomás ficou com a secção dos testes com jogadores.',

  nos: {
    inicio: {
      hora: '23:10',
      ausente: true,
      exprEu: 'preocupado',
      narracao: 'Faltam dez horas para a entrega. No documento partilhado, a secção do Tomás está em branco. Ninguém avisou.',
      pergunta: 'O que se passa contigo neste momento?',
      nota: 'Não há resposta certa. A opção mais próxima do que costuma acontecer contigo.',
      opcoes: [
        { texto: 'Não é justo. Eu fiz a minha parte e ele não fez a dele.', tipo: 'reacao', lente: 'injustiça', efeitos: { eu: 1 }, vai: 'chegada' },
        { texto: 'Vou chumbar por causa dele. O ano todo em risco por uma secção.', tipo: 'reacao', lente: 'ameaça', efeitos: { eu: 1 }, vai: 'chegada' },
        { texto: 'Nem se deu ao trabalho de avisar.', tipo: 'reacao', lente: 'desrespeito', efeitos: { eu: 1 }, vai: 'chegada' },
        { texto: 'O que terá acontecido? Será que ainda vai preencher?', tipo: 'reacao', lente: 'curiosidade', efeitos: {}, vai: 'chegada' },
        { texto: 'Prefiro fazer eu do que estar neste stress.', tipo: 'reacao', lente: 'evitamento', efeitos: {}, vai: 'chegada' }
      ]
    },

    chegada: {
      hora: '23:12',
      expr: 'calmo',
      narracao: 'O Tomás entra na sala de estudo.',
      fala: 'Olá!',
      pensamentos: {
        calmo: 'Parece tranquilo. Se calhar nem sabe que a parte dele está em branco.',
        tenso: 'Tão tranquilo. Como é que é possível?',
        quente: 'Está a gozar comigo.'
      },
      opcoes: [
        { texto: '«Olá. Estive a ver o documento e a parte dos testes ainda não está lá. O que se passou?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'uma pergunta, sem acusação', efeitos: { outro: 1 }, vai: 'pergunta' },
        { texto: '«Só agora? A tua parte está vazia!»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma acusação', efeitos: { eu: 1, outro: 2, relacao: -1 }, vai: 'defensivo' },
        { texto: '«Olá.»', tipo: 'evitar', postura: 'passiva', reage: 'nada', ouviu: 'que está tudo bem', efeitos: { adiado: 1 }, vai: 'evitar1' },
        { texto: '«Estás a gozar comigo? Só faltam dez horas e ainda não temos nada da tua parte!»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'um ataque pessoal', requer: { euMin: 3 }, efeitos: { eu: 1, outro: 2, relacao: -2 }, vai: 'defensivo' },
        { texto: '«Isto está a deixar-me com muita raiva, Tomás. A tua parte está em branco e a entrega é amanhã. Preciso de perceber o que se passou. Se não conseguirmos resolver isto esta noite, vou ter de avisar o professor.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva dirigida ao problema, e um limite', requer: { euMin: 3 }, efeitos: { eu: -1, outro: 1 }, vai: 'pergunta' }
      ]
    },

    defensivo: {
      entrada: { eu: 1 },
      hora: '23:14',
      expr: 'zangado',
      narracao: 'O Tomás cruza os braços.',
      fala: 'Eu disse no grupo que tratava disso. Não precisas de falar assim.',
      pensamentos: {
        calmo: 'Se calhar comecei com demasiada força.',
        tenso: 'Agora a culpa é minha?',
        quente: 'Inacreditável. Ainda se faz de vítima.'
      },
      opcoes: [
        { texto: '«Disseste há duas semanas. E depois, nada.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma acusação', efeitos: { eu: 1, outro: 1, relacao: -1 }, vai: 'escalada' },
        { texto: '«Desculpa, Tomás. Estou com raiva e não estou a conseguir gerir isto bem. Não era assim que queria começar.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'um pedido de desculpa, com a raiva assumida', efeitos: { eu: -1, outro: -2, relacao: 2 }, vai: 'pergunta' },
        { texto: '«Tens razão, comecei mal. Estou em pânico com a entrega. O que se passou?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'que reconheceste o tom e queres perceber', requer: { euMax: 4 }, efeitos: { outro: -1, relacao: 1 }, vai: 'pergunta' },
        { texto: '«Pronto, esquece. Eu faço.»', tipo: 'ceder', postura: 'passivo-agressiva', reage: 'afasta', ouviu: 'que o problema desapareceu', efeitos: { relacao: -1, adiado: 1 }, vai: 'fim_ceder' },
        { texto: '«Falo como me apetecer. Foste tu que estragaste isto.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'desprezo', requer: { euMin: 5 }, efeitos: { eu: 1, outro: 2, relacao: -2 }, vai: 'escalada' },
        { texto: '«O tom saiu mal. Mas estou com raiva porque isto afeta a nota de todos. O que aconteceu?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva, com o motivo dito às claras', requer: { euMin: 5 }, efeitos: { eu: -1, outro: -1 }, vai: 'pergunta' }
      ]
    },

    escalada: {
      entrada: { eu: 1 },
      hora: '23:17',
      expr: 'zangado',
      narracao: 'O Tomás levanta a voz.',
      fala: 'Achas que és a única pessoa com problemas? Não sabes nada da minha vida.',
      pensamentos: {
        calmo: 'Há qualquer coisa que ele não está a dizer.',
        tenso: 'Lá vem a conversa dos problemas.',
        quente: 'Não quero saber dos problemas dele.'
      },
      opcoes: [
        { texto: '«Tens razão, não sei. Conta-me.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'abertura para ouvir', requer: { euMax: 5 }, efeitos: { outro: -2, relacao: 1 }, vai: 'revelacao' },
        { texto: '«Espera. Desculpa. Estou com raiva e isto está a fugir-me. Podemos recomeçar?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'um pedido de desculpa e vontade de recomeçar', efeitos: { eu: -1, outro: -2, relacao: 2 }, vai: 'revelacao' },
        { texto: '«A tua vida não é problema meu. A tua parte é.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'que ele não conta, só o trabalho', efeitos: { eu: 1, outro: 2, relacao: -2 }, vai: 'ultimato' },
        { texto: '(Não dizes nada e olhas para o ecrã.)', tipo: 'evitar', postura: 'passivo-agressiva', reage: 'afasta', ouviu: 'silêncio, que leu como desprezo', efeitos: { outro: 1, relacao: -1, adiado: 1 }, vai: 'silencio' },
        { texto: '«Amanhã vou falar com o docente e ele que decida.»', tipo: 'competir', postura: 'agressiva', reage: 'afasta', ouviu: 'uma ameaça', requer: { euMin: 6 }, efeitos: { outro: 2, relacao: -3, eu: 1 }, vai: 'fim_explosao' },
        { texto: '«Não sei, é verdade. E neste momento a raiva não me deixa ouvir bem. Dá-me um minuto e conta-me.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que estás com raiva e mesmo assim queres ouvir', requer: { euMin: 6 }, efeitos: { eu: -1, outro: -1, relacao: 1 }, vai: 'revelacao' }
      ]
    },

    ultimato: {
      entrada: { eu: 1 },
      hora: '23:19',
      expr: 'zangado',
      narracao: 'O Tomás já tem a mochila na mão.',
      fala: 'Queres a parte feita? Então faz tu.',
      pensamentos: {
        calmo: 'Se ele sai agora, não há volta.',
        tenso: 'Isto é chantagem.',
        quente: 'Que vá. Nem preciso dele.'
      },
      opcoes: [
        { texto: '«Espera. Não quero que te vás embora. Quero perceber o que aconteceu.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que a relação importa', requer: { euMax: 7 }, efeitos: { outro: -2, relacao: 1 }, vai: 'revelacao' },
        { texto: '«Desculpa. Passei dos limites, a raiva falou por mim. Não te vás embora.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'um pedido de desculpa sincero', efeitos: { eu: -1, outro: -2, relacao: 2 }, vai: 'revelacao' },
        { texto: '«Vai. Eu faço, como sempre.»', tipo: 'competir', postura: 'passivo-agressiva', reage: 'afasta', ouviu: 'desprezo', efeitos: { outro: 1, relacao: -2, eu: 1 }, vai: 'fim_explosao' },
        { texto: '«Espera. Estou com raiva, mas não quero que te vás embora.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'raiva, e que a relação importa', requer: { euMin: 6 }, efeitos: { eu: -1, outro: -1, relacao: 1 }, vai: 'revelacao' },
        { texto: '«Estou com muita raiva, Tomás. Mas antes de te ires embora, quero perceber o que se passou.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva, e vontade de perceber', requer: { euMin: 6 }, efeitos: { eu: -1, outro: -1 }, vai: 'pergunta' },
        { texto: '(Deixas que ele saia.)', tipo: 'evitar', postura: 'passiva', reage: 'afasta', ouviu: 'que não vale a pena ficar', efeitos: { relacao: -2, adiado: 1 }, vai: 'fim_explosao' }
      ]
    },

    silencio: {
      hora: '23:40',
      expr: 'tenso',
      narracao: 'Ficam os dois calados. Ao fim de vinte minutos, o Tomás fecha o portátil e levanta-se sem dizer nada.',
      opcoes: [
        { texto: '«Tomás, espera. Vamos tentar outra vez.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'uma segunda oportunidade', efeitos: { outro: -1, relacao: 1 }, vai: 'revelacao' },
        { texto: '«Tomás, espera. Antes de ires: o que se passa contigo?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'interesse por ele, depois do silêncio', requer: { euMax: 5 }, efeitos: { outro: -1 }, vai: 'pergunta' },
        { texto: '«Espera. Ainda estou com raiva, mas quero perceber o que se passa contigo.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva, e vontade de perceber', requer: { euMin: 5 }, efeitos: { outro: -1, eu: -1 }, vai: 'pergunta' },
        { texto: '(Deixas que ele saia.)', tipo: 'evitar', postura: 'passiva', reage: 'afasta', ouviu: 'que a conversa acabou', efeitos: { relacao: -1, adiado: 1 }, vai: 'fim_evitar' }
      ]
    },

    pergunta: {
      hora: '23:15',
      expr: 'vergonha',
      narracao: 'O Tomás hesita e olha para o chão.',
      fala: 'Pois... não consegui. Tive umas semanas complicadas.',
      pensamentos: {
        calmo: 'Está a olhar para o chão.',
        tenso: 'Semanas complicadas. Toda a gente tem.',
        quente: 'Lá vem a desculpa.'
      },
      leitura: 'O que achas que se passa com o Tomás neste momento?',
      opcoes: [
        { texto: 'Tem vergonha e não sabe como dizer.', tipo: 'leitura', certaSe: 'trabalho', efeitos: { relacao: 1 }, vai: 'escuta' },
        { texto: 'Não está muito preocupado com isto.', tipo: 'leitura', certaSe: 'desinteresse', efeitos: { relacao: 1 }, vai: 'escuta' },
        { texto: 'Está a gozar comigo.', tipo: 'leitura', efeitos: { eu: 1 }, vai: 'desconfia' }
      ],
      variantes: {
        desinteresse: {
          expr: 'indiferente',
          narracao: 'O Tomás encolhe os ombros e olha de relance para o telemóvel.',
          pensamentos: {
            calmo: 'Encolheu os ombros. Não parece muito preocupado.',
            tenso: 'Nem olha para mim.',
            quente: 'Está a gozar comigo.'
          }
        }
      }
    },

    escuta: {
      hora: '23:16',
      expr: 'vergonha',
      narracao: 'Ficas à espera. O Tomás continua a olhar para o chão.',
      opcoes: [
        { texto: '«Complicadas como? Não precisas de contar tudo, mas ajudava perceber.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'interesse genuíno', efeitos: { outro: -1 }, vai: 'revelacao' },
        { texto: '«Toda a gente tem semanas complicadas. A entrega é amanhã.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'que as razões dele não contam', efeitos: { eu: 1, outro: 1, relacao: -1 }, vai: 'escalada' },
        { texto: '«Ok, não faz mal. Eu trato disso.»', tipo: 'ceder', postura: 'passiva', reage: 'nada', ouviu: 'que o problema desapareceu', efeitos: { adiado: 1 }, vai: 'fim_ceder' }
      ],
      variantes: {
        desinteresse: {
          expr: 'indiferente',
          narracao: 'Ficas à espera. O Tomás volta a olhar para o telemóvel.'
        }
      }
    },

    desconfia: {
      entrada: { eu: 1 },
      hora: '23:16',
      expr: 'tenso',
      narracao: 'Olhas para ele à espera da desculpa. Ele percebe.',
      fala: 'Esquece. Não vale a pena explicar.',
      pensamentos: {
        calmo: 'Fechou-se. Se calhar fui eu que o fechei.',
        tenso: 'Se não explica, é porque não tem explicação.',
        quente: 'Claro que não explica.'
      },
      opcoes: [
        { texto: '«Semanas complicadas. Claro.»', tipo: 'competir', postura: 'passivo-agressiva', reage: 'defende', ouviu: 'sarcasmo', efeitos: { eu: 1, outro: 2, relacao: -1 }, vai: 'escalada' },
        { texto: '«Desculpa. A raiva está a fazer-me ouvir tudo como uma desculpa. Quero mesmo saber o que se passou.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'um pedido de desculpa, e interesse', efeitos: { eu: -1, outro: -2, relacao: 2 }, vai: 'revelacao' },
        { texto: '«Estou com raiva e se calhar notou-se. Mas quero mesmo perceber.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'raiva assumida, e interesse', requer: { euMin: 5 }, efeitos: { eu: -1, outro: -1 }, vai: 'revelacao' },
        { texto: '«Vale a pena, sim. Complicadas como?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que ainda queres ouvir', requer: { euMax: 4 }, efeitos: { outro: -1 }, vai: 'revelacao' },
        { texto: '«Ok, eu faço.»', tipo: 'ceder', postura: 'passiva', reage: 'afasta', ouviu: 'que o problema desapareceu', efeitos: { adiado: 1 }, vai: 'fim_ceder' }
      ]
    },

    revelacao: {
      hora: '23:21',
      expr: 'triste',
      entrada: { outro: -2, eu: -1 },
      marca: 'sabe',
      narracao: 'O Tomás senta-se.',
      fala: 'Comecei a trabalhar num restaurante, três noites por semana. A renda subiu e tive de ser. Não disse nada porque não queria que pensassem que me estava a baldar.',
      pensamentos: {
        calmo: 'Três noites por semana. Não fazia ideia.',
        tenso: 'Podia ter dito.',
        quente: 'E quem paga sou eu.'
      },
      opcoes: [
        { texto: '«Ainda bem que me contaste. Isso muda as coisas. Temos até às 9h. O que consegues fazer esta noite?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'compreensão, e que o prazo continua a contar', efeitos: { outro: -1, relacao: 2 }, vai: 'plano' },
        { texto: '«Percebo. Mas devias ter dito. Ficámos à espera sem saber de nada.»', tipo: 'colaborar', postura: 'assertiva', reage: 'defende', ouviu: 'o impacto no grupo, dito sem ataque', efeitos: { outro: 1, relacao: 1 }, vai: 'impacto' },
        { texto: '«Três noites por semana, mais as aulas. Como é que estás a aguentar isso?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que te importas com ele, não só com a entrega', requer: { euMax: 4 }, efeitos: { outro: -1, relacao: 2 }, vai: 'plano' },
        { texto: '«Ainda estou com raiva por não teres dito. Mas quero perceber: porque achaste que íamos pensar que te estavas a baldar?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva, e vontade de o perceber', requer: { euMin: 5 }, efeitos: { relacao: 1, eu: -1 }, vai: 'impacto' },
        { texto: '«Não faz mal, vai descansar. Eu escrevo a tua parte.»', tipo: 'ceder', postura: 'passiva', reage: 'nada', ouviu: 'alívio, e que alguém resolve por ele', efeitos: { adiado: 1 }, vai: 'fim_ceder' }
      ],
      variantes: {
        desinteresse: {
          expr: 'indiferente',
          narracao: 'O Tomás encosta-se na cadeira.',
          fala: 'Sinceramente? Perdi a vontade. O projeto não me diz nada, e achei que vocês faziam isto melhor do que eu.',
          pensamentos: {
            calmo: 'Pelo menos está a ser honesto.',
            tenso: 'Perdeu a vontade. E nós?',
            quente: 'Não acredito no que estou a ouvir.'
          },
          opcoes: [
            { texto: '«Ainda bem que dizes a verdade. Mas isto deixa o grupo pendurado. O que precisavas para pegar nisto esta noite?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que a honestidade conta, e o problema também', efeitos: { outro: -1, relacao: 2 }, vai: 'plano' },
            { texto: '«Isso irrita-me. Não é justo para nós, e tu sabes.»', tipo: 'colaborar', postura: 'assertiva', reage: 'defende', ouviu: 'o impacto no grupo, dito sem ataque', efeitos: { outro: 1, relacao: 1 }, vai: 'impacto' },
            { texto: '«Perdeste a vontade porquê? Aconteceu alguma coisa com o projeto?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'interesse pelo que ele sente em relação ao projeto', requer: { euMax: 4 }, efeitos: { outro: -1, relacao: 1 }, vai: 'plano' },
            { texto: '«Isso dá-me muita raiva. Mas quero perceber: o que te fez perder a vontade?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva, e uma pergunta a sério', requer: { euMin: 5 }, efeitos: { relacao: 1, eu: -1 }, vai: 'plano' },
            { texto: '«Pronto, eu faço.»', tipo: 'ceder', postura: 'passiva', reage: 'nada', ouviu: 'que alguém resolve por ele', efeitos: { adiado: 1 }, vai: 'fim_ceder' },
            { texto: '«Então vou dizer ao docente que não fizeste nada.»', tipo: 'competir', postura: 'agressiva', reage: 'afasta', ouviu: 'uma ameaça', requer: { euMin: 5 }, efeitos: { outro: 2, relacao: -3, eu: 1 }, vai: 'fim_explosao' }
          ]
        }
      }
    },

    impacto: {
      hora: '23:23',
      expr: 'tenso',
      entrada: { outro: -1, eu: -1 },
      narracao: 'O Tomás fica calado uns segundos.',
      fala: 'Tens razão. Devia ter dito. Desculpa.',
      pensamentos: {
        calmo: 'Pediu desculpa.',
        tenso: 'Pelo menos admite.',
        quente: 'Desculpa não resolve nada.'
      },
      opcoes: [
        { texto: '«Ok. E agora, o que consegues fazer esta noite?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que o pedido de desculpa foi aceite', efeitos: { relacao: 1 }, vai: 'plano' },
        { texto: '«Da próxima vez diz. O grupo ajustava as tarefas.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'um pedido claro para o futuro', efeitos: { relacao: 1 }, vai: 'plano' },
        { texto: '«Desculpa não chega. Escreves tu tudo, esta noite.»', tipo: 'competir', postura: 'agressiva', reage: 'afasta', ouviu: 'que o pedido de desculpa não serviu', efeitos: { outro: 1, relacao: -1, eu: 1 }, vai: 'fim_frio' }
      ],
      variantes: {
        desinteresse: {
          fala: 'Pois. Não é. Não tinha pensado nisso assim.',
          pensamentos: {
            calmo: 'Afinal ouviu.',
            tenso: 'Não tinha pensado. Claro.',
            quente: 'Nunca pensa.'
          },
          opcoes: [
            { texto: '«Ok. Então o que consegues fazer esta noite?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que ainda contas com ele', efeitos: { relacao: 1 }, vai: 'plano' },
            { texto: '«Se o projeto não te diz nada, temos de falar disso no grupo. Mas hoje precisamos da tua parte.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que o desinteresse dele tem lugar, e o prazo também', efeitos: { relacao: 1 }, vai: 'plano' },
            { texto: '«Então pensa agora. E escreve.»', tipo: 'competir', postura: 'agressiva', reage: 'afasta', ouviu: 'uma ordem', efeitos: { outro: 1, relacao: -1, eu: 1 }, vai: 'fim_frio' }
          ]
        }
      }
    },

    plano: {
      aderecoOutro: 'portatil',
      hora: '23:30',
      expr: 'calmo',
      fala: 'Tenho as gravações dos testes, só não escrevi. Se me ajudares a organizar, escrevo até às três.',
      pensamentos: {
        calmo: 'Isto dá para fazer.',
        tenso: 'Até às três. Veremos.',
        quente: 'Devia ter feito isto há duas semanas.'
      },
      opcoes: [
        { texto: '«Combinado. Eu faço a estrutura, tu escreves, eu revejo de manhã.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'um plano a dois', efeitos: { relacao: 1 }, vai: 'fim_colaborar' },
        { texto: '«A estrutura também é contigo. É a tua parte.»', tipo: 'competir', postura: 'assertiva', reage: 'afasta', ouviu: 'que está sozinho nisto', efeitos: { outro: 1, relacao: -1 }, vai: 'fim_frio' },
        { texto: '«Vai para casa. Eu escrevo com as tuas gravações.»', tipo: 'ceder', postura: 'passiva', reage: 'nada', ouviu: 'que alguém resolve por ele', efeitos: { adiado: 1 }, vai: 'fim_ceder' }
      ],
      variantes: {
        desinteresse: {
          fala: 'Está bem. Tenho as gravações. Escrevo esta noite, mas não esperes nada de especial.',
          pensamentos: {
            calmo: 'Não é entusiasmo, mas é um compromisso.',
            tenso: '«Nada de especial.» Ótimo.',
            quente: 'Vai fazer à pressa e mal.'
          },
          opcoes: [
            { texto: '«Combinado. Às duas vejo o que tens e fechamos juntos.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'um plano a dois, com um ponto de controlo', efeitos: { relacao: 1 }, vai: 'fim_colaborar' },
            { texto: '«"Nada de especial" não chega. É um terço da nota.»', tipo: 'competir', postura: 'agressiva', reage: 'afasta', ouviu: 'que o esforço dele nunca vai chegar', efeitos: { outro: 1, relacao: -1, eu: 1 }, vai: 'fim_frio' },
            { texto: '«Deixa, eu escrevo com as tuas gravações.»', tipo: 'ceder', postura: 'passiva', reage: 'nada', ouviu: 'que alguém resolve por ele', efeitos: { adiado: 1 }, vai: 'fim_ceder' }
          ]
        }
      }
    },

    evitar1: {
      hora: '23:40',
      expr: 'calmo',
      entrada: { eu: 1 },
      narracao: 'O Tomás senta-se e abre o portátil.',
      fala: 'Então, está tudo pronto para amanhã?',
      pensamentos: {
        calmo: 'Não faz ideia. Tenho de lhe dizer.',
        tenso: 'Digo ou não digo?',
        quente: 'Tudo pronto?! A sério?'
      },
      opcoes: [
        { texto: '«Sim, sim. Quase.»', tipo: 'evitar', postura: 'passiva', reage: 'nada', ouviu: 'que está tudo bem', efeitos: { relacao: -1, adiado: 1 }, vai: 'evitar2' },
        { texto: '«Na verdade, não. A tua parte ainda não está feita.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'um facto, dito com calma', requer: { euMax: 5 }, efeitos: { outro: 1 }, vai: 'pergunta' },
        { texto: '«Quase. Vi que a tua parte ainda está vazia. Está tudo bem contigo?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'preocupação com ele, antes da entrega', requer: { euMax: 4 }, efeitos: { outro: 1 }, vai: 'pergunta' },
        { texto: '«Não está, e estou com raiva por isso. Mas primeiro quero perceber: o que aconteceu?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva, e uma pergunta a sério', requer: { euMin: 4 }, efeitos: { eu: -1, outro: 1 }, vai: 'pergunta' },
        { texto: '«Pronto?! A tua parte está em branco!»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma explosão que não esperava', requer: { euMin: 4 }, efeitos: { outro: 2, relacao: -1, eu: 1 }, vai: 'defensivo' },
        { texto: '«Não está. E estou a fazer um esforço para não explodir. A tua parte está em branco.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'um facto, com a raiva à vista mas contida', requer: { euMin: 4 }, efeitos: { outro: 1 }, vai: 'pergunta' }
      ]
    },

    evitar2: {
      entrada: { eu: 1 },
      hora: '00:30',
      expr: 'calmo',
      narracao: 'Meia-noite e meia. O Tomás arruma as coisas. A secção dele continua em branco.',
      fala: 'Bom, vou andando. Até amanhã!',
      pensamentos: {
        calmo: 'Se não digo agora, não digo.',
        tenso: 'Amanhã logo se vê.',
        quente: 'E vai-se embora assim.'
      },
      opcoes: [
        { texto: '«Espera. Antes de ires, temos de falar da tua parte.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'um problema que não sabia que existia', efeitos: { outro: 1 }, vai: 'pergunta' },
        { texto: '«Espera. A tua parte continua em branco. Aconteceu alguma coisa?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'uma pergunta sobre ele, não só sobre a entrega', requer: { euMax: 4 }, efeitos: { outro: 1 }, vai: 'pergunta' },
        { texto: '«Espera. Estou com raiva por a tua parte estar em branco, mas antes de ires quero perceber o que se passou.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva, e vontade de perceber', requer: { euMin: 5 }, efeitos: { eu: -1, outro: 1 }, vai: 'pergunta' },
        { texto: '«Até amanhã.»', tipo: 'evitar', postura: 'passiva', reage: 'nada', ouviu: 'que está tudo bem', efeitos: { adiado: 1 }, vai: 'fim_evitar' },
        { texto: '«Vais embora?! Com a tua parte por fazer?»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma explosão que não esperava', requer: { euMin: 5 }, efeitos: { outro: 2, relacao: -2, eu: 1 }, vai: 'escalada' }
      ]
    },

    // Finais. "textoSabe" substitui o texto quando o Tomás chegou a contar o que se passava.
    fim_colaborar: {
      aderecoOutro: 'portatil',
      fim: true, hora: '02:40', expr: 'calmo',
      titulo: 'Entregue, com o Tomás do teu lado',
      balanco: { ganhos: ['A secção entregue a horas', 'Saber o que se passava com o Tomás', 'Um plano para as próximas semanas'], perdas: ['Algumas horas de sono'] },
      texto: 'Às 2h40 a secção está escrita. De manhã revês tudo e o grupo entrega às 8h55. Na semana seguinte, o Tomás conta ao resto do grupo os turnos no restaurante, e as tarefas são redistribuídas à volta das noites dele.',
      variantes: {
        desinteresse: {
          texto: 'O Tomás envia a secção às 3h. Não está brilhante, mas está lá, e de manhã fecham-na juntos. Na reunião seguinte, o grupo fala do que cada um quer tirar do projeto, e o Tomás fica com a programação do protótipo, a única parte que lhe interessa.'
        }
      }
    },
    fim_frio: {
      fim: true, hora: '04:00', ausente: true,
      titulo: 'Entregue, mas mais longe',
      balanco: { ganhos: ['A secção escrita por ele, não por ti'], perdas: ['A proximidade com o Tomás', 'A vontade dele de colaborar nas próximas tarefas'] },
      texto: 'O Tomás escreve a secção sozinho até às quatro. O projeto é entregue a horas. Nas semanas seguintes, ele responde às mensagens do grupo com uma palavra de cada vez.',
      variantes: {
        desinteresse: {
          texto: 'O Tomás escreve o mínimo até às quatro. O projeto é entregue a horas. Nas semanas seguintes, ninguém volta a contar com ele, e ele também não se oferece.'
        }
      }
    },
    fim_ceder: {
      fim: true, hora: '04:00', ausente: true,
      titulo: 'Entregue, e a conta ficou do teu lado',
      balanco: { ganhos: ['Não houve discussão', 'O projeto entregue a horas'], perdas: ['Uma noite de sono', 'A irritação, que ficou guardada', 'O grupo continua sem saber o que se passa'] },
      texto: 'Escreves a parte do Tomás até às quatro, a partir de notas soltas. O projeto é entregue a horas. O Tomás agradece com um emoji. A irritação não se foi embora, ficou guardada.',
      textoSabe: 'Escreves a parte do Tomás até às quatro. O projeto é entregue a horas. Sabes porque é que ele não conseguiu, mas o grupo não sabe, e na próxima tarefa ninguém vai ter em conta as noites dele no restaurante.',
      variantes: {
        desinteresse: {
          textoSabe: 'Escreves a parte do Tomás até às quatro. O projeto é entregue a horas. Sabes que ele perdeu o interesse, e ele sabe que fazes o trabalho quando ele não faz. Na próxima tarefa, as duas coisas vão pesar.'
        }
      }
    },
    fim_evitar: {
      fim: true, hora: '08:50', ausente: true,
      titulo: 'Nada foi dito',
      balanco: { ganhos: ['Não houve discussão'], perdas: ['Um projeto entregue incompleto', 'A nota de todos'] },
      texto: 'Às 8h50 a secção continua em branco. Escreves meia página à pressa no autocarro. O grupo entrega um projeto incompleto. Ninguém sabe bem porquê, e o Tomás também não disse.'
    },
    fim_explosao: {
      fim: true, hora: '23:25', ausente: true,
      titulo: 'A porta bateu',
      balanco: { ganhos: ['Disseste o que pensavas, sem filtro'], perdas: ['A secção, que escreveste tu', 'A relação com o Tomás', 'Um plano para a próxima vez'] },
      texto: 'O Tomás pega na mochila. «Faz tu, então.» A porta bate. Escreves a parte dele até às quatro. No dia seguinte, sentam-se em mesas diferentes. O motivo do atraso dele fica por saber.',
      textoSabe: 'O Tomás pega na mochila. «Faz tu, então.» A porta bate. Sabes das noites no restaurante, mas a conversa acabou antes de chegarem a um plano. Escreves a parte dele até às quatro.',
      variantes: {
        desinteresse: {
          textoSabe: 'O Tomás pega na mochila. «Faz tu, então.» A porta bate. Sabes que ele perdeu o interesse, mas a conversa acabou antes de se perceber o que fazer com isso. Escreves a parte dele até às quatro.'
        }
      }
    }
  }
};
