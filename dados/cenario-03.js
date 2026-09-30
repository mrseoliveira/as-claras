// Cenário 3: a nota. Conflito com alguém que tem poder sobre ti.
// Numa das verdades a nota está errada, na outra está justificada: às vezes a raiva não tem razão.
// Esquema igual ao do cenário 1 (ver comentário em cenario-01.js).
window.CENARIOS = window.CENARIOS || {};

window.CENARIOS.docente = {
  id: 'docente',
  numero: 3,
  titulo: 'A nota',
  resumo: 'Uma nota que parece injusta, e alguém com poder sobre ti.',
  outro: 'professor Vidal',
  nomeCurto: 'Prof. Vidal',
  pronome: 'ele',
  artigos: { o: 'o', ao: 'ao', do: 'do', no: 'no' },
  verdades: ['erro', 'criterio'],
  descricaoVerdade: {
    erro: 'o professor Vidal tinha trocado a tua grelha com a de outro grupo',
    criterio: 'a nota refletia a componente individual, onde a tua contribuição no repositório era baixa'
  },
  inicial: { eu: 2, outro: 1, relacao: 5 },
  explosao: 'fim_explosao',
  reacaoPausa: 'Está tudo bem? Precisa de um momento?',
  distanciamento: 'Vista de fora, a cena é esta: uma pessoa com medo de perder o ano, outra que avaliou dezenas de projetos, e uma nota que ainda ninguém explicou.',
  introducao: 'Game Design, projeto final. O teu grupo teve 14. Tu tiveste 9,4 e chumbaste à unidade curricular. O único comentário no Moodle diz «contribuição insuficiente». Hoje é dia de atendimento do professor Vidal.',
  momentoLeitura: 'Quando o professor Vidal falou da componente individual',
  emocoes: ['Raiva', 'Frustração', 'Medo de chumbar', 'Humilhação', 'Impotência'],
  cena: {
    local: 'gabinete',
    outro: { pele: '#f0c7a8', camisola: '#4f6fc9', cabelo: '#b8b2c2', cabeloTipo: 'grisalho', oculos: true },
    aderecos: { eu: 'folha', outro: 'papeis' }
  },
  gatilhos: {
    'injustiça': 'O primeiro gatilho da tua raiva foi a injustiça: o mesmo trabalho, notas diferentes. Com alguém que tem poder sobre ti, esta raiva costuma ficar presa entre explodir e calar.',
    'ameaça': 'O primeiro gatilho da tua raiva foi a ameaça de perder o ano. O medo aumenta a raiva e encurta a paciência para ouvir explicações.',
    'desrespeito': 'O primeiro gatilho da tua raiva foi a falta de explicação. Sentir que não mereceste mais do que duas palavras também é uma forma de desrespeito.',
    'curiosidade': 'Começaste por querer perceber a nota antes de a julgar. Com alguém que tem poder sobre ti, é o ponto de partida mais seguro.',
    'evitamento': 'Começaste por desistir antes de perguntar. A raiva ficou baixa, mas a dúvida sobre a nota também ficou.'
  },

  nos: {
    inicio: {
      hora: '11:20',
      exprEu: 'preocupado',
      expr: 'calmo',
      narracao: 'Estás à porta do gabinete, com a pauta impressa na mão. O professor Vidal está a corrigir trabalhos.',
      pergunta: 'O que se passa contigo neste momento?',
      nota: 'Não há resposta certa. A opção mais próxima do que costuma acontecer contigo.',
      opcoes: [
        { texto: 'Fiz tanto como os outros. Isto não é justo.', tipo: 'reacao', lente: 'injustiça', efeitos: { eu: 1 }, vai: 'chegada' },
        { texto: 'Se esta nota não mudar, perco o ano.', tipo: 'reacao', lente: 'ameaça', efeitos: { eu: 1 }, vai: 'chegada' },
        { texto: 'Nem se deu ao trabalho de explicar. Duas palavras no Moodle.', tipo: 'reacao', lente: 'desrespeito', efeitos: { eu: 1 }, vai: 'chegada' },
        { texto: 'Não percebo esta nota. Quero saber em que é que se baseou.', tipo: 'reacao', lente: 'curiosidade', efeitos: {}, vai: 'chegada' },
        { texto: 'Não vale a pena. Os professores nunca mudam as notas.', tipo: 'reacao', lente: 'evitamento', efeitos: {}, vai: 'chegada' }
      ]
    },

    chegada: {
      hora: '11:21',
      expr: 'calmo',
      narracao: 'Bates à porta. O professor levanta os olhos.',
      fala: 'Entre, entre. Diga.',
      pensamentos: {
        calmo: 'Parece disponível.',
        tenso: 'Vamos ver quanto tempo me dá.',
        quente: 'Nem sabe quem eu sou.'
      },
      opcoes: [
        { texto: '«Queria perceber a minha nota do projeto. O grupo teve 14 e eu 9,4, e o comentário não explica a diferença.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'um pedido claro, com os factos', efeitos: { outro: 1 }, vai: 'criterios' },
        { texto: '«Vim por causa da nota. Ou houve um erro grave, ou é injusto.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma acusação', efeitos: { eu: 1, outro: 2, relacao: -1 }, vai: 'defensivo' },
        { texto: '«Nada de especial, só vinha... ver se estava tudo bem com a nota.»', tipo: 'evitar', postura: 'passiva', reage: 'nada', ouviu: 'uma visita sem pedido', efeitos: { adiado: 1 }, vai: 'vago' },
        { texto: '«Estou com raiva e prefiro dizê-lo logo. Tive 9,4 pelo mesmo trabalho que o grupo, e preciso de perceber porquê.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva, com um pedido claro', requer: { euMin: 3 }, efeitos: { eu: -1, outro: 1 }, vai: 'criterios' },
        { texto: '«Isto é uma vergonha. Vou fazer queixa ao conselho pedagógico.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma ameaça', requer: { euMin: 3 }, efeitos: { outro: 2, relacao: -2, eu: 1 }, vai: 'defensivo' }
      ]
    },

    vago: {
      entrada: { eu: 1 },
      hora: '11:22',
      expr: 'calmo',
      fala: 'Está tudo lançado no Moodle. Mais alguma coisa?',
      pensamentos: {
        calmo: 'Se não pergunto agora, não pergunto.',
        tenso: 'Mais alguma coisa. Pois.',
        quente: 'Nem quer saber.'
      },
      opcoes: [
        { texto: '«Sim. Queria perceber a diferença entre a minha nota e a do grupo.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'um pedido claro, finalmente', efeitos: { outro: 1 }, vai: 'criterios' },
        { texto: '«Não, era só isso.»', tipo: 'evitar', postura: 'passiva', reage: 'nada', ouviu: 'que estava tudo bem', efeitos: { adiado: 1 }, vai: 'fim_calar' },
        { texto: '«Há, sim. Estou com raiva desta nota e preciso de perceber de onde vem.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva dita, com um pedido', requer: { euMin: 4 }, efeitos: { eu: -1, outro: 1 }, vai: 'criterios' },
        { texto: '«Há. A minha nota não faz sentido nenhum.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma acusação', requer: { euMin: 4 }, efeitos: { outro: 2, eu: 1 }, vai: 'defensivo' }
      ]
    },

    defensivo: {
      entrada: { eu: 1 },
      hora: '11:23',
      expr: 'zangado',
      narracao: 'O professor Vidal tira os óculos.',
      fala: 'As notas não foram dadas ao acaso. Se vem nesse tom, a conversa acaba já.',
      pensamentos: {
        calmo: 'O tom saiu-me mal.',
        tenso: 'Agora o problema é o meu tom.',
        quente: 'Claro. Quem manda é ele.'
      },
      opcoes: [
        { texto: '«Tem razão, o tom não foi o melhor. A minha pergunta mantém-se: em que é que a minha nota se baseou?»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'um recuo no tom, não no pedido', requer: { euMax: 4 }, efeitos: { outro: -1, relacao: 1 }, vai: 'criterios' },
        { texto: '«Peço desculpa, professor. Sinto que houve uma injustiça e não estou a conseguir gerir bem esta conversa.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'um pedido de desculpa, e a sensação de injustiça dita às claras', efeitos: { eu: -1, outro: -2, relacao: 2 }, vai: 'criterios' },
        { texto: '«O tom é o menos. O problema é a nota.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'um desafio à autoridade dele', efeitos: { outro: 2, relacao: -1, eu: 1 }, vai: 'escalada' },
        { texto: '«Desculpe. Esqueça.»', tipo: 'ceder', postura: 'passivo-agressiva', reage: 'afasta', ouviu: 'uma desistência', efeitos: { adiado: 1 }, vai: 'fim_calar' },
        { texto: '«Estou com raiva, é verdade. Mas não vim discutir, vim perceber a nota.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'raiva assumida, com um pedido', requer: { euMin: 5 }, efeitos: { eu: -1, outro: -1 }, vai: 'criterios' }
      ]
    },

    escalada: {
      entrada: { eu: 1 },
      hora: '11:25',
      expr: 'zangado',
      narracao: 'O professor levanta-se.',
      fala: 'Se não concorda, tem o processo de revisão. Está no regulamento.',
      pensamentos: {
        calmo: 'Há um caminho formal. Posso usá-lo.',
        tenso: 'Está a despachar-me.',
        quente: 'Está a pôr-me na rua.'
      },
      opcoes: [
        { texto: '«Vou usar esse processo, se for preciso. Mas preferia perceber primeiro consigo o que aconteceu.»', tipo: 'colaborar', postura: 'assertiva', reage: 'justifica', ouviu: 'firmeza, com uma porta aberta', requer: { euMax: 5 }, efeitos: { outro: -1 }, vai: 'revelacao' },
        { texto: '«Peço desculpa. A raiva está a falar mais alto do que eu. Pode mostrar-me como a nota foi calculada?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'um pedido de desculpa, com um pedido concreto', efeitos: { eu: -1, outro: -2, relacao: 2 }, vai: 'revelacao' },
        { texto: '«Vou, sim. E vou dizer que nem me quis ouvir.»', tipo: 'competir', postura: 'agressiva', reage: 'afasta', ouviu: 'uma ameaça', efeitos: { outro: 2, relacao: -2, eu: 1 }, vai: 'fim_explosao' },
        { texto: '(Sais do gabinete sem dizer nada.)', tipo: 'evitar', postura: 'passiva', reage: 'afasta', ouviu: 'que a conversa acabou', efeitos: { adiado: 1 }, vai: 'fim_calar' },
        { texto: '«Estou com demasiada raiva para esta conversa correr bem agora. Posso voltar amanhã?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'que te conheces e queres voltar a falar', requer: { euMin: 6 }, efeitos: { eu: -1, outro: -1, relacao: 1 }, vai: 'fim_amanha' }
      ]
    },

    criterios: {
      entrada: { eu: 1 },
      aderecoOutro: 'portatil',
      hora: '11:26',
      expr: 'tenso',
      narracao: 'O professor Vidal abre a folha de cálculo e franze a testa.',
      fala: 'A nota final tem uma componente individual. No seu caso, essa componente pesou.',
      pensamentos: {
        calmo: 'Franziu a testa. Parece que algo não bate certo.',
        tenso: 'Componente individual. Que conveniente.',
        quente: 'Está a inventar agora.'
      },
      leitura: 'O que achas que se passa com o professor Vidal?',
      variantes: {
        criterio: {
          expr: 'calmo',
          narracao: 'O professor Vidal abre o repositório do projeto sem hesitar.',
          pensamentos: {
            calmo: 'Sabe exatamente onde ir buscar a informação.',
            tenso: 'Componente individual. Que conveniente.',
            quente: 'Está a inventar agora.'
          }
        }
      },
      opcoes: [
        { texto: 'Não tem a certeza da nota que deu.', tipo: 'leitura', certaSe: 'erro', efeitos: { relacao: 1 }, vai: 'escuta' },
        { texto: 'Sabe bem porque deu esta nota.', tipo: 'leitura', certaSe: 'criterio', efeitos: { relacao: 1 }, vai: 'escuta' },
        { texto: 'Está a inventar uma justificação.', tipo: 'leitura', efeitos: { eu: 1 }, vai: 'desconfia' }
      ]
    },

    escuta: {
      aderecoOutro: 'portatil',
      hora: '11:27',
      expr: 'tenso',
      narracao: 'O professor continua a percorrer a folha de cálculo.',
      variantes: {
        criterio: { expr: 'calmo', narracao: 'O professor vira o ecrã para ti.' }
      },
      opcoes: [
        { texto: '«Pode mostrar-me como foi calculada?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'um pedido concreto', efeitos: { outro: -1, relacao: 1 }, vai: 'revelacao' },
        { texto: '«Ok. Se pesou, pesou.»', tipo: 'ceder', postura: 'passiva', reage: 'nada', ouviu: 'aceitação', efeitos: { adiado: 1 }, vai: 'fim_calar' },
        { texto: '«Componente individual? Ninguém nos explicou isso.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma acusação', efeitos: { outro: 1, eu: 1 }, vai: 'escalada' }
      ]
    },

    desconfia: {
      entrada: { eu: 1 },
      hora: '11:27',
      expr: 'tenso',
      fala: 'Não gosto da forma como está a olhar para mim. Os critérios estão na ficha da unidade curricular desde o primeiro dia.',
      pensamentos: {
        calmo: 'Se calhar nunca li a ficha com atenção.',
        tenso: 'Quem é que lê a ficha?',
        quente: 'Agora a culpa é minha.'
      },
      opcoes: [
        { texto: '«Não li a ficha com atenção, admito. Pode mostrar-me como a minha componente foi calculada?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'reconhecimento, e um pedido concreto', requer: { euMax: 5 }, efeitos: { outro: -1, relacao: 1 }, vai: 'revelacao' },
        { texto: '«Critérios que ninguém lê não servem de nada.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'desprezo pelas regras', efeitos: { outro: 2, eu: 1 }, vai: 'escalada' },
        { texto: '«Pois. Está bem.»', tipo: 'evitar', postura: 'passiva', reage: 'afasta', ouviu: 'uma desistência', efeitos: { adiado: 1 }, vai: 'fim_calar' },
        { texto: '«Estou com raiva e isso nota-se, desculpe. Mas quero mesmo ver como a nota foi calculada.»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'raiva assumida, e um pedido', requer: { euMin: 5 }, efeitos: { eu: -1, outro: -1 }, vai: 'revelacao' }
      ]
    },

    revelacao: {
      entrada: { eu: -1 },
      aderecoOutro: 'portatil',
      hora: '11:30',
      expr: 'vergonha',
      marca: 'sabe',
      fala: 'Tem razão. Troquei a sua grelha com a de outro grupo. A sua componente individual é 13,8. Peço desculpa, corrijo hoje.',
      pensamentos: {
        calmo: 'Admitiu. Não esperava.',
        tenso: 'E se eu não tivesse vindo?',
        quente: 'Chumbava por um erro dele.'
      },
      opcoes: [
        { texto: '«Agradeço ter visto isto comigo. Pode avisar-me quando estiver corrigido?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'reconhecimento, com um pedido de confirmação', efeitos: { relacao: 2 }, vai: 'fim_resolvida' },
        { texto: '«Um erro destes não devia acontecer.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'uma crítica justa, dita como ataque', efeitos: { outro: 1, relacao: -1, eu: 1 }, vai: 'fim_frio' },
        { texto: '«Não faz mal.»', tipo: 'ceder', postura: 'passiva', reage: 'nada', ouviu: 'que o erro não teve importância', efeitos: {}, vai: 'fim_resolvida' }
      ],
      variantes: {
        criterio: {
          entrada: {},
          expr: 'calmo',
          fala: 'Veja: seis commits em cento e quarenta, e nenhuma presença nas duas últimas reuniões de playtest. A componente individual existe para isto.',
          pensamentos: {
            calmo: 'Seis commits. Não tinha noção de que era tão pouco.',
            tenso: 'Mas fiz coisas que não aparecem no repositório.',
            quente: 'O repositório não mostra tudo.'
          },
          opcoes: [
            { texto: '«Não tinha noção disto. Fiz o design de níveis fora do repositório. Isso conta de alguma forma?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'um argumento concreto, sem ataque', efeitos: { relacao: 1 }, vai: 'fim_resolvida' },
            { texto: '«Percebo. Não concordo com tudo, mas percebo. O que posso fazer na época de recurso?»', tipo: 'colaborar', postura: 'assertiva', reage: 'abre', ouviu: 'aceitação, com um plano', efeitos: { relacao: 2 }, vai: 'fim_resolvida' },
            { texto: '«Contar commits é uma forma absurda de avaliar.»', tipo: 'competir', postura: 'agressiva', reage: 'defende', ouviu: 'desprezo pelo critério', efeitos: { outro: 2, relacao: -2, eu: 1 }, vai: 'fim_frio' },
            { texto: '«Pronto. Está bem.»', tipo: 'ceder', postura: 'passiva', reage: 'nada', ouviu: 'uma aceitação sem perguntas', efeitos: { adiado: 1 }, vai: 'fim_calar' }
          ]
        }
      }
    },

    fim_resolvida: {
      aderecoOutro: 'portatil',
      fim: true, hora: '11:40', expr: 'calmo',
      titulo: 'A nota foi corrigida',
      texto: 'Nessa tarde, a nota no Moodle passa para 13,8. O professor Vidal envia um email ao grupo a pedir desculpa pelo erro nas grelhas.',
      balanco: { ganhos: ['A nota corrigida', 'Uma relação cordial com o professor'], perdas: ['Uma manhã de nervos'] },
      variantes: {
        criterio: {
          titulo: 'A nota ficou, e percebeste porquê',
          texto: 'A nota fica. Sais do gabinete com um plano para a época de recurso e com a indicação de que o design de níveis conta, se estiver documentado. Não era o que querias ouvir, mas sabes onde estás.',
          balanco: { ganhos: ['Perceber a nota', 'Um plano para o recurso'], perdas: ['A esperança de subir a nota já'] }
        }
      }
    },
    fim_amanha: {
      fim: true, hora: '11:26', ausente: true, marca: 'sabe',
      titulo: 'Amanhã, com calma',
      texto: 'No dia seguinte voltas ao gabinete. O professor Vidal já tinha revisto as grelhas: tinha trocado a tua com a de outro grupo. A nota passa para 13,8.',
      balanco: { ganhos: ['A nota corrigida', 'Uma conversa calma no dia seguinte'], perdas: ['Um dia de espera'] },
      variantes: {
        criterio: {
          texto: 'No dia seguinte voltas ao gabinete. O professor mostra-te o repositório do projeto: seis commits em cento e quarenta. Não concordas com tudo, mas percebes a nota e combinam o que fazer na época de recurso.',
          balanco: { ganhos: ['Perceber a nota', 'Um plano para o recurso'], perdas: ['Um dia de espera', 'A esperança de subir a nota já'] }
        }
      }
    },
    fim_frio: {
      fim: true, hora: '11:35', ausente: true,
      titulo: 'Resolvido, mas com gelo',
      texto: 'A nota é corrigida nessa tarde. O professor Vidal passa a tratar-te com uma cortesia fria, e no ano seguinte recusa orientar o teu projeto.',
      balanco: { ganhos: ['A nota corrigida', 'Disseste o que pensavas'], perdas: ['A boa vontade do professor', 'Um orientador possível'] },
      variantes: {
        criterio: {
          texto: 'A nota fica. Sais do gabinete sem plano para o recurso e com a sensação de injustiça intacta. O professor Vidal passa a tratar-te com uma cortesia fria.',
          balanco: { ganhos: ['Disseste o que pensavas'], perdas: ['Um plano para o recurso', 'A boa vontade do professor'] }
        }
      }
    },
    fim_calar: {
      fim: true, hora: '11:24', ausente: true,
      titulo: 'Ficou por perguntar',
      texto: 'Sais do gabinete com a nota igual e a dúvida inteira.',
      textoSabe: 'Sais do gabinete com a nota igual. Sabes de onde vem, mas não perguntaste o que podias fazer na época de recurso.',
      balanco: { ganhos: ['Nenhum confronto com quem te avalia'], perdas: ['Uma nota que estava errada', 'O ano'] },
      variantes: {
        criterio: {
          balanco: { ganhos: ['Nenhum confronto com quem te avalia'], perdas: ['Um plano para o recurso'] }
        }
      }
    },
    fim_explosao: {
      fim: true, hora: '11:26', ausente: true,
      titulo: 'A porta fechou-se',
      texto: 'O professor Vidal pede-te que saias. Nessa noite, fazes queixa ao conselho pedagógico. O processo demora dois meses. Quando a nota é finalmente corrigida, já perdeste a inscrição na unidade curricular seguinte.',
      balanco: { ganhos: ['Disseste o que pensavas, sem filtro', 'A nota corrigida, dois meses depois'], perdas: ['Dois meses de processo', 'A relação com o professor', 'A inscrição seguinte'] },
      variantes: {
        criterio: {
          texto: 'O professor Vidal pede-te que saias. Nessa noite, fazes queixa ao conselho pedagógico. O processo demora dois meses e confirma a nota.',
          balanco: { ganhos: ['Disseste o que pensavas, sem filtro'], perdas: ['Dois meses de processo', 'A relação com o professor', 'Um plano para o recurso'] }
        }
      }
    }
  }
};
