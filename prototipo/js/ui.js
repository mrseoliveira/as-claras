(function () {
  const NOME_JOGO = 'Às Claras';   // provisório
  const ORDEM = ['grupo', 'amiga', 'docente'];
  const CHAVE = 'asclaras-resultados';
  const CHAVE_INTRO = 'asclaras-introducao-vista';

  // Previsão: antes de dizer, o que a resposta vai fazer ao outro.
  const REAGE = { aproxima: 'Aproxima-se ou justifica-se', defende: 'Defende-se ou afasta-se', nada: 'Não dá por nada' };
  // No fim, o que aconteceu mostra-se com o detalhe.
  const REACAO = { abre: 'aproximou-se', justifica: 'justificou-se', defende: 'defendeu-se', afasta: 'afastou-se', nada: 'não deu por nada' };

  // «E tu?»: depois de o outro reagir, o que sentes. Lista provisória (por decidir, ver estado.md).
  // A faixa de cada emoção escolhe o pensamento «Por dentro». Não mexe na raiva do motor.
  const EMOCOES = {
    calma: { emoji: '😌', nome: 'Calma', faixa: 'calmo' },
    curiosidade: { emoji: '🤔', nome: 'Curiosidade', faixa: 'calmo' },
    tristeza: { emoji: '😔', nome: 'Tristeza', faixa: 'tenso' },
    medo: { emoji: '😟', nome: 'Medo', faixa: 'tenso' },
    irritacao: { emoji: '😤', nome: 'Irritação', faixa: 'tenso' },
    raiva: { emoji: '😠', nome: 'Raiva', faixa: 'quente' }
  };

  const POSTURAS = [
    ['assertiva', 'Assertivas'],
    ['agressiva', 'Agressivas'],
    ['passiva', 'Passivas'],
    ['passivo-agressiva', 'Passivo-agressivas']
  ];
  const DEF_ASSERTIVA = 'Uma resposta assertiva diz o que sentes e o que precisas, de forma direta, sem atacar a outra pessoa e sem desistir de ti. A raiva pode estar lá dentro.';
  const LENTES = { 'injustiça': 'a injustiça', 'ameaça': 'a ameaça ao que é teu', 'desrespeito': 'sentir desrespeito' };

  const $ = (sel) => document.querySelector(sel);
  const jogo = $('.jogo');
  const palco = $('#palco');
  const painel = $('#painel');
  const hud = $('#hud');
  const conversa = $('#conversa');

  let estado = null;
  // introducao | menu | sentir (o outro reagiu, dizes o que sentes, se quiseres) | responder | prever
  // | pausa | pausa2 | distancia | fim | perfil
  // Se o registo estiver configurado, o consentimento vem antes de tudo, em cada visita
  // (nos laboratórios o computador é partilhado, não se herda o consentimento de outra pessoa).
  const depoisConsentimento = () => (introducaoVista() ? 'menu' : 'introducao');
  let modo = Registo.configurado() ? 'consentimento' : depoisConsentimento();
  let partida = 0;
  let desde = 0;             // quando apareceu a pergunta atual, para medir o tempo de resposta
  let passoIntro = 0;
  let rotuloPausa = null;
  let pendente = null;
  let previsao = { outro: null };
  let registo = [];          // a conversa no ecrã, de cima para baixo
  let voltarPara = 'responder';
  let pensamento = null;     // o pensamento automático do momento, na nuvem da cena
  let resultados = carregar();

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const maiusc = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const semAspas = (s) => s.replace(/^«|»$/g, '');

  // Referências ao outro com o artigo certo: o Tomás, a Inês, o professor Vidal.
  function ref(forma) {
    const c = estado.cen;
    const a = (c.artigos || { o: 'o', ao: 'ao', do: 'do', no: 'no' })[forma];
    return `${a} ${c.outro}`;
  }
  const nomeCurto = () => estado.cen.nomeCurto || estado.cen.outro;

  // Resultados guardados só neste navegador, para o perfil entre cenários.
  function carregar() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch (_) { return {}; }
  }
  function introducaoVista() {
    try { return localStorage.getItem(CHAVE_INTRO) === '1'; } catch (_) { return false; }
  }
  function marcarIntroducao() {
    try { localStorage.setItem(CHAVE_INTRO, '1'); } catch (_) { /* volta a aparecer na próxima visita */ }
  }
  function guardar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(resultados)); } catch (_) { /* sem armazenamento, fica só em memória */ }
  }

  function medidor(quem, nome, valor) {
    const pct = (valor / Motor.MAX) * 100;
    const cor = valor < Motor.TENSA ? 'var(--turquesa)' : valor < Motor.ALTA ? 'var(--amarelo)' : 'var(--coral)';
    return `
      <div class="medidor medidor-${quem}">
        <span class="medidor-nome">${esc(nome)}</span>
        <div class="medidor-barra" role="meter" aria-label="Raiva de ${esc(nome)}" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${valor}">
          <div class="medidor-enchimento" style="width:${pct}%;background-color:${cor}"></div>
        </div>
        <span class="medidor-valor">${valor}</span>
      </div>`;
  }

  // Enquanto não dizes o que sentes, o medidor e a cena ficam no valor de antes.
  function euVisivel() {
    return modo === 'sentir' && estado.eco ? estado.eu - estado.eco.euTotal : estado.eu;
  }

  function desenharHud() {
    const no = Motor.atual(estado);
    hud.innerHTML = `
      ${medidor('eu', 'Tu', euVisivel())}
      <span class="hora">${esc(no.hora || '')}</span>
      ${no.ausente ? '<div></div>' : medidor('outro', nomeCurto(), estado.outro)}`;
  }

  // ---------- A conversa, que cresce para baixo ----------

  // Ao entrar num nó: o que se vê e o que o outro diz entram na conversa.
  // Se previste a reação do outro, a seguir perguntamos o que sentes, e só depois vem o pensamento.
  function ouvirNo(perguntarEmocao) {
    const no = Motor.atual(estado);
    pensamento = null;
    if (no.fim) { modo = faseResposta(); return; }
    if (no.narracao) registo.push({ quem: 'narra', texto: no.narracao });
    if (no.fala) registo.push({ quem: 'outro', texto: no.fala });
    if (no.fala && perguntarEmocao) { modo = 'sentir'; return; }
    pensar(null);
    modo = faseResposta();
  }

  function pensar(emocao) {
    pensamento = Motor.pensamento(estado, emocao ? EMOCOES[emocao].faixa : null);
  }

  function faseResposta() {
    const no = Motor.atual(estado);
    if (no.fim) {
      const r = Motor.resumo(estado);
      resultados[estado.cen.id] = r;
      guardar();
      Registo.evento('fim', {
        no: estado.no, verdade: r.verdade, relacao: r.relacao, adiado: r.adiado, sabe: r.sabe,
        raivaMax: r.raivaMax, pausas: r.pausas, escondidas: r.escondidas, posturas: r.posturas,
        previsoes: { certas: r.previsoes.outro, total: r.previsoes.total },
        leituraCerta: r.leitura ? r.leitura.certa : null,
        gatilho: r.primeiraReacao ? r.primeiraReacao.lente : null
      });
      return 'fim';
    }
    return 'responder';
  }

  function registarFala(op) {
    registo.push({ quem: 'eu', texto: semAspas(op.texto) });
    if (op.ouviu) registo.push({ quem: 'nota', texto: `${maiusc(ref('o'))} ouviu ${op.ouviu}.` });
  }

  function linha(r) {
    if (r.quem === 'contexto') return `<p class="contexto">${esc(r.texto)}</p>`;
    if (r.quem === 'narra') return `<p class="msg-narra">${esc(r.texto)}</p>`;
    if (r.quem === 'nota') return `<p class="msg-nota">${esc(r.texto)}</p>`;
    if (r.quem === 'aviso') return `<p class="msg-nota aviso">${esc(r.texto)}</p>`;
    if (r.quem === 'sente') return `<p class="msg-sente">Sentiste: ${esc(r.texto)}</p>`;
    if (r.quem === 'pensa') return `<p class="msg-sente">Pensaste: ${esc(r.texto)}</p>`;
    const outro = r.quem === 'outro';
    return `
      <div class="msg ${outro ? 'msg-outro' : 'msg-eu'}">
        <span class="msg-nome">${esc(outro ? nomeCurto() : 'Tu')}</span>
        <p>${esc(r.texto)}</p>
      </div>`;
  }

  function desenharConversa() {
    conversa.innerHTML = registo.map(linha).join('');
  }

  // ---------- Zona de responder, em baixo ----------

  function chips(grupo, mapa, escolhido) {
    return `<div class="chips" role="group">${Object.entries(mapa).map(([k, v]) =>
      `<button class="chip${escolhido === k ? ' ativo' : ''}" data-prev="${grupo}" data-valor="${k}" aria-pressed="${escolhido === k}">${esc(v)}</button>`).join('')}</div>`;
  }

  function botaoPausa() {
    return Motor.podePausar(estado) ? '<button class="pausa" data-acao="pausa">Fazer uma pausa</button>' : '';
  }

  function desenharSentir() {
    painel.innerHTML = `
      <p class="zona-pergunta">Depois de ouvires isto, o que sentes?</p>
      <div class="chips chips-emocao" role="group">
        ${Object.entries(EMOCOES).map(([k, em]) =>
          `<button class="chip" data-sentir="${k}"><span class="emoji" aria-hidden="true">${em.emoji}</span> ${esc(em.nome)}</button>`).join('')}
        <button class="chip chip-neutro" data-acao="sem-emocao">Seguir sem escolher</button>
      </div>`;
  }

  function botaoOpcao(op) {
    if (op.estado === 'escondida') {
      return `
        <button class="opcao escondida" disabled aria-label="Resposta indisponível com esta raiva">
          <span class="opcao-texto" aria-hidden="true">${esc(op.texto)}</span>
          <span class="opcao-nota">Com esta raiva, esta resposta não te ocorre.</span>
        </button>`;
    }
    const quente = op.requer && op.requer.euMin != null ? ' quente' : '';
    return `<button class="opcao${quente}" data-i="${op.i}">${esc(op.texto)}</button>`;
  }

  function desenharResponder() {
    const no = Motor.atual(estado);
    const ops = Motor.opcoes(estado);
    const pergunta = no.leitura || no.pergunta || 'O que respondes?';
    painel.innerHTML = `
      <p class="zona-pergunta">${esc(pergunta)}</p>
      ${no.nota ? `<p class="vez-nota">${esc(no.nota)}</p>` : ''}
      <div class="opcoes">${ops.map(botaoOpcao).join('')}</div>
      ${botaoPausa()}`;
  }

  function desenharPrever() {
    const op = Motor.atual(estado).opcoes[pendente];
    const pronto = !!previsao.outro;
    painel.innerHTML = `
      <p class="zona-escrita">Vais dizer: ${esc(semAspas(op.texto))}</p>
      <p class="zona-pergunta">O que achas que isto vai fazer ${esc(ref('ao'))}?</p>
      ${chips('outro', REAGE, previsao.outro)}
      <div class="acoes">
        <button class="avancar" data-acao="dizer" ${pronto ? '' : 'disabled'}>Dizer</button>
        <button class="pausa secundario" data-acao="trocar">Escolher outra resposta</button>
      </div>`;
  }

  function desenharPausa() {
    const emocoes = estado.cen.emocoes || ['Raiva', 'Frustração', 'Medo', 'Cansaço'];
    painel.innerHTML = `
      <p class="zona-pergunta">Pausa. Antes de responder, o que estás a sentir agora?</p>
      <div class="emocoes">
        ${emocoes.map((em) => `<button class="chip" data-emocao="${esc(em)}">${esc(em)}</button>`).join('')}
        <button class="chip chip-neutro" data-emocao="">Não sei bem</button>
      </div>`;
  }

  function desenharPausa2() {
    painel.innerHTML = `
      <div class="opcoes">
        <button class="opcao" data-acao="distanciar">Olhar para a cena de fora</button>
        <button class="opcao" data-acao="voltar">Voltar à conversa</button>
      </div>`;
  }

  function desenharDistanciamento() {
    painel.innerHTML = `
      <div class="opcoes"><button class="opcao" data-acao="voltar">Voltar à conversa</button></div>`;
  }

  function lista(itens) {
    return `<ul>${itens.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  }

  // A conversa outra vez, resposta a resposta: o que disseste, como foi ouvido,
  // o que previste e o que aconteceu. Aberta e em destaque, e as surpresas sobressaem.
  function rever(conversa) {
    // a conversa aqui é a do motor, não o registo do ecrã
    if (!conversa || !conversa.some((t) => !t.pausa)) return '';
    const postura = Object.fromEntries(POSTURAS.map(([k, v]) => [k, v.slice(0, -1).toLowerCase()]));
    const reage = (k) => REAGE[k].toLowerCase();
    let n = 0;
    const itens = conversa.map((t) => {
      if (t.pausa) {
        return `<li class="rever-pausa">Pausa${t.rotulo ? `: deste o nome «${esc(t.rotulo.toLowerCase())}» ao que sentias` : ''}${t.distanciou ? ', e olhaste para a cena de fora' : ''}.</li>`;
      }
      n += 1;
      const linhas = [];
      let falhou = false;
      if (t.ouviu) linhas.push(`${esc(maiusc(ref('o')))} ouviu ${esc(t.ouviu)}.`);
      if (t.outroPrev) {
        const certo = t.outroPrev === t.outroReal;
        linhas.push(`<strong>Previste:</strong> ${esc(reage(t.outroPrev))}. ${esc(maiusc(ref('o')))} ${esc(REACAO[t.reacao] || reage(t.outroReal))}.`);
        if (!certo) falhou = true;
      }
      if (t.emocao && EMOCOES[t.emocao]) {
        const em = EMOCOES[t.emocao];
        linhas.push(`Depois da resposta ${esc(ref('do'))}, sentiste: ${em.emoji} ${esc(em.nome.toLowerCase())}.`);
      }
      if (t.postura) linhas.push(`<strong>Postura:</strong> ${esc(postura[t.postura])}.`);
      const tapada = t.tapadas && t.tapadas[0]
        ? `<p class="rever-tapada">Com menos raiva, também podias ter dito: «${esc(semAspas(t.tapadas[0]))}»</p>` : '';
      return `
        <li${falhou ? ' class="rever-surpresa"' : ''}>
          ${falhou ? '<span class="rever-falhou">Não era o que esperavas</span>' : ''}
          <p class="rever-tu"><span class="rever-n">${n}</span> Tu: ${esc(t.texto)}</p>
          ${linhas.map((l) => `<p>${l}</p>`).join('')}
          ${t.resposta ? `<p class="rever-outro">${esc(nomeCurto())}: ${esc(t.resposta)}</p>` : ''}
          ${tapada}
        </li>`;
    }).join('');
    return `
      <section class="rever">
        <h3>A tua conversa, resposta a resposta</h3>
        <ol>${itens}</ol>
      </section>`;
  }

  // Final de um cenário: o que aconteceu, o balanço, e pouco mais.
  function desenharFim() {
    const no = Motor.atual(estado);
    const r = Motor.resumo(estado);
    const cen = estado.cen;
    const texto = r.sabe && no.textoSabe ? no.textoSabe : no.texto;
    const perdas = [...(no.balanco ? no.balanco.perdas : [])];
    if (!r.sabe) perdas.push(`Saber o que se passava com ${ref('o')}`);

    let exemplo = '';
    if (r.exemplos.assertiva) exemplo = `Uma resposta tua assertiva: <span class="citacao">«${esc(semAspas(r.exemplos.assertiva))}»</span>`;
    else if (r.assertivaQuente) exemplo = `Com raiva, esteve ao teu alcance esta resposta assertiva: <span class="citacao">«${esc(semAspas(r.assertivaQuente))}»</span>`;

    const pv = r.previsoes;
    const i = ORDEM.indexOf(cen.id);
    const seguinte = ORDEM[i + 1];
    const todos = ORDEM.every((id) => resultados[id]);

    painel.innerHTML = `
      <h2 class="fim-titulo">${esc(no.titulo)}</h2>
      <p class="narracao">${esc(texto)}</p>
      <div class="balanco">
        <div><h4>O que ganhaste</h4>${lista(no.balanco ? no.balanco.ganhos : [])}</div>
        <div><h4>O que perdeste</h4>${lista(perdas)}</div>
      </div>
      ${rever(r.conversa)}
      ${r.textosEscondidos.length ? `
      <div class="escondidas-fim">
        <h4>Com menos raiva, estas respostas estavam ao teu alcance</h4>
        ${lista(r.textosEscondidos.slice(0, 3).map(semAspas))}
      </div>` : ''}
      <div class="espelho">
        ${r.primeiraReacao ? `<p>${esc(cen.gatilhos[r.primeiraReacao.lente] || '')}</p>` : ''}
        <p class="definicao">${esc(DEF_ASSERTIVA)}</p>
        ${exemplo ? `<p>${exemplo}</p>` : ''}
        ${pv.total ? `<p>Acertaste na reação ${esc(ref('do'))} em ${pv.outro} de ${pv.total} respostas${pv.totalEu ? `, e no que aconteceu à tua raiva em ${pv.eu} de ${pv.totalEu}` : ''}.</p>` : ''}
        <p class="espelho-nota">Nesta partida, ${esc(cen.descricaoVerdade[r.verdade])}. Noutra partida pode ser diferente.</p>
      </div>
      <div class="acoes">
        ${todos ? '<button class="avancar" data-acao="perfil">Ver o teu perfil</button>' : ''}
        ${!todos && seguinte ? `<button class="avancar" data-cenario="${seguinte}">Cenário ${i + 2}</button>` : ''}
        <button class="pausa secundario" data-cenario="${cen.id}">Jogar outra vez</button>
        <button class="pausa secundario" data-acao="menu">Voltar aos cenários</button>
      </div>`;
  }

  // n de total, com a barra em proporção do total.
  function barra(rotulo, n, total) {
    const pct = total ? (n / total) * 100 : 0;
    return `
      <div class="espelho-linha">
        <span>${rotulo}</span>
        <div class="espelho-barra"><div style="width:${pct}%"></div></div>
        <span class="espelho-n">${n} de ${total}</span>
      </div>`;
  }

  // Perfil: só depois dos três cenários, porque um padrão precisa de mais do que uma conversa.
  function desenharPerfil() {
    hud.innerHTML = '';
    palco.innerHTML = `<div class="titulo-jogo"><h1>${esc(NOME_JOGO)}</h1><p>O teu perfil</p></div>`;
    const rs = ORDEM.map((id) => ({ cen: window.CENARIOS[id], r: resultados[id] })).filter((x) => x.r);

    const somar = (campo) => {
      const t = { assertiva: 0, agressiva: 0, passiva: 0, 'passivo-agressiva': 0 };
      for (const x of rs) for (const k in t) t[k] += x.r[campo][k] || 0;
      return t;
    };
    const posturas = somar('posturas');
    const quentes = somar('quentes');
    const totalP = Object.values(posturas).reduce((a, b) => a + b, 0);
    const totalQ = Object.values(quentes).reduce((a, b) => a + b, 0);

    // Gatilho que se repete entre cenários.
    const contaLentes = {};
    for (const x of rs) {
      const l = x.r.primeiraReacao && x.r.primeiraReacao.lente;
      if (LENTES[l]) contaLentes[l] = (contaLentes[l] || 0) + 1;
    }
    const [lente, vezes] = Object.entries(contaLentes).sort((a, b) => b[1] - a[1])[0] || [];
    const gatilho = vezes >= 2
      ? `Em ${vezes} dos ${rs.length} cenários, o primeiro gatilho da tua raiva foi ${LENTES[lente]}.`
      : 'O primeiro gatilho da tua raiva mudou de cenário para cenário.';
    const maisQuente = rs.slice().sort((a, b) => b.r.raivaMax - a.r.raivaMax)[0];

    const pv = rs.reduce((a, x) => ({
      ok: a.ok + x.r.previsoes.outro,
      total: a.total + x.r.previsoes.total,
      okEu: a.okEu + (x.r.previsoes.eu || 0),
      totalEu: a.totalEu + (x.r.previsoes.totalEu || 0)
    }), { ok: 0, total: 0, okEu: 0, totalEu: 0 });

    painel.innerHTML = `
      <h2 class="fim-titulo">O teu perfil nos três cenários</h2>
      <section class="espelho-bloco">
        <h3>O que te dá raiva</h3>
        <p>${esc(gatilho)}</p>
        <p>A raiva subiu mais no cenário «${esc(maisQuente.cen.titulo)}», onde chegou a ${maisQuente.r.raivaMax} em 10.</p>
      </section>
      <section class="espelho-bloco">
        <h3>Como disseste as coisas</h3>
        <p>Nos três cenários deste ${totalP} respostas. Cada uma conta uma vez, na forma que teve.</p>
        ${POSTURAS.map(([k, nome]) => barra(nome, posturas[k], totalP)).join('')}
      </section>
      <section class="espelho-bloco">
        <h3>Com raiva</h3>
        ${totalQ ? `
          <p>Destas ${totalP} respostas, ${totalQ} foram dadas com a tua raiva em ${Motor.ALTA} ou mais (em 10). Dessas ${totalQ}:</p>
          ${POSTURAS.map(([k, nome]) => barra(nome, quentes[k], totalQ)).join('')}`
          : `<p>A tua raiva nunca chegou a ${Motor.ALTA} (em 10) no momento de responder.</p>`}
        <p class="definicao">${esc(DEF_ASSERTIVA)}</p>
      </section>
      ${pv.total ? `<section class="espelho-bloco"><h3>O que previste</h3><p>Acertaste na reação da outra pessoa em ${pv.ok} de ${pv.total} respostas${pv.totalEu ? `, e no que aconteceu à tua raiva em ${pv.okEu} de ${pv.totalEu}` : ''}.</p></section>` : ''}
      <div class="acoes">
        <button class="avancar" data-acao="menu">Voltar aos cenários</button>
        <button class="pausa secundario" data-acao="apagar">Apagar resultados</button>
      </div>`;
  }

  function desenharConsentimento() {
    hud.innerHTML = '';
    palco.innerHTML = `<div class="titulo-jogo titulo-intro"><h1>${esc(NOME_JOGO)}</h1><p>Antes de começar</p></div>`;
    painel.innerHTML = `
      <p class="intro-texto">Este jogo faz parte de um estudo sobre conversas difíceis. Se aceitares, as tuas escolhas ficam registadas: as respostas, as previsões, as emoções, as pausas e o tempo que demoras a decidir.</p>
      <p class="intro-texto">Não é registado o teu nome, o teu email nem o endereço do computador. Podes desistir a qualquer momento, basta fechar a página. Jogar sem registar é igual em tudo.</p>
      <label class="zona-pergunta" for="codigo">Código anónimo (opcional)</label>
      <p class="vez-nota">Para ligar este jogo aos questionários: as duas primeiras letras do nome da tua mãe e o dia em que nasceste, por exemplo MA07.</p>
      <input id="codigo" class="codigo" maxlength="20" autocomplete="off" spellcheck="false">
      <div class="acoes">
        <button class="avancar" data-acao="aceitar">Aceito, registar as minhas escolhas</button>
        <button class="pausa secundario" data-acao="recusar">Jogar sem registar</button>
      </div>`;
  }

  function desenharIntroducao() {
    const passos = window.INTRODUCAO;
    const p = passos[passoIntro];
    const ultimo = passoIntro === passos.length - 1;
    hud.innerHTML = '';
    palco.innerHTML = `<div class="titulo-jogo titulo-intro"><h1>${esc(p.titulo)}</h1><p>${passoIntro + 1} de ${passos.length}</p></div>`;
    painel.innerHTML = `
      ${p.texto.map((t) => `<p class="intro-texto">${esc(t)}</p>`).join('')}
      <div class="acoes">
        <button class="avancar" data-acao="${ultimo ? 'fim-intro' : 'seguinte'}">${ultimo ? 'Ver as conversas' : 'Seguinte'}</button>
        ${passoIntro > 0 ? '<button class="pausa secundario" data-acao="anterior">Anterior</button>' : ''}
        ${ultimo ? '' : '<button class="pausa secundario" data-acao="fim-intro">Saltar a introdução</button>'}
      </div>`;
  }

  function desenharMenu() {
    hud.innerHTML = '';
    document.title = NOME_JOGO;
    palco.innerHTML = `<div class="titulo-jogo"><h1>${esc(NOME_JOGO)}</h1><p>Três conversas difíceis</p></div>`;
    const todos = ORDEM.every((id) => resultados[id]);
    painel.innerHTML = `
      <p>Em cada conversa há dois medidores de raiva, a tua e a da outra pessoa. Quanto mais sobe a tua, menos respostas ficam ao teu alcance. Em qualquer momento é possível fazer uma pausa.</p>
      <div class="cenarios">
        ${ORDEM.map((id) => {
          const c = window.CENARIOS[id];
          return `
            <button class="cartao" data-cenario="${id}">
              <span class="cartao-numero">Cenário ${c.numero}${resultados[id] ? ' · feito' : ''}</span>
              <span class="cartao-titulo">${esc(c.titulo)}</span>
              <span class="cartao-resumo">${esc(c.resumo)}</span>
            </button>`;
        }).join('')}
      </div>
      <div class="acoes">
        ${todos ? '<button class="avancar" data-acao="perfil">Ver o teu perfil</button>' : ''}
        <a class="pausa secundario" href="curso.html">Curso de assertividade</a>
        <button class="pausa secundario" data-acao="rever-intro">Rever a introdução</button>
      </div>`;
  }

  function render() {
    if (modo === 'consentimento' || modo === 'introducao' || modo === 'menu' || modo === 'perfil') {
      jogo.classList.remove('em-conversa');
      conversa.hidden = true;
      if (modo === 'consentimento') return desenharConsentimento();
      if (modo === 'introducao') return desenharIntroducao();
      if (modo === 'menu') return desenharMenu();
      return desenharPerfil();
    }
    const emConversa = modo !== 'fim';
    jogo.classList.toggle('em-conversa', emConversa);
    conversa.hidden = !emConversa;
    // Enquanto o outro fala e dizes o que sentes, ele fica em destaque. Depois é a tua vez.
    const vez = modo === 'sentir' ? 'outro' : modo === 'fim' ? null : 'eu';
    palco.innerHTML = Cena.desenhar(modo === 'sentir' ? Object.assign({}, estado, { eu: euVisivel() }) : estado, vez, pensamento);
    desenharHud();
    if (emConversa) desenharConversa();
    ({
      fim: desenharFim,
      sentir: desenharSentir,
      responder: desenharResponder,
      prever: desenharPrever,
      pausa: desenharPausa,
      pausa2: desenharPausa2,
      distancia: desenharDistanciamento
    })[modo]();
    if (modo === 'fim') { window.scrollTo(0, 0); return; }
    // Só depois de a zona de responder ter o tamanho final, para a última fala não ficar tapada.
    conversa.scrollTop = conversa.scrollHeight;
    const primeiro = painel.querySelector('button:not([disabled])');
    if (primeiro) primeiro.focus({ preventScroll: true });
    desde = performance.now();
  }

  const ms = () => Math.round(performance.now() - desde);
  const momento = () => ({ no: estado.no, eu: estado.eu, outro: estado.outro });

  // O que se vê ao decidir: respostas livres e escondidas pela raiva.
  const visiveis = () => Motor.opcoes(estado).map((o) => (o.estado === 'escondida' ? -o.i - 1 : o.i));

  painel.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b || b.disabled) return;
    const acao = b.dataset.acao;

    if (acao === 'aceitar') {
      const cod = document.querySelector('#codigo');
      Registo.consentir(cod ? cod.value : '');
      modo = depoisConsentimento();
    } else if (acao === 'recusar') {
      modo = depoisConsentimento();
    } else if (acao === 'seguinte') {
      passoIntro += 1;
    } else if (acao === 'anterior') {
      passoIntro -= 1;
    } else if (acao === 'fim-intro') {
      marcarIntroducao();
      modo = 'menu';
    } else if (acao === 'rever-intro') {
      passoIntro = 0;
      modo = 'introducao';
    } else if (b.dataset.cenario) {
      estado = Motor.novo(window.CENARIOS[b.dataset.cenario]);
      partida += 1;
      Registo.definirContexto({ cenario: estado.cen.id, partida });
      Registo.evento('cenario_inicio', { verdade: estado.verdade, eu: estado.eu, outro: estado.outro });
      registo = [{ quem: 'contexto', texto: estado.cen.introducao }];
      ouvirNo(false);
    } else if (acao === 'menu') {
      modo = 'menu';
    } else if (acao === 'perfil') {
      modo = 'perfil';
    } else if (acao === 'apagar') {
      resultados = {};
      guardar();
      modo = 'menu';
    } else if (b.dataset.sentir) {
      const em = EMOCOES[b.dataset.sentir];
      Registo.evento('sentir', Object.assign(momento(), { emocao: b.dataset.sentir, ms: ms() }));
      Motor.sentir(estado, b.dataset.sentir);
      registo.push({ quem: 'sente', texto: `${em.emoji} ${em.nome.toLowerCase()}` });
      pensar(b.dataset.sentir);
      modo = faseResposta();
    } else if (acao === 'sem-emocao') {
      Registo.evento('sentir', Object.assign(momento(), { emocao: null, ms: ms() }));
      pensar(null);
      modo = faseResposta();
    } else if (acao === 'pausa') {
      voltarPara = modo;
      modo = 'pausa';
    } else if (b.dataset.emocao !== undefined) {
      rotuloPausa = b.dataset.emocao || null;
      Registo.evento('pausa', Object.assign(momento(), { rotulo: rotuloPausa, ms: ms() }));
      Motor.pausa(estado, rotuloPausa);
      registo.push({
        quem: 'nota',
        texto: rotuloPausa
          ? `Pausa. Deste um nome ao que sentes: ${rotuloPausa.toLowerCase()}. A raiva desceu um pouco.`
          : 'Pausa. A raiva desceu ligeiramente.'
      });
      for (const a of estado.avisos) registo.push({ quem: 'aviso', texto: a });
      modo = 'pausa2';
    } else if (acao === 'distanciar') {
      Registo.evento('distanciar', momento());
      Motor.distanciar(estado);
      registo.push({ quem: 'narra', texto: estado.cen.distanciamento });
      modo = 'distancia';
    } else if (acao === 'voltar') {
      modo = voltarPara;
    } else if (acao === 'trocar') {
      Registo.evento('trocar', Object.assign(momento(), { i: pendente, ms: ms() }));
      modo = 'responder';
    } else if (b.dataset.prev) {
      previsao[b.dataset.prev] = b.dataset.valor;
    } else if (acao === 'dizer') {
      const i = pendente;
      pendente = null;
      const op = Motor.atual(estado).opcoes[i];
      Registo.evento('dizer', Object.assign(momento(), { i, previsao: previsao.outro, reacao: op.reage || null, ms: ms() }));
      Motor.escolher(estado, i, previsao);
      registarFala(op);
      ouvirNo(!!(estado.eco && estado.eco.previsao));
    } else if (b.dataset.i !== undefined) {
      const i = Number(b.dataset.i);
      const op = Motor.atual(estado).opcoes[i];
      Registo.evento('opcao', Object.assign(momento(), {
        i, texto: op.texto, tipo: op.tipo, postura: op.postura || null, visiveis: visiveis(), ms: ms()
      }));
      if (op.tipo === 'leitura' || op.tipo === 'reacao') {
        // A primeira reação e a leitura do outro são pensamentos, não falas.
        Motor.escolher(estado, i);
        registo.push({ quem: 'pensa', texto: semAspas(op.texto) });
        ouvirNo(false);
      } else if (estado.marcas.sabe) {
        // Depois de o outro explicar o que se passa, já não há reação a prever.
        Motor.escolher(estado, i);
        registarFala(op);
        ouvirNo(false);
      } else {
        pendente = i;
        previsao = { outro: null };
        modo = 'prever';
      }
    }
    render();
    // Nas previsões, o foco fica no botão carregado em vez de saltar para o início.
    if (b.dataset.prev === 'outro') {
      const mesmo = painel.querySelector(`[data-prev="${b.dataset.prev}"][data-valor="${b.dataset.valor}"]`);
      if (mesmo) mesmo.focus({ preventScroll: true });
    }
  });

  render();
})();
