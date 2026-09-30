// Conteúdo do curso de assertividade. Cada módulo é uma lista de blocos,
// desenhados por js/curso.js conforme o tipo.
// Os exemplos vêm dos cenários do jogo. As referências estão no fim.
window.CURSO = {
  titulo: 'Assertividade',
  subtitulo: 'Um curso curto para fazer ao teu ritmo',

  modulos: [
    {
      id: 'estilos',
      titulo: 'Quatro formas de dizer as coisas',
      blocos: [
        { tipo: 'texto', p: [
          'Perante um conflito, há quatro formas típicas de responder. Não são tipos de pessoa: a mesma pessoa pode ser passiva com a família e agressiva no trânsito. Funcionam como pontos numa linha, e cada um de nós desloca-se ao longo dela conforme a situação.'
        ] },
        { tipo: 'continuo' },
        { tipo: 'estilos', itens: [
          { id: 'passiva', nome: 'Passiva', texto: 'Cala o que sente e o que precisa para evitar o conflito. O problema fica, e a frustração acumula. Quem ouve muitas vezes nem percebe que há um problema, ou deixa de levar a pessoa a sério.' },
          { id: 'agressiva', nome: 'Agressiva', texto: 'Diz o que precisa à custa do outro, com ataque, ameaça ou desprezo. Às vezes consegue o que quer no momento. O outro defende-se ou afasta-se, e a relação paga.' },
          { id: 'passivo-agressiva', nome: 'Passivo-agressiva', texto: 'A raiva sai por vias indiretas: ironia, silêncio, «deixa, eu faço, como sempre». O outro percebe que algo está mal mas não sabe o quê, e o problema não se resolve.' },
          { id: 'assertiva', nome: 'Assertiva', texto: 'Diz o que sente e o que precisa de forma direta, sem atacar e sem desistir de si. Não garante que o outro concorde, mas põe o problema em cima da mesa.' }
        ] },
        { tipo: 'classificar', titulo: 'Exercício: que forma é esta?', instrucao: 'Frases tiradas das três conversas do jogo. Para cada uma, qual das quatro formas reconheces?', itens: [
          { frase: '«Pronto, esquece. Eu faço.»', certa: 'passivo-agressiva', porque: 'Cede em palavras, mas a irritação vai toda no «esquece».' },
          { frase: '«Estive a ver o documento e a tua parte ainda não está lá. O que se passou?»', certa: 'assertiva', porque: 'Descreve o facto sem acusar e pede informação.' },
          { frase: '«Estás a gozar comigo? Só faltam dez horas e ainda não temos nada da tua parte!»', certa: 'agressiva', porque: 'Ataca a pessoa em vez de falar do problema.' },
          { frase: '«Ficou... sim, ficou bom.» (sem achar que ficou)', certa: 'passiva', porque: 'A opinião fica por dizer para não criar desconforto.' },
          { frase: '«Isto está a deixar-me com muita raiva. Preciso de perceber de onde vem esta nota.»', certa: 'assertiva', porque: 'A raiva é dita às claras, com um pedido concreto. Ser assertivo não exige estar calmo.' },
          { frase: '«Se não notarem, está tudo bem, não é?»', certa: 'passivo-agressiva', porque: 'A crítica chega por ironia, sem ser assumida.' },
          { frase: '«Critérios que ninguém lê não servem de nada.»', certa: 'agressiva', porque: 'Desvaloriza o outro e o que ele defende.' },
          { frase: '«Não, era só isso.» (e sais com a dúvida inteira)', certa: 'passiva', porque: 'Desiste do que precisava para evitar o confronto.' }
        ] }
      ]
    },

    {
      id: 'definicao',
      titulo: 'O que é, e o que não é',
      blocos: [
        { tipo: 'texto', p: [
          'Ser assertivo é exprimir o que pensas, sentes e precisas de forma direta, honesta e respeitosa, defendendo os teus direitos sem negar os dos outros. O objetivo é o equilíbrio: nem tu ficas por baixo, nem a outra pessoa.',
          'Quem tende para a passividade treina a assertividade para se defender mais. Quem tende para a agressividade treina-a para respeitar mais os outros. O ponto de chegada é o mesmo.'
        ] },
        { tipo: 'naoe', itens: [
          'Não é ser simpático. Uma resposta assertiva pode ser desconfortável de ouvir.',
          'Não é estar calmo. É possível ser assertivo com raiva.',
          'Não é ganhar. O outro pode continuar a discordar.',
          'Não é dizer tudo a toda a hora. Há momentos em que não vale a pena, e o módulo 5 trata disso.'
        ] },
        { tipo: 'nota', texto: 'O treino de assertividade reduz a ansiedade e os sintomas depressivos e melhora a autoestima (Speed, Goldstein e Goldfried, 2018). A dose também conta: assertividade a menos e a mais têm custos nas relações (Ames e Flynn, 2007).' },
        { tipo: 'barreiras', titulo: 'Exercício: o que costuma travar-te?', instrucao: 'Há três grandes travões à assertividade, e um quarto que puxa para o lado contrário. Qual é o mais parecido contigo? Podes escolher mais do que um.', itens: [
          { id: 'direito', nome: 'Sinto que não tenho direito', exemplo: '«É o meu pai», «é o meu chefe», «é o professor».', ajuda: 'Os direitos são iguais dos dois lados, mesmo quando o poder não é. Dizer o que sentes a quem tem poder sobre ti não é faltar ao respeito, desde que o faças sem atacar. O cenário 3 do jogo treina exatamente isto.' },
          { id: 'medo', nome: 'Tenho medo do que vai acontecer', exemplo: '«Vai zangar-se», «vai deixar de gostar de mim».', ajuda: 'O medo costuma prever o pior cenário como o mais provável. O módulo 4 mostra como apanhar esses pensamentos e como ir enfrentando as situações aos poucos, das mais fáceis para as mais difíceis.' },
          { id: 'saber', nome: 'Não sei o que dizer', exemplo: 'As palavras não saem, ou só saem horas depois.', ajuda: 'Há uma estrutura simples que ajuda (módulo 5). E dizer mais tarde continua a valer: uma mensagem no dia seguinte é melhor do que nada.' },
          { id: 'raiva', nome: 'Quando começo, passo ao ataque', exemplo: 'Calo durante semanas e um dia explodo.', ajuda: 'É muito comum oscilar entre a passividade e a agressividade. O módulo 4 trata da raiva, e o módulo 5 de como pedir desculpa quando ela fala por ti.' }
        ] }
      ]
    },

    {
      id: 'como',
      titulo: 'Como se diz',
      blocos: [
        { tipo: 'texto', p: [
          'As palavras importam, e a forma também. Uma frase assertiva dita a olhar para o chão, a rir ou a gritar perde o que tem de assertivo.'
        ] },
        { tipo: 'componentes', itens: [
          { nome: 'Olhar', texto: 'Olhar a pessoa, desviando de vez em quando. Nem fixo, nem para o chão.' },
          { nome: 'Postura', texto: 'Direita e aberta, à mesma altura da outra pessoa sempre que possível.' },
          { nome: 'Voz', texto: 'Volume audível e ritmo calmo. Falar devagar é mais claro do que falar depressa.' },
          { nome: 'Cara', texto: 'Coerente com o que se diz. Um sorriso a acompanhar uma queixa desmente-a.' },
          { nome: 'Momento', texto: 'De preferência na hora. Se não der, mais tarde. Em privado, e quando os dois têm tempo.' },
          { nome: 'Ouvir', texto: 'Antes de responder, confirmar o que se percebeu: «se percebi bem, estás a dizer que...». As tuas necessidades ficam em espera enquanto o outro fala.' },
          { nome: 'Persistência', texto: 'Às vezes é preciso dizer a mesma coisa duas ou três vezes até ser levado a sério.' }
        ] },
        { tipo: 'versoes', titulo: 'Exercício: dizer de outra forma', instrucao: 'Um colega de grupo que, pela terceira vez, não entregou a parte dele a tempo. Para cada frase, qual das quatro versões é a assertiva?', verificar: [
          'Descreve o que aconteceu, sem rótulos como «sempre», «nunca» ou «és»',
          'Diz como te sentes',
          'Diz o que precisas ou o que pedes',
          'Não ataca a pessoa'
        ], itens: [
          { estilo: 'Passiva', frase: '«Não faz mal, eu fico com a parte dele.»', versoes: [
            { texto: '«Tudo bem, eu faço. Já estou habituado.»', postura: 'passivo-agressiva', porque: 'A queixa vai toda no «já estou habituado», sem ser assumida e sem pedido.' },
            { texto: '«É a terceira vez que a tua parte não chega a tempo e acabo por fazê-la eu. Isso está a sobrecarregar-me. Preciso que combinemos um prazo e que o cumpras.»', postura: 'assertiva', porque: 'Descreve o que aconteceu, diz o que sente e faz um pedido concreto, sem atacar.' },
            { texto: '«Se calhar podias tentar entregar a tempo? Mas se não der, não faz mal.»', postura: 'passiva', porque: 'O pedido é feito e retirado na mesma frase.' },
            { texto: '«Estou farto de fazer o teu trabalho. Para a próxima, falo com o professor.»', postura: 'agressiva', porque: 'Diz o que sente, mas com ameaça e sem pedir nada ao colega.' }
          ] },
          { estilo: 'Agressiva', frase: '«És sempre a mesma coisa, nunca fazes nada a tempo.»', versoes: [
            { texto: '«És mesmo irresponsável. Mas pronto, o que precisas para entregar?»', postura: 'agressiva', porque: 'O pedido está lá, mas o rótulo «irresponsável» chega primeiro e é isso que o colega ouve.' },
            { texto: '«Não faz mal, acontece a todos.»', postura: 'passiva', porque: 'Salta para o outro extremo. O problema desaparece da conversa.' },
            { texto: '«Ainda bem que há quem entregue a tempo neste grupo.»', postura: 'passivo-agressiva', porque: 'A crítica chega por ironia, dirigida a ninguém e a todos.' },
            { texto: '«Esta semana a tua parte voltou a chegar depois do prazo. Isso irrita-me porque atrasa o grupo todo. O que precisas para conseguir entregar a tempo?»', postura: 'assertiva', porque: 'Fala desta semana e não de «sempre», assume a irritação e abre espaço para o colega explicar.' }
          ] }
        ] }
      ]
    },

    {
      id: 'emocoes',
      titulo: 'Raiva, ansiedade e culpa',
      blocos: [
        { tipo: 'texto', p: [
          'São as três emoções que mais atrapalham a assertividade, e as três têm uma função. O problema raramente é senti-las. É a intensidade com que aparecem e o que se faz com elas.'
        ] },
        { tipo: 'funcoes', itens: [
          { nome: 'Raiva', texto: 'Aparece perante injustiça, ameaça ou um limite ultrapassado. Dá energia para agir e defender o que é teu. Dita com agressividade, gera conflito. Dita com assertividade, pode gerar mudança.' },
          { nome: 'Ansiedade', texto: 'Prepara para um risco, incluindo o risco de ser rejeitado. Em dose moderada, ajuda a preparar uma conversa difícil. Em excesso, faz fugir dela.' },
          { nome: 'Culpa', texto: 'Sinaliza que algo foi contra os teus valores e puxa para reparar. Em excesso, faz pedir desculpa por existir e desistir de pedir o que é justo.' }
        ] },
        { tipo: 'texto', p: [
          'Entre o que acontece e o que sentes há quase sempre um pensamento rápido, que nem chega a ser notado. «Vão achar que é uma pergunta estúpida» produz ansiedade, e a ansiedade faz falar pouco e depressa. No jogo, estes pensamentos aparecem na caixa «Por dentro», depois de cada fala da outra pessoa.',
          'Alguns destes pensamentos repetem erros típicos, que toda a gente comete. Aaron Beck, psiquiatra, descreveu-os nos anos 60 e chamou-lhes distorções cognitivas (Beck, 1963). São quatro dos mais comuns.'
        ] },
        { tipo: 'termos', itens: [
          { nome: 'Catastrofização', texto: 'Tomar o pior desfecho possível como o mais provável, e muitas vezes como insuportável.', exemplo: '«Se eu gaguejar na apresentação, a nota vai ser péssima e chumbo à cadeira.»' },
          { nome: 'Personalização', texto: 'Assumir que se é a causa de algo que acontece à volta, sem prova de que tenha a ver connosco.', exemplo: '«O grupo está calado desde que cheguei. Fiz alguma coisa.»' },
          { nome: 'Leitura da mente', texto: 'Dar como certo o que o outro pensa ou sente, sem lhe perguntar. Quando a raiva sobe, a leitura tende a ser hostil: «fez de propósito» (Orobio de Castro et al., 2002).', exemplo: '«Ele não olhou para mim. Está a gozar comigo.»' },
          { nome: 'Filtro negativo', texto: 'Reparar só no que correu mal e deixar de fora tudo o resto, como se o negativo pesasse mais do que é.', exemplo: '«Tive 16, mas o professor escreveu que a conclusão era fraca. O trabalho não presta.»' }
        ] },
        { tipo: 'erros', titulo: 'Exercício: que erro de pensamento é este?', instrucao: 'Quatro frases novas. Qual dos quatro erros reconheces em cada uma?', itens: [
          { frase: '«Se lhe disser que não, nunca mais me fala.»', certa: 'catastrofizacao', porque: 'Toma o pior desfecho como o mais provável.' },
          { frase: '«O professor está com cara séria. Deve ser por causa do meu trabalho.»', certa: 'personalizacao', porque: 'Assume ser a causa de algo sem qualquer prova.' },
          { frase: '«Ela não respondeu à mensagem. Acha que sou um peso.»', certa: 'inferencia', porque: 'Tira uma conclusão sobre o que o outro pensa sem nenhuma evidência.' },
          { frase: '«Cinco pessoas gostaram da apresentação, mas uma fez uma crítica. Correu mal.»', certa: 'filtro', porque: 'Fica só com o negativo e ignora o resto.' }
        ], opcoes: {
          catastrofizacao: 'Catastrofização',
          personalizacao: 'Personalização',
          inferencia: 'Leitura da mente',
          filtro: 'Filtro negativo'
        } },
        { tipo: 'ferramentas', titulo: 'O que ajuda', itens: [
          { nome: 'Dar nome à emoção', texto: 'Dizer para ti «isto é raiva» ou «isto é medo» baixa a intensidade (Lieberman et al., 2007). É o que faz a pausa no jogo.' },
          { nome: 'Pôr o pensamento à prova', texto: 'Que provas tenho? Há outra explicação? Qual é o desfecho mais provável, e não o pior? (reavaliação, Gross, 2015)' },
          { nome: 'Respirar', texto: 'Duas inspirações seguidas pelo nariz e uma expiração longa pela boca, durante um ou dois minutos. Baixa a ativação e melhora o humor (Balban et al., 2023).' },
          { nome: 'Ir por degraus', texto: 'Enfrentar primeiro as situações mais fáceis e subir aos poucos. É assim que a ansiedade perde força (Craske et al., 2014).' }
        ] },
        { tipo: 'escada', titulo: 'Exercício: a tua escada', instrucao: 'Escolhe três a cinco situações em que te custa ser assertivo e ordena-as, da mais fácil (em baixo) para a mais difícil (em cima). Ficam guardadas só neste navegador.', situacoes: [
          'Fazer uma pergunta numa aula cheia',
          'Pedir ajuda quando não estou a conseguir',
          'Dizer que não a um favor quando já tenho a semana cheia',
          'Discordar de alguém numa reunião de grupo',
          'Pedir a um colega que cumpra o prazo combinado',
          'Devolver um produto que veio com defeito',
          'Pedir a um professor que explique uma nota',
          'Dizer a um amigo que algo que disse me magoou',
          'Dizer à família que não vou a um almoço'
        ] }
      ]
    },

    {
      id: 'pratica',
      titulo: 'Pôr em prática',
      blocos: [
        { tipo: 'texto', p: [
          'Uma estrutura simples ajuda quando as palavras não saem: o que aconteceu, como te sentes, que impacto tem, o que preferes. Com o tempo, a estrutura deixa de ser precisa e as palavras passam a ser tuas.'
        ] },
        { tipo: 'construtor', titulo: 'Exercício: montar uma frase', instrucao: 'Um colega chega atrasado às reuniões do grupo. Escolhe uma peça para cada parte da frase. Em cada parte, só uma das peças é assertiva.', campos: [
          { id: 'quando', rotulo: 'Quando...', pecas: [
            { texto: 'chegas sempre atrasado', certa: false, porque: '«Sempre» é uma generalização. O colega vai discutir a palavra, não o problema.' },
            { texto: 'chegas meia hora depois da hora combinada', certa: true, porque: 'Um facto que os dois podem confirmar.' },
            { texto: 'não respeitas o tempo dos outros', certa: false, porque: 'É um juízo sobre a pessoa, não uma descrição do que aconteceu.' }
          ] },
          { id: 'sinto', rotulo: 'fico...', pecas: [
            { texto: 'com raiva', certa: true, porque: 'Nomeia a emoção sem a encolher nem a atirar ao outro.' },
            { texto: 'um bocadinho chateado, mas não é nada', certa: false, porque: 'Minimiza o que sentes. O «não é nada» desfaz a frase.' },
            { texto: 'farto de ti', certa: false, porque: 'Deixa de ser sobre o que sentes e passa a ser um ataque.' }
          ] },
          { id: 'porque', rotulo: 'porque...', pecas: [
            { texto: 'és um egoísta', certa: false, porque: 'Um rótulo. Explica a pessoa, não o impacto.' },
            { texto: 'os outros também já repararam', certa: false, porque: 'Fala pelos outros e transforma a conversa num julgamento de grupo.' },
            { texto: 'perdemos o tempo que tínhamos para decidir', certa: true, porque: 'Diz o impacto concreto do atraso.' }
          ] },
          { id: 'prefiro', rotulo: 'Preferia que...', pecas: [
            { texto: 'avisasses quando sabes que te vais atrasar', certa: true, porque: 'Um pedido concreto, que o colega sabe como cumprir.' },
            { texto: 'mudasses de atitude', certa: false, porque: 'Vago. O colega não sabe o que fazer de diferente.' },
            { texto: 'não te preocupasses, nós esperamos', certa: false, porque: 'Retira o pedido no fim da frase.' }
          ] }
        ] },
        { tipo: 'situacoes', itens: [
          { nome: 'Pedir', texto: 'Pedir ajuda ou um favor de forma clara, sem pedir desculpa por pedir. «Precisava que me ajudasses com isto até sexta. Consegues?»' },
          { nome: 'Dizer não', texto: 'Um não claro, com uma razão curta se quiseres, sem justificações a mais. «Desta vez não consigo, já tenho a semana cheia.»' },
          { nome: 'Pedir desculpa', texto: 'Quando a raiva falou por ti, parar e reparar: «Desculpa, estou com raiva e não estou a gerir isto bem.» As relações que duram não são as que discutem menos, são as que conseguem reparar a meio (Gottman e Levenson, 1999).' },
          { nome: 'Quando o outro não muda', texto: 'Às vezes é preciso insistir. Se, depois de várias tentativas, nada muda, sobram duas saídas: aceitar e flexibilizar, ou afastar-se. Ser assertivo não garante a mudança do outro.' }
        ] },
        { tipo: 'antes', titulo: 'Antes de avançar, vale a pena perguntar', itens: [
          'Sei bem o que aconteceu?',
          'O que quero: resolver, ou ganhar?',
          'Isto é importante para mim, ou é pequeno demais para levantar?',
          'É o momento e o sítio certos?',
          'O que arrisco se falar? E se não disser nada?'
        ] },
        { tipo: 'diario', titulo: 'O teu diário de assertividade', instrucao: 'Mudar a forma de comunicar leva tempo. Três fases ajudam. Escolhe um objetivo para cada fase. Os objetivos entram no diário, que podes copiar para uma nota ou um documento.', fases: [
          { id: 'curto', nome: 'Próximas duas semanas: observar', opcoes: [
            'Reparar quando digo sim querendo dizer não, e o que sinto nesse momento',
            'Reparar quando a raiva sobe antes de eu dar por ela',
            'Reparar nas conversas que evito'
          ] },
          { id: 'medio', nome: 'Próximos três meses: treinar', opcoes: [
            'Fazer um pedido por semana a alguém do grupo',
            'Dizer que não uma vez por semana, sem justificações a mais',
            'Subir um degrau da minha escada de cada vez'
          ] },
          { id: 'longo', nome: 'Daqui para a frente: manter', opcoes: [
            'Ser assertivo também com a família, não só na faculdade',
            'Pedir desculpa quando a raiva falar por mim',
            'Voltar a uma conversa que ficou mal resolvida'
          ] }
        ] }
      ]
    }
  ],

  referencias: [
    'Alberti, R., e Emmons, M. (2017). Your perfect right: Assertiveness and equality in your life and relationships (10.ª ed.). Impact Publishers.',
    'Ames, D. R., e Flynn, F. J. (2007). What breaks a leader: The curvilinear relation between assertiveness and leadership. Journal of Personality and Social Psychology, 92(2), 307-324.',
    'Balban, M. Y., et al. (2023). Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine, 4(1), 100895.',
    'Beck, A. T. (1963). Thinking and depression: I. Idiosyncratic content and cognitive distortions. Archives of General Psychiatry, 9(4), 324-333.',
    'Craske, M. G., Treanor, M., Conway, C. C., Zbozinek, T., e Vervliet, B. (2014). Maximizing exposure therapy: An inhibitory learning approach. Behaviour Research and Therapy, 58, 10-23.',
    'Gottman, J. M., e Levenson, R. W. (1999). What predicts change in marital interaction over time? A study of alternative models. Family Process, 38(2), 143-158.',
    'Gross, J. J. (2015). Emotion regulation: Current status and future prospects. Psychological Inquiry, 26(1), 1-26.',
    'Lieberman, M. D., et al. (2007). Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli. Psychological Science, 18(5), 421-428.',
    'Orobio de Castro, B., Veerman, J. W., Koops, W., Bosch, J. D., e Monshouwer, H. J. (2002). Hostile attribution of intent and aggressive behavior: A meta-analysis. Child Development, 73(3), 916-934.',
    'Speed, B. C., Goldstein, B. L., e Goldfried, M. R. (2018). Assertiveness training: A forgotten evidence-based treatment. Clinical Psychology: Science and Practice, 25(1), e12216.'
  ]
};
