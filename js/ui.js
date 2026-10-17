(function () {
  const NOME_JOGO = 'Às Claras';   // provisório
  const ORDEM = ['grupo', 'amiga', 'docente'];
  const CHAVE = 'asclaras-resultados';
  const CHAVE_INTRO = 'asclaras-introducao-vista';

  // Previsões: antes de dizer, o que a resposta vai fazer ao outro.
  // Depois de o outro reagir, o que aconteceu à tua raiva (o medidor só mostra depois).
  const REAGE = { abre: 'Aproxima-se', justifica: 'Justifica-se', defende: 'Defende-se', afasta: 'Afasta-se', nada: 'Não dá por nada' };
  const EU_PREV = { sobe: 'Subiu', igual: 'Ficou igual', desce: 'Desceu' };

  const POSTURAS = [
    ['assertiva', 'Assertivas'],
    ['agressiva', 'Agressivas'],
    ['passiva', 'Passivas'],
    ['passivo-agressiva', 'Passivo-agressivas']
  ];
  const DEF_ASSERTIVA = 'Uma resposta assertiva diz o que sentes e o que precisas, de forma direta, sem atacar a outra pessoa e sem desistir de ti. A raiva pode estar lá dentro.';
  const LENTES = { 'injustiça': 'a injustiça', 'ameaça': 'a ameaça ao que é teu', 'desrespeito': 'sentir desrespeito' };

  const $ = (sel) => document.querySelector(sel);
  const palco = $('#palco');
  const painel = $('#painel');
  const hud = $('#hud');

  let estado = null;
  // introducao | menu | ouvir (o outro fala) | responder (a tua vez) | prever | pausa | pausa2 | distancia | fim | perfil
  let modo = introducaoVista() ? 'menu' : 'introducao';
  let passoIntro = 0;
  let rotuloPausa = null;
  let pendente = null;
  let previsao = { outro: null };
  let aguardaEu = false;     // o outro já reagiu, falta dizeres o que aconteceu à tua raiva
  let mudancaEu = null;      // { de, para }, mostrada uma vez depois de responderes
  let mostrarContexto = false;
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

  // Enquanto não respondes sobre a tua raiva, o medidor e a cena ficam no valor de antes.
  function euVisivel() {
    return aguardaEu ? estado.eu - estado.eco.euTotal : estado.eu;
  }

  function desenharHud() {
    const no = Motor.atual(estado);
    hud.innerHTML = `
      ${medidor('eu', 'Tu', euVisivel())}
      <span class="hora">${esc(no.hora || '')}</span>
      ${no.ausente ? '<div></div>' : medidor('outro', nomeCurto(), estado.outro)}`;
  }

  // Eco da última resposta: o que disseste e, numa linha, como o outro ouviu.
  function eco() {
    const ec = estado.eco;
    if (!ec || !ec.falada) return '';
    return `
      <div class="bolha bolha-eu apagada">
        <span class="bolha-nome">Tu</span>
        <p>${esc(ec.texto)}</p>
      </div>
      ${ec.ouviu ? `<p class="impacto">${esc(maiusc(ref('o')))} ouviu ${esc(ec.ouviu)}.</p>` : ''}`;
  }

  function bolhaOutro(texto, apagada) {
    return `
      <div class="bolha bolha-outro${apagada ? ' apagada' : ''}">
        <span class="bolha-nome">${esc(nomeCurto())}</span>
        <p>${esc(texto)}</p>
      </div>`;
  }

  function porDentro() {
    const p = Motor.pensamento(estado);
    if (!p) return '';
    return `
      <div class="por-dentro">
        <span class="por-dentro-rotulo">Por dentro</span>
        <p class="por-dentro-texto">${esc(p)}</p>
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

  // Fase 1: o outro fala, tu ouves e vês o que pensas.
  // Se previste a reação dele, primeiro dizes o que aconteceu à tua raiva.
  function desenharOuvir() {
    const no = Motor.atual(estado);
    const topo = `
      ${eco()}
      ${no.narracao ? `<p class="narracao">${esc(no.narracao)}</p>` : ''}
      ${bolhaOutro(no.fala, false)}`;
    if (aguardaEu) {
      painel.innerHTML = `${topo}
        <div class="vez">
          <span class="vez-rotulo">E tu?</span>
          <p class="vez-pergunta">Depois de ouvires isto, a tua raiva...</p>
          ${chips('eu', EU_PREV, null)}
        </div>`;
      return;
    }
    let mudanca = '';
    if (mudancaEu) {
      const { de, para } = mudancaEu;
      const verbo = para > de ? 'subiu' : para < de ? 'desceu' : 'ficou';
      mudanca = `<p class="impacto">A tua raiva ${verbo} ${para === de ? `em ${para}` : `de ${de} para ${para}`}.</p>`;
      mudancaEu = null;
    }
    painel.innerHTML = `${topo}
      ${mudanca}
      ${porDentro()}
      <button class="avancar" data-acao="responder">A tua vez</button>`;
  }

  // Fase 2: a tua vez.
  function desenharResponder() {
    const no = Motor.atual(estado);
    const ops = Motor.opcoes(estado);
    const pergunta = no.leitura || no.pergunta || 'O que respondes?';
    const avisos = estado.avisos.map((a) => `<p class="aviso">${esc(a)}</p>`).join('');
    painel.innerHTML = `
      ${no.fala ? bolhaOutro(no.fala, true) : `${eco()}${no.narracao ? `<p class="narracao">${esc(no.narracao)}</p>` : ''}`}
      ${avisos}
      <div class="vez">
        <span class="vez-rotulo">A tua vez</span>
        <p class="vez-pergunta">${esc(pergunta)}</p>
        ${no.nota ? `<p class="vez-nota">${esc(no.nota)}</p>` : ''}
      </div>
      <div class="opcoes">${ops.map(botaoOpcao).join('')}</div>
      ${Motor.podePausar(estado) ? '<button class="pausa" data-acao="pausa">Fazer uma pausa</button>' : ''}`;
  }

  function chips(grupo, mapa, escolhido) {
    return `<div class="chips" role="group">${Object.entries(mapa).map(([k, v]) =>
      `<button class="chip${escolhido === k ? ' ativo' : ''}" data-prev="${grupo}" data-valor="${k}" aria-pressed="${escolhido === k}">${esc(v)}</button>`).join('')}</div>`;
  }

  function desenharPrever() {
    const op = Motor.atual(estado).opcoes[pendente];
    const pronto = !!previsao.outro;
    painel.innerHTML = `
      <div class="bolha bolha-eu">
        <span class="bolha-nome">Tu, prestes a dizer</span>
        <p>${esc(op.texto)}</p>
      </div>
      <div class="vez">
        <span class="vez-rotulo">Antes de dizeres</span>
        <p class="vez-pergunta">O que achas que isto vai fazer ${esc(ref('ao'))}?</p>
        ${chips('outro', REAGE, previsao.outro)}
      </div>
      <div class="acoes">
        <button class="avancar" data-acao="dizer" ${pronto ? '' : 'disabled'}>Dizer</button>
        <button class="pausa secundario" data-acao="trocar">Escolher outra resposta</button>
      </div>`;
  }

  function desenharPausa() {
    const emocoes = estado.cen.emocoes || ['Raiva', 'Frustração', 'Medo', 'Cansaço'];
    painel.innerHTML = `
      <div class="vez">
        <span class="vez-rotulo">Pausa</span>
        <p class="vez-pergunta">Antes de responder, o que estás a sentir agora?</p>
      </div>
      <div class="emocoes">
        ${emocoes.map((em) => `<button class="chip" data-emocao="${esc(em)}">${esc(em)}</button>`).join('')}
        <button class="chip chip-neutro" data-emocao="">Não sei bem</button>
      </div>`;
  }

  function desenharPausa2() {
    const nomeou = rotuloPausa
      ? `Deste um nome ao que sentes: ${esc(rotuloPausa.toLowerCase())}. A raiva desceu um pouco.`
      : 'A raiva desceu ligeiramente.';
    painel.innerHTML = `
      <p class="narracao">${nomeou}</p>
      ${estado.avisos.map((a) => `<p class="aviso">${esc(a)}</p>`).join('')}
      <div class="opcoes">
        <button class="opcao" data-acao="distanciar">Olhar para a cena de fora</button>
        <button class="opcao" data-acao="voltar">Voltar à conversa</button>
      </div>`;
  }

  function desenharDistanciamento() {
    painel.innerHTML = `
      <p class="narracao">${esc(estado.cen.distanciamento)}</p>
      <div class="opcoes"><button class="opcao" data-acao="voltar">Voltar à conversa</button></div>`;
  }

  function lista(itens) {
    return `<ul>${itens.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  }

  // A conversa outra vez, resposta a resposta: o que disseste, como foi ouvido,
  // o que previste e o que aconteceu. Fechada por omissão, abre-se se quiseres.
  function rever(conversa) {
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
      if (t.ouviu) linhas.push(`${esc(maiusc(ref('o')))} ouviu ${esc(t.ouviu)}.`);
      if (t.outroPrev) {
        const certo = t.outroPrev === t.outroReal;
        linhas.push(`Previste: ${esc(reage(t.outroPrev))}. Aconteceu: ${esc(reage(t.outroReal))}.${certo ? '' : ' <span class="rever-falhou">Não era o que esperavas.</span>'}`);
      }
      if (t.euAntes !== t.euDepois || t.euPrev) {
        const real = t.euDepois > t.euAntes ? 'sobe' : t.euDepois < t.euAntes ? 'desce' : 'igual';
        const disseste = t.euPrev ? ` Disseste que ${EU_PREV[t.euPrev].toLowerCase()}${t.euPrev === real ? '' : ', mas não foi isso'}.` : '';
        linhas.push(`A tua raiva: ${t.euAntes === t.euDepois ? `ficou em ${t.euAntes}` : `de ${t.euAntes} para ${t.euDepois}`}.${disseste}`);
      }
      if (t.postura) linhas.push(`Postura: ${esc(postura[t.postura])}.`);
      const tapada = t.tapadas && t.tapadas[0]
        ? `<p class="rever-tapada">Com menos raiva, também podias ter dito: «${esc(semAspas(t.tapadas[0]))}»</p>` : '';
      return `
        <li>
          <p class="rever-tu"><span class="rever-n">${n}</span> Tu: ${esc(t.texto)}</p>
          ${linhas.map((l) => `<p>${l}</p>`).join('')}
          ${t.resposta ? `<p class="rever-outro">${esc(nomeCurto())}: ${esc(t.resposta)}</p>` : ''}
          ${tapada}
        </li>`;
    }).join('');
    return `
      <details class="rever">
        <summary>Rever a conversa, resposta a resposta</summary>
        <ol>${itens}</ol>
      </details>`;
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

  function faseDoNo() {
    const no = Motor.atual(estado);
    if (no.fim) {
      resultados[estado.cen.id] = Motor.resumo(estado);
      guardar();
      return 'fim';
    }
    return no.fala ? 'ouvir' : 'responder';
  }

  function render() {
    if (modo === 'introducao') return desenharIntroducao();
    if (modo === 'menu') return desenharMenu();
    if (modo === 'perfil') return desenharPerfil();
    const vez = modo === 'ouvir' ? 'outro' : modo === 'fim' ? null : 'eu';
    palco.innerHTML = Cena.desenhar(aguardaEu ? Object.assign({}, estado, { eu: euVisivel() }) : estado, vez);
    desenharHud();
    ({
      fim: desenharFim,
      ouvir: desenharOuvir,
      responder: desenharResponder,
      prever: desenharPrever,
      pausa: desenharPausa,
      pausa2: desenharPausa2,
      distancia: desenharDistanciamento
    })[modo]();
    // O contexto do cenário aparece por cima da primeira pergunta.
    if (mostrarContexto) {
      painel.insertAdjacentHTML('afterbegin', `<p class="contexto">${esc(estado.cen.introducao)}</p>`);
      mostrarContexto = false;
    }
    const primeiro = painel.querySelector('button:not([disabled])');
    if (primeiro) primeiro.focus({ preventScroll: true });
  }

  painel.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b || b.disabled) return;
    const acao = b.dataset.acao;

    if (acao === 'seguinte') {
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
      aguardaEu = false;
      mudancaEu = null;
      mostrarContexto = true;
      modo = faseDoNo();
    } else if (acao === 'menu') {
      modo = 'menu';
    } else if (acao === 'perfil') {
      modo = 'perfil';
    } else if (acao === 'apagar') {
      resultados = {};
      guardar();
      modo = 'menu';
    } else if (acao === 'responder') {
      modo = 'responder';
    } else if (acao === 'pausa') {
      modo = 'pausa';
    } else if (b.dataset.emocao !== undefined) {
      rotuloPausa = b.dataset.emocao || null;
      Motor.pausa(estado, rotuloPausa);
      modo = 'pausa2';
    } else if (acao === 'distanciar') {
      Motor.distanciar(estado);
      modo = 'distancia';
    } else if (acao === 'voltar' || acao === 'trocar') {
      modo = 'responder';
    } else if (b.dataset.prev === 'eu') {
      const de = euVisivel();
      Motor.preverEu(estado, b.dataset.valor);
      aguardaEu = false;
      mudancaEu = { de, para: estado.eu };
    } else if (b.dataset.prev) {
      previsao[b.dataset.prev] = b.dataset.valor;
    } else if (acao === 'dizer') {
      const i = pendente;
      pendente = null;
      Motor.escolher(estado, i, previsao);
      modo = faseDoNo();
      aguardaEu = modo === 'ouvir' && !!estado.eco.previsao;
    } else if (b.dataset.i !== undefined) {
      const i = Number(b.dataset.i);
      const tipo = Motor.atual(estado).opcoes[i].tipo;
      // Depois de o outro explicar o que se passa, já não há reação a prever.
      if (tipo === 'leitura' || tipo === 'reacao' || estado.marcas.sabe) {
        Motor.escolher(estado, i);
        modo = faseDoNo();
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
