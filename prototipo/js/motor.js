// Regras do jogo. Não toca no DOM, para poder ser testado em Node.
(function (global) {
  const MAX = 10;
  // Faixas da raiva: calma 0-2, tensa 3-4, alta 5 ou mais. A raiva sobe devagar,
  // sobretudo com as respostas do outro, por isso os limites ficam baixos na escala de 10.
  const TENSA = 3;
  const ALTA = 5;
  const CONTAGIO = ALTA;   // a partir desta raiva do outro, a tua sobe um ponto por turno
  const TIPOS_CONVERSA = ['colaborar', 'competir', 'ceder', 'evitar'];
  // A previsão faz-se em três grupos. A reação de cada resposta (op.reage) mantém o detalhe.
  const GRUPO_REACAO = { abre: 'aproxima', justifica: 'aproxima', defende: 'defende', afasta: 'defende', nada: 'nada' };

  const limitar = (v) => Math.max(0, Math.min(MAX, v));

  // Banda de raiva, usada nos pensamentos e na expressão.
  function banda(raiva) {
    if (raiva < TENSA) return 'calmo';
    if (raiva < ALTA) return 'tenso';
    return 'quente';
  }

  function novo(cenario, verdade) {
    const vs = cenario.verdades || [null];
    const e = {
      cen: cenario,
      verdade: verdade || vs[Math.floor(Math.random() * vs.length)],
      no: null,
      eu: cenario.inicial.eu,
      outro: cenario.inicial.outro,
      relacao: cenario.inicial.relacao,
      adiado: 0,
      pausas: 0,
      pausouAqui: false,
      raivaMax: cenario.inicial.eu,
      historico: [],
      escondidas: new Map(),   // resposta escondida pela raiva -> texto
      leitura: null,          // { certa, texto }
      primeiraReacao: null,   // { texto, lente }
      marcas: {},
      eco: null,              // efeito da última resposta
      previsoes: [],          // { outroPrev, outroReal, euPrev, euReal }
      conversa: [],           // a conversa turno a turno, para rever no fim
      assertivaQuente: null,  // primeira resposta assertiva com raiva que esteve disponível
      efeitoFala: null,       // efeito da fala do outro ao entrar no nó
      avisos: []
    };
    entrar(e, 'inicio');
    return e;
  }

  // Nó atual com a variante da verdade sorteada aplicada por cima.
  function no(e, id) {
    const base = e.cen.nos[id];
    if (!base) throw new Error('Nó inexistente: ' + id);
    const v = base.variantes && base.variantes[e.verdade];
    return v ? Object.assign({}, base, v) : base;
  }

  function atual(e) {
    return no(e, e.no);
  }

  function aplicar(e, efeitos) {
    if (!efeitos) return;
    for (const k of ['eu', 'outro', 'relacao']) {
      if (efeitos[k]) e[k] = limitar(e[k] + efeitos[k]);
    }
    if (efeitos.adiado) e.adiado += efeitos.adiado;
    e.raivaMax = Math.max(e.raivaMax, e.eu);
  }

  function entrar(e, id) {
    e.no = id;
    const n = atual(e);
    e.pausouAqui = false;
    const antes = { eu: e.eu, outro: e.outro };
    aplicar(e, n.entrada);
    if (n.marca) e.marcas[n.marca] = true;

    let contagio = false;
    if (!n.fim && e.outro >= CONTAGIO) {
      e.eu = limitar(e.eu + 1);
      e.raivaMax = Math.max(e.raivaMax, e.eu);
      contagio = true;
    }
    e.efeitoFala = { eu: e.eu - antes.eu, outro: e.outro - antes.outro, contagio };
    if (!n.fim && e.outro >= MAX) entrar(e, e.cen.explosao);
  }

  // Opções visíveis, cada uma com estado 'livre' ou 'escondida'.
  // As que exigem mais raiva do que a atual não aparecem de todo.
  function opcoes(e) {
    const n = atual(e);
    if (!n.opcoes) return [];
    return n.opcoes
      .map((op, i) => {
        const r = op.requer || {};
        let estado = 'livre';
        if (r.euMin != null && e.eu < r.euMin) estado = 'ausente';
        else if (r.euMax != null && e.eu > r.euMax) {
          estado = 'escondida';
          e.escondidas.set(e.no + ':' + i, op.texto);
        }
        if (estado === 'livre' && op.postura === 'assertiva' && r.euMin != null && !e.assertivaQuente) {
          e.assertivaQuente = op.texto;
        }
        return Object.assign({}, op, { i, estado });
      })
      .filter((op) => op.estado !== 'ausente');
  }

  // previsao (opcional): { outro: 'abre'|'justifica'|'defende'|'afasta'|'nada' }
  // O que sentiu depois da reação do outro regista-se com sentir().
  function escolher(e, i, previsao) {
    const n = atual(e);
    const op = n.opcoes[i];
    const r = op.requer || {};
    if (r.euMax != null && e.eu > r.euMax) return false;
    if (r.euMin != null && e.eu < r.euMin) return false;

    e.avisos = [];
    if (op.tipo === 'leitura') {
      e.leitura = { certa: op.certaSe === e.verdade, texto: op.texto };
      // Fica também no turno que a provocou, para a revisão final.
      const turno = e.conversa[e.conversa.length - 1];
      if (turno && !turno.pausa) turno.leitura = e.leitura;
    } else if (op.tipo === 'reacao') {
      e.primeiraReacao = { texto: op.texto, lente: op.lente };
    } else {
      e.historico.push({ no: e.no, tipo: op.tipo, postura: op.postura, texto: op.texto, eu: e.eu, outro: e.outro });
    }
    const antes = { eu: e.eu, outro: e.outro };
    // Respostas que a raiva escondia neste momento, para mostrar ao rever a conversa.
    const tapadas = (n.opcoes || [])
      .filter((o) => o.requer && o.requer.euMax != null && e.eu > o.requer.euMax)
      .map((o) => o.texto);
    aplicar(e, op.efeitos);
    e.eco = {
      texto: op.texto,
      tipo: op.tipo,
      falada: TIPOS_CONVERSA.includes(op.tipo),
      ouviu: op.ouviu || null,
      eu: e.eu - antes.eu,
      outro: e.outro - antes.outro
    };
    entrar(e, op.vai);

    // O efeito em ti conta a resposta e a reação do Tomás a seguir.
    if (e.eco.falada) {
      const d = e.eco.eu + (e.efeitoFala ? e.efeitoFala.eu : 0);
      e.eco.euTotal = d;
      e.eco.euReal = d > 0 ? 'sobe' : d < 0 ? 'desce' : 'igual';
      e.eco.outroReal = GRUPO_REACAO[op.reage] || null;
      if (previsao) {
        e.eco.previsao = previsao;
        e.previsoes.push({ outroPrev: previsao.outro, outroReal: GRUPO_REACAO[op.reage], euPrev: null, euReal: e.eco.euReal });
      }
      e.conversa.push({
        texto: op.texto,
        postura: op.postura || null,
        ouviu: op.ouviu || null,
        outroPrev: previsao ? previsao.outro : null,
        outroReal: GRUPO_REACAO[op.reage] || null,
        reacao: op.reage || null,
        resposta: atual(e).fala || null,
        euAntes: antes.eu,
        euDepois: e.eu,
        euPrev: null,
        emocao: null,
        tapadas
      });
    }
    return true;
  }

  // Depois de ouvir o outro: a tua raiva subiu, ficou igual ou desceu?
  function preverEu(e, valor) {
    const ult = e.previsoes[e.previsoes.length - 1];
    if (ult) ult.euPrev = valor;
    const fala = e.conversa[e.conversa.length - 1];
    if (fala) fala.euPrev = valor;
    if (e.eco) e.eco.previsaoEu = valor;
  }

  // Depois de ouvir o outro: o que sentes (emoção escolhida pelo jogador).
  // Fica registada, mas não mexe na raiva do motor.
  function sentir(e, emocao) {
    const fala = e.conversa[e.conversa.length - 1];
    if (fala) { fala.sentiu = true; fala.emocao = emocao || null; }
    if (e.eco) e.eco.emocao = emocao;
  }

  // O pensamento segue a faixa indicada (a da emoção que o jogador escolheu) ou, sem ela, a raiva do motor.
  function pensamento(e, faixa) {
    const n = atual(e);
    return n.pensamentos ? n.pensamentos[faixa || banda(e.eu)] : null;
  }

  function podePausar(e) {
    const n = atual(e);
    return !n.fim && !n.leitura && n.opcoes && n.opcoes[0].tipo !== 'reacao' && !e.pausouAqui;
  }

  // Nomear a emoção baixa a raiva (affect labeling). "Não sei bem" baixa menos.
  function pausa(e, rotulo) {
    e.avisos = [];
    e.eco = null;
    e.pausas += 1;
    e.pausouAqui = true;
    e.eu = limitar(e.eu - (rotulo ? 2 : 1));
    e.historico.push({ no: e.no, tipo: 'pausa', rotulo: rotulo || null, eu: e.eu, outro: e.outro });
    e.conversa.push({ pausa: true, rotulo: rotulo || null });
    // Pausas a mais leem-se como fuga.
    if (e.pausas > 2) {
      e.outro = limitar(e.outro + 1);
      e.avisos.push(e.cen.outro + ': «' + e.cen.reacaoPausa + '»');
    }
  }

  // Olhar a cena de fora (distanciamento) baixa mais um ponto.
  function distanciar(e) {
    e.eu = limitar(e.eu - 1);
    const ult = e.historico[e.historico.length - 1];
    if (ult && ult.tipo === 'pausa') ult.distanciou = true;
    const p = e.conversa[e.conversa.length - 1];
    if (p && p.pausa) p.distanciou = true;
  }

  function resumo(e) {
    const contagem = { colaborar: 0, competir: 0, ceder: 0, evitar: 0 };
    for (const h of e.historico) if (h.tipo in contagem) contagem[h.tipo] += 1;
    const posturas = { assertiva: 0, agressiva: 0, passiva: 0, 'passivo-agressiva': 0 };
    const quentes = { assertiva: 0, agressiva: 0, passiva: 0, 'passivo-agressiva': 0 };   // respostas dadas com raiva alta
    const exemplos = {};
    for (const h of e.historico) {
      if (!h.postura) continue;
      posturas[h.postura] += 1;
      if (h.eu >= ALTA) quentes[h.postura] += 1;
      if (!exemplos[h.postura]) exemplos[h.postura] = h.texto;
    }
    const pv = e.previsoes;
    const erros = {};
    for (const x of pv) if (x.outroPrev !== x.outroReal) {
      const k = x.outroPrev + '>' + x.outroReal;
      erros[k] = (erros[k] || 0) + 1;
    }
    const erroTipico = Object.entries(erros).sort((a, b) => b[1] - a[1])[0];
    return {
      contagem,
      posturas,
      quentes,
      exemplos,
      assertivaQuente: e.assertivaQuente,
      previsoes: {
        total: pv.length,
        outro: pv.filter((x) => x.outroPrev === x.outroReal).length,
        eu: pv.filter((x) => x.euPrev && x.euPrev === x.euReal).length,
        totalEu: pv.filter((x) => x.euPrev).length,
        erroTipico: erroTipico && erroTipico[1] > 1 ? erroTipico[0].split('>') : null
      },
      pausas: e.pausas,
      raivaMax: e.raivaMax,
      escondidas: e.escondidas.size,
      textosEscondidos: [...e.escondidas.values()],
      conversa: e.conversa,
      leitura: e.leitura,
      primeiraReacao: e.primeiraReacao,
      verdade: e.verdade,
      relacao: e.relacao,
      adiado: e.adiado,
      sabe: !!e.marcas.sabe
    };
  }

  const Motor = { MAX, TENSA, ALTA, banda, novo, atual, opcoes, escolher, preverEu, sentir, pensamento, podePausar, pausa, distanciar, resumo };
  if (typeof module !== 'undefined' && module.exports) module.exports = Motor;
  else global.Motor = Motor;
})(typeof window !== 'undefined' ? window : globalThis);
