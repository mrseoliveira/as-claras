// Cenário 2: o portefólio. Discordância de valores com uma amiga, sem solução.
// O objetivo não é convencer, é discordar sem perder a relação.
// Esquema igual ao do cenário 1 (ver comentário em cenario-01.js).
window.CENARIOS = window.CENARIOS || {};

window.CENARIOS.amiga = {
  id: 'amiga',
  numero: 2,
  titulo: 'O portefólio',
  resumo: 'Uma amiga, a mesma vaga, e uma discordância que não se resolve.',
  outro: 'Inês',
  pronome: 'ela',
  artigos: { o: 'a', ao: 'à', do: 'da', no: 'na' },
  verdades: ['medo', 'conviccao'],
  descricaoVerdade: {
    medo: 'a Inês usou IA por medo de não arranjar emprego, sabendo que muitos colegas fazem o mesmo',
    conviccao: 'a Inês acreditava sinceramente que a IA é uma ferramenta como outra qualquer'
  },
  inicial: { eu: 2, outro: 2, relacao: 6 },
  explosao: 'fim_explosao',
  reacaoPausa: 'Estás bem? Não dizes nada há um bocado.',
  distanciamento: 'Vista de fora, a cena é esta: duas pessoas que concorrem à mesma vaga, ambas com medo de a perder, a discutir sobre ferramentas.',
  introducao: 'Estás num café com a Inês, amiga desde o primeiro ano. As candidaturas ao estágio de concept art no mesmo estúdio de jogos fecham amanhã, e concorrem as duas pessoas à mesma vaga.',
  momentoLeitura: 'Quando a Inês disse que não tinha meses para fazer o portefólio',
  emocoes: ['Raiva', 'Frustração', 'Medo de perder a vaga', 'Desilusão', 'Inveja'],
  cena: {
    local: 'cafe',
    outro: { pele: '#e8b894', camisola: '#b48cf2', cabelo: '#6b2e1f', cabeloTipo: 'comprido' },
    aderecos: { eu: 'chavena', outro: 'portatil' }
  },
  gatilhos: {
    'injustiça': 'O primeiro gatilho da tua raiva foi a injustiça para com os artistas cujo trabalho treinou a IA. É uma raiva por valores, e costuma ser das mais difíceis de largar.',
    'ameaça': 'O primeiro gatilho da tua raiva foi a ameaça à tua candidatura. Quando há algo teu em jogo, a discordância de valores mistura-se com medo.',
    'desrespeito': 'O primeiro gatilho da tua raiva foi sentires o teu esforço desvalorizado.',
    'curiosidade': 'Começaste por separar a discordância da vontade de perceber. Isso deixou mais respostas ao teu alcance.',
    'evitamento': 'Começaste por esconder a discordância. A raiva inicial foi baixa, mas a tua opinião ficou por dizer.'
  },

  nos: {
    inicio: {
      hora: '17:40',
      exprEu: 'preocupado',
      expr: 'calmo',
      narracao: 'A Inês vira o portátil para ti. O portefólio dela tem vinte ilustrações novas, feitas numa semana. Reconheces o estilo: são imagens geradas por IA, com pequenos retoques.',
      pergunta: 'O que se passa contigo neste momento?',
      nota: 'Não há resposta certa. A opção mais próxima do que costuma acontecer contigo.',
      opcoes: [
        { texto: 'Isto é trabalho de artistas a quem ninguém pediu autorização.', tipo: 'reacao', lente: 'injustiça', efeitos: { eu: 1 }, vai: 'mostra' },
        { texto: 'Vai ficar com a vaga que era para quem desenha.', tipo: 'reacao', lente: 'ameaça', efeitos: { eu: 1 }, vai: 'mostra' },
        { texto: 'Levei meses a fazer o meu. Isto desvaloriza quem trabalha.', tipo: 'reacao', lente: 'desrespeito', efeitos: { eu: 1 }, vai: 'mostra' },
        { texto: 'Não concordo com isto. Mas quero perceber porque é que ela o fez.', tipo: 'reacao', lente: 'curiosidade', efeitos: {}, vai: 'mostra' },
        { texto: 'Não é nada comigo. Digo que está bonito.', tipo: 'reacao', lente: 'evitamento', efeitos: {}, vai: 'mostra' }
      ]
    },

    mostra: {
      hora: '17:41',
      expr: 'calmo',
      fala: 'Então? Ficou bom, não ficou? Finalmente tenho um portefólio a sério.',
      pensamentos: {
        calmo: 'Está orgulhosa. Não sabe o que penso disto.',
        tenso: 'Um portefólio a sério. Feito por uma máquina.',
        quente: 'Nem tem vergonha.'
      },
      opcoes: [
        { texto: '«Tenho de te dizer uma coisa com franqueza: não concordo com usar IA assim. Mas quero perceber porque escolheste isto.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'discordância, dita com respeito', efeitos: { outro: 1 }, vai: 'razoes' },
        { texto: '«Bom? Isto nem é teu, Inês.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma acusação de fraude', efeitos: { eu: 1, outro: 2, relacao: -2 }, vai: 'ofendida' },
        { texto: '«Ficou... sim, ficou bom.»', tipo: 'evitar', postura: 'passiva', reage: 'nada', ouviu: 'aprovação', efeitos: { adiado: 1 }, vai: 'fingir' },
        { texto: '«Estou com raiva a olhar para isto, e prefiro dizer-te já: para mim, isto é usar o trabalho de outros artistas. Porque é que o fizeste?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva, mas dita às claras e com uma pergunta', requer: { euMin: 3 }, efeitos: { eu: -1, outro: 2 }, vai: 'razoes' },
        { texto: '«Estás a fazer batota e sabes disso.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma acusação', requer: { euMin: 3 }, efeitos: { eu: 1, outro: 2, relacao: -2 }, vai: 'ofendida' }
      ]
    },

    fingir: {
      hora: '17:44',
      expr: 'calmo',
      fala: 'Achas que o estúdio vai gostar? Estava com medo que notassem que usei IA.',
      pensamentos: {
        calmo: 'É a altura de dizer o que penso.',
        tenso: 'Digo ou não digo?',
        quente: 'E agora pergunta-me a mim.'
      },
      variantes: {
        conviccao: { fala: 'Achas que o estúdio vai gostar? Usei IA, mas acho que isso já é normal.' }
      },
      opcoes: [
        { texto: '«Queres mesmo a minha opinião? Não concordo com usar IA assim. Mas quero perceber porque o fizeste.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'uma opinião pedida, dada com cuidado', efeitos: { outro: 1 }, vai: 'razoes' },
        { texto: '«Vão adorar.»', tipo: 'evitar', postura: 'passiva', reage: 'nada', ouviu: 'aprovação', efeitos: { adiado: 1 }, vai: 'fim_engolir' },
        { texto: '«Se não notarem, está tudo bem, não é?»', tipo: 'competir', postura: 'passivo-agressiva', reage: 'afasta', ouviu: 'ironia', efeitos: { outro: 1, relacao: -1, eu: 1 }, vai: 'fim_frio' },
        { texto: '«Estive este tempo todo a engolir isto e já não consigo. Não concordo com usar IA assim. Mas quero ouvir-te.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva guardada, finalmente dita sem ataque', requer: { euMin: 3 }, efeitos: { outro: 1 }, vai: 'razoes' },
        { texto: '«Vão notar. Toda a gente nota.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'desprezo', requer: { euMin: 3 }, efeitos: { outro: 2, relacao: -2, eu: 1 }, vai: 'ofendida' }
      ]
    },

    ofendida: {
      entrada: { eu: 1 },
      hora: '17:43',
      expr: 'zangado',
      narracao: 'A Inês fecha o portátil com força.',
      fala: 'Batota? Toda a gente usa. Tu é que vives noutro século.',
      pensamentos: {
        calmo: 'Fui longe demais na forma, não na opinião.',
        tenso: 'Toda a gente usa. Isso não torna nada certo.',
        quente: 'Agora sou eu o problema.'
      },
      opcoes: [
        { texto: '«Disse isso da pior maneira. Continuo a discordar, mas quero ouvir porque é que decidiste assim.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'um recuo no tom, não na opinião', requer: { euMax: 4 }, efeitos: { outro: -1, relacao: 1 }, vai: 'razoes' },
        { texto: '«Desculpa, Inês. Estou com raiva e disse isso mal. Não te queria magoar.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'um pedido de desculpa, com a raiva assumida', efeitos: { eu: -1, outro: -2, relacao: 2 }, vai: 'razoes' },
        { texto: '«Toda a gente rouba, então está tudo bem?»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'sarcasmo e acusação', efeitos: { eu: 1, outro: 2, relacao: -2 }, vai: 'escalada' },
        { texto: '«Esquece, não disse nada.»', tipo: 'ceder', postura: 'passivo-agressiva', reage: 'afasta', ouviu: 'que a tua opinião desapareceu', efeitos: { relacao: -1, adiado: 1 }, vai: 'fim_engolir' },
        { texto: '«Estou mesmo com raiva, e isso saiu mal. A minha opinião mantém-se. Explica-me como vês isto.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva assumida, e abertura', requer: { euMin: 5 }, efeitos: { eu: -1, outro: -1 }, vai: 'razoes' }
      ]
    },

    escalada: {
      entrada: { eu: 1 },
      hora: '17:46',
      expr: 'zangado',
      narracao: 'A Inês levanta-se.',
      fala: 'Sabes qual é o teu problema? Tens medo que eu fique com a vaga.',
      pensamentos: {
        calmo: 'Se calhar tem uma parte de razão.',
        tenso: 'Não é isso. Ou não é só isso.',
        quente: 'Como é que se atreve.'
      },
      opcoes: [
        { texto: '«Também tenho medo, é verdade. Mas não é por isso que discordo.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'honestidade sobre o teu medo', requer: { euMax: 5 }, efeitos: { outro: -2, relacao: 2 }, vai: 'revelacao' },
        { texto: '«Desculpa. Estou com raiva e não estou a gerir isto bem. Não quero que discutamos assim.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'um pedido de desculpa, e que a amizade importa', efeitos: { eu: -1, outro: -2, relacao: 2 }, vai: 'revelacao' },
        { texto: '«Com um portefólio feito por uma máquina? Não tenho medo nenhum.»', tipo: 'competir', postura: 'agressiva', reage: 'afasta', ouviu: 'desprezo', efeitos: { outro: 2, relacao: -3, eu: 1 }, vai: 'fim_explosao' },
        { texto: '«Pois, deve ser isso.»', tipo: 'competir', postura: 'passivo-agressiva', reage: 'afasta', ouviu: 'sarcasmo', efeitos: { outro: 1, relacao: -2, eu: 1 }, vai: 'fim_frio' },
        { texto: '«Estou com raiva e também com medo, as duas coisas. Senta-te, por favor. Quero mesmo falar disto.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'raiva e medo, ditos às claras', requer: { euMin: 6 }, efeitos: { eu: -1, outro: -1, relacao: 1 }, vai: 'revelacao' }
      ]
    },

    razoes: {
      hora: '17:48',
      expr: 'vergonha',
      narracao: 'A Inês suspira e olha para o portátil.',
      fala: 'Olha, é assim que as coisas estão. Os estúdios pedem portefólios enormes e eu não tenho meses.',
      pensamentos: {
        calmo: 'Está a olhar para o portátil. Parece cansada.',
        tenso: 'Desculpas.',
        quente: 'Lá vem a justificação.'
      },
      leitura: 'O que achas que se passa com a Inês?',
      variantes: {
        conviccao: {
          expr: 'calmo',
          narracao: 'A Inês endireita-se na cadeira e fala com calma.',
          pensamentos: {
            calmo: 'Fala com segurança. Parece convencida.',
            tenso: 'Desculpas.',
            quente: 'Lá vem a justificação.'
          }
        }
      },
      opcoes: [
        { texto: 'Tem medo de não arranjar emprego.', tipo: 'leitura', certaSe: 'medo', efeitos: { relacao: 1 }, vai: 'escuta' },
        { texto: 'Acredita mesmo que não há mal nenhum.', tipo: 'leitura', certaSe: 'conviccao', efeitos: { relacao: 1 }, vai: 'escuta' },
        { texto: 'Está só a arranjar desculpas.', tipo: 'leitura', efeitos: { eu: 1 }, vai: 'desconfia' }
      ]
    },

    escuta: {
      hora: '17:49',
      expr: 'vergonha',
      narracao: 'Ficas à espera. A Inês mexe no canto do portátil.',
      variantes: {
        conviccao: { expr: 'calmo', narracao: 'Ficas à espera. A Inês não desvia o olhar.' }
      },
      opcoes: [
        { texto: '«Percebo a pressão. Continuo a achar que isto tira trabalho a artistas. Podemos discordar nisto?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que a amizade aguenta a discordância', efeitos: { outro: -1, relacao: 2 }, vai: 'revelacao' },
        { texto: '«Tens razão, se calhar sou eu que estou a exagerar.»', tipo: 'ceder', postura: 'passiva', reage: 'nada', ouviu: 'concordância', efeitos: { adiado: 1 }, vai: 'fim_engolir' },
        { texto: '«Não ter tempo não é desculpa para usar trabalho alheio.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'um julgamento', efeitos: { outro: 2, relacao: -1, eu: 1 }, vai: 'escalada' }
      ]
    },

    desconfia: {
      entrada: { eu: 1 },
      hora: '17:49',
      expr: 'tenso',
      fala: 'Estás a olhar para mim como se eu fosse uma fraude.',
      pensamentos: {
        calmo: 'Se calhar estou mesmo.',
        tenso: 'E não és?',
        quente: 'Porque és.'
      },
      opcoes: [
        { texto: '«Não acho que sejas uma fraude. Acho que esta escolha está errada. São coisas diferentes.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'a diferença entre ela e a escolha dela', requer: { euMax: 4 }, efeitos: { outro: -1, relacao: 1 }, vai: 'revelacao' },
        { texto: '«Se a carapuça serve...»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'desprezo', efeitos: { outro: 2, relacao: -2, eu: 1 }, vai: 'escalada' },
        { texto: '«Não, não. Esquece.»', tipo: 'evitar', postura: 'passiva', reage: 'afasta', ouviu: 'um recuo', efeitos: { adiado: 1 }, vai: 'fim_engolir' },
        { texto: '«Estou com raiva, e se calhar notou-se. Mas não és uma fraude. É desta escolha que discordo.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'raiva, sem ataque à pessoa', requer: { euMin: 5 }, efeitos: { eu: -1, outro: -1, relacao: 1 }, vai: 'revelacao' }
      ]
    },

    revelacao: {
      hora: '17:52',
      expr: 'triste',
      marca: 'sabe',
      entrada: { outro: -1, eu: -1 },
      fala: 'Tenho um empréstimo para pagar e nenhuma entrevista marcada. Toda a gente que conheço está a fazer isto. Eu não queria, mas tive medo de ficar para trás.',
      pensamentos: {
        calmo: 'Não sabia do empréstimo.',
        tenso: 'Toda a gente faz. Não é argumento.',
        quente: 'Medo não justifica tudo.'
      },
      variantes: {
        conviccao: {
          expr: 'calmo',
          fala: 'Sinceramente? Acho que é uma ferramenta, como o Photoshop foi. Escolho, corrijo, componho. Para mim continua a ser trabalho meu.',
          pensamentos: {
            calmo: 'Pensou nisto a sério.',
            tenso: 'Não é a mesma coisa que o Photoshop.',
            quente: 'É o que toda a gente diz.'
          }
        }
      },
      opcoes: [
        { texto: '«Percebo melhor agora. Não mudo de opinião, mas não quero que isto fique entre nós.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que a amizade conta mais do que ganhar', efeitos: { outro: -1, relacao: 2 }, vai: 'fim_discordar' },
        { texto: '«Vou continuar a discordar. Mas é a tua candidatura, a decisão é tua.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'respeito pela decisão dela, sem concordar', efeitos: { relacao: 1 }, vai: 'fim_discordar' },
        { texto: '«Continua a ser batota, com ou sem razões.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'que as razões dela não contam', efeitos: { outro: 2, relacao: -2, eu: 1 }, vai: 'fim_frio' },
        { texto: '«Pronto, se calhar tens razão.»', tipo: 'ceder', postura: 'passiva', reage: 'nada', ouviu: 'uma concordância que ela sabe que não é verdadeira', efeitos: { adiado: 1 }, vai: 'fim_engolir' }
      ]
    },

    fim_discordar: {
      fim: true, hora: '18:30', expr: 'calmo',
      titulo: 'Discordam, e a amizade continua',
      texto: 'Ficam mais meia hora no café. Não chegam a acordo sobre a IA. Enviam as duas candidaturas. Na semana seguinte, é a Inês que te pergunta se a ajudas a refazer duas ilustrações à mão.',
      balanco: { ganhos: ['A amizade com a Inês', 'A tua opinião, dita às claras', 'Perceber as razões dela'], perdas: ['A esperança de a convencer'] },
      variantes: {
        conviccao: {
          texto: 'Ficam mais meia hora no café. Não chegam a acordo, e ninguém finge que chegou. Enviam as duas candidaturas. No sábado seguinte, jantam com a turma, como sempre.'
        }
      }
    },
    fim_frio: {
      fim: true, hora: '17:55', ausente: true,
      titulo: 'A discussão ficou, a Inês não',
      texto: 'A Inês paga o café dela e sai. Nas semanas seguintes, as mensagens dela passam a ser curtas. Ficas a saber pelo grupo que ela conseguiu uma entrevista.',
      balanco: { ganhos: ['Disseste o que pensavas'], perdas: ['A proximidade com a Inês'] }
    },
    fim_engolir: {
      fim: true, hora: '18:10', expr: 'calmo',
      titulo: 'Ficou por dizer',
      texto: 'Dizes que está ótimo. A Inês sorri e envia a candidatura. No caminho para casa, repetes na cabeça tudo o que não disseste. Na semana seguinte, evitas sentar-te ao pé dela.',
      balanco: { ganhos: ['Nenhuma discussão'], perdas: ['A tua opinião', 'A vontade de estar com a Inês', 'A irritação, que ficou guardada'] }
    },
    fim_explosao: {
      fim: true, hora: '17:50', ausente: true,
      titulo: 'A mesa ficou vazia',
      texto: 'A Inês fecha o portátil, pega no casaco e sai sem pagar o café. Deixa de responder às tuas mensagens. A discordância sobre a IA transformou-se numa discordância sobre vocês.',
      balanco: { ganhos: ['Disseste o que pensavas, sem filtro'], perdas: ['A amizade com a Inês'] }
    }
  }
};
