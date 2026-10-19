(function () {
  const NOME_JOGO = 'Às Claras';   // provisório
  const ORDEM = ['grupo', 'amiga', 'docente'];
  const CHAVE = 'asclaras-resultados';
  const CHAVE_INTRO = 'asclaras-introducao-vista';


  // «E tu?»: depois de o outro reagir, o que sentes. Lista provisória (por decidir, ver estado.md).
  // A faixa de cada emoção escolhe o pensamento na nuvem e a cara a expressão da tua personagem.
  // Não mexe na raiva do motor.
  const EMOCOES = {
    calma: { emoji: '😌', nome: 'Calma', faixa: 'calmo', cara: 'calmo' },
    curiosidade: { emoji: '🤔', nome: 'Curiosidade', faixa: 'calmo', cara: 'calmo' },
    tristeza: { emoji: '😔', nome: 'Tristeza', faixa: 'tenso', cara: 'triste' },
    medo: { emoji: '😟', nome: 'Medo', faixa: 'tenso', cara: 'preocupado' },
    irritacao: { emoji: '😤', nome: 'Irritação', faixa: 'tenso', cara: 'tenso' },
    raiva: { emoji: '😠', nome: 'Raiva', faixa: 'quente', cara: 'zangado' }
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
  const intro = $('#intro');
  const conversa = $('#conversa');

  let estado = null;
  // consentimento | introducao | menu | sentir (o outro reagiu, dizes o que sentes, se quiseres) | responder
  // | pausa | pausa2 | distancia | fim | perfil
  // Se o registo estiver configurado, o consentimento vem antes de tudo, em cada visita
  // (nos laboratórios o computador é partilhado, não se herda o consentimento de outra pessoa).
  const depoisConsentimento = () => (introducaoVista() ? 'menu' : 'introducao');
  let modo = Registo.configurado() ? 'consentimento' : depoisConsentimento();
  let partida = 0;
  let desde = 0;             // quando apareceu a pergunta atual, para medir o tempo de resposta
  let passoIntro = 0;
  let rotuloPausa = null;
  let registo = [];          // a conversa no ecrã, de cima para baixo
  let voltarPara = 'responder';
  let introAberta = false;   // a introdução do cenário fica no topo até à primeira escolha
  let pensamento = null;     // o pensamento automático do momento, na nuvem da cena
  let caraEu = null;         // a expressão da tua personagem, quando escolheste uma emoção
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
        <div class="medidor-barra" role="meter" aria-label="${esc(nome)}" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${valor}">
          <div class="medidor-enchimento" style="width:${pct}%;background-color:${cor}"></div>
        </div>
        <span class="medidor-valor">${valor}<small>/${Motor.MAX}</small></span>
      </div>`;
  }

  // Enquanto não dizes o que sentes, o medidor e a cena ficam no valor de antes.
  function euVisivel() {
    return modo === 'sentir' && estado.eco ? estado.eu - estado.eco.euTotal : estado.eu;
  }

  function desenharHud() {
    const no = Motor.atual(estado);
    hud.innerHTML = `
      ${medidor('eu', 'A tua raiva', euVisivel())}
      <span class="hora">${esc(no.hora || '')}</span>
      ${no.ausente ? '<div></div>' : medidor('outro', `Raiva ${ref('do').replace(estado.cen.outro, nomeCurto())}`, estado.outro)}`;
  }

  // ---------- A conversa, que cresce para baixo ----------

  // Ao entrar num nó: o que se vê e o que o outro diz entram na conversa.
  // Até se saber o que se passa, a seguir à fala do outro pergunta-se o que sentes, e só depois vem o pensamento.
  function ouvirNo(perguntarEmocao) {
    const no = Motor.atual(estado);
    pensamento = null;
    caraEu = null;
    if (no.fim) { modo = faseResposta(); return; }
    // A narração de abertura fica na introdução, no topo, e não entra na conversa.
    if (no.narracao && !(introAberta && estado.no === 'inicio')) registo.push({ quem: 'narra', texto: no.narracao });
    if (no.fala) registo.push({ quem: 'outro', texto: no.fala });
    if (no.fala && perguntarEmocao) { modo = 'sentir'; return; }
    pensar(null);
    modo = faseResposta();
  }

  function pensar(emocao) {
    pensamento = Motor.pensamento(estado, emocao ? EMOCOES[emocao].faixa : null);
    caraEu = emocao ? EMOCOES[emocao].cara : null;
    // O pensamento fica no turno a que responde, para a revisão final.
    const t = estado.conversa[estado.conversa.length - 1];
    if (t && !t.pausa && t.pensamento === undefined) t.pensamento = pensamento;
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

  function desenharPausa() {
    const emocoes = estado.cen.emocoes || ['Raiva', 'Frustração', 'Medo', 'Cansaço'];
    painel.innerHTML = `
      <p class="zona-pergunta">Pausa. Antes de responder, o que estás a sentir agora?</p>
      <div class="emocoes">
        ${emocoes.map((em) => `<button class="chip" data-emocao="${esc(em)}">${esc(em)}</button>`).join('')}
        <button class="chip chip-neutro" data-emocao="">Não sei bem</button>
      </div>`;
  }

  // O que acontece na pausa fica na zona de baixo: a conversa termina sempre na última fala do outro.
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

  // A conversa outra vez, resposta a resposta: primeiro o que disseste e o que o outro respondeu,
  // depois só as tuas perceções (o que sentiste e o que achaste que se passava). As surpresas sobressaem.

  function rever(conversa) {
    // a conversa aqui é a do motor, não o registo do ecrã
    if (!conversa || !conversa.some((t) => !t.pausa)) return '';
    const postura = Object.fromEntries(POSTURAS.map(([k, v]) => [k, v.slice(0, -1).toLowerCase()]));
    let n = 0;
    const itens = conversa.map((t) => {
      if (t.pausa) {
        return `<li class="rever-pausa">Pausa${t.rotulo ? `: deste o nome «${esc(t.rotulo.toLowerCase())}» ao que sentias` : ''}${t.distanciou ? ', e olhaste para a cena de fora' : ''}.</li>`;
      }
      n += 1;
      const leuMal = !!t.leitura && !t.leitura.certa;
      // As perguntas que te foram feitas neste turno, cada uma com a tua resposta.
      const perguntas = [];
      if (t.sentiu) {
        const em = t.emocao && EMOCOES[t.emocao];
        perguntas.push(['O que sentiste?', em ? `${em.emoji} ${esc(em.nome)}` : '<span class="rever-vazio">Não escolheste.</span>']);
      }
      if (t.pensamento) perguntas.push(['O que pensaste?', `«${esc(semAspas(t.pensamento))}»`]);
      if (t.leitura) {
        perguntas.push(['O que achaste que se passava?', `${esc(semAspas(t.leitura.texto))} <span class="rever-verdade">Nesta partida, ${esc(estado.cen.descricaoVerdade[estado.verdade])}.</span>`]);
      }
      const percecoes = perguntas.map(([q, r]) => `<dt>${q}</dt><dd>${r}</dd>`);
      return `
        <li${leuMal ? ' class="rever-surpresa"' : ''}>
          <div class="rever-topo">
            <span class="rever-n">Resposta ${n}</span>
            ${leuMal ? '<span class="rever-falhou">Não era o que se passava</span>' : ''}
          </div>
          <div class="msg msg-eu">
            <span class="msg-nome">Tu${t.postura ? ` · a tua resposta foi ${esc(postura[t.postura])}` : ''}</span>
            <p>${esc(semAspas(t.texto))}</p>
          </div>
          ${t.resposta ? `
          <div class="msg msg-outro">
            <span class="msg-nome">${esc(nomeCurto())}</span>
            <p>${esc(t.resposta)}</p>
          </div>` : ''}
          ${percecoes.length ? `<dl class="rever-percecoes">${percecoes.join('')}</dl>` : ''}
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
      <div class="acoes">
        <button class="avancar" data-acao="menu">Voltar aos cenários</button>
        <button class="pausa secundario" data-acao="apagar">Apagar resultados</button>
      </div>`;
  }

  function desenharConsentimento() {
    hud.innerHTML = '';
    palco.innerHTML = `<div class="titulo-jogo titulo-intro"><h1>${esc(NOME_JOGO)}</h1><p>Antes de começar</p></div>`;
    painel.innerHTML = `
      <p class="intro-texto">Este jogo faz parte de um estudo sobre conversas difíceis. Se aceitares, as tuas escolhas ficam registadas: as respostas, as emoções, as pausas e o tempo que demoras a decidir.</p>
      <p class="intro-texto">Não é registado o teu nome, o teu email nem o endereço do computador. Podes desistir a qualquer momento, basta fechar a página. Jogar sem registar é igual em tudo.</p>
      <label class="zona-pergunta" for="codigo">Código anónimo (opcional)</label>
      <p class="vez-nota">Para ligar este jogo aos questionários: as duas primeiras letras do nome próprio da tua mãe, as duas primeiras do nome próprio do teu pai, e o dia e o mês em que nasceste. Por exemplo, mãe Maria, pai José, nascido a 7 de março: MAJO0703.</p>
      <input id="codigo" class="codigo" maxlength="12" autocomplete="off" spellcheck="false">
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
        <button class="pausa secundario" data-acao="rever-intro">Rever a introdução</button>
      </div>`;
  }

  function render() {
    if (modo === 'consentimento' || modo === 'introducao' || modo === 'menu' || modo === 'perfil') {
      jogo.classList.remove('em-conversa');
      conversa.hidden = true;
      intro.hidden = true;
      if (modo === 'consentimento') return desenharConsentimento();
      if (modo === 'introducao') return desenharIntroducao();
      if (modo === 'menu') return desenharMenu();
      return desenharPerfil();
    }
    const emConversa = modo !== 'fim';
    jogo.classList.toggle('em-conversa', emConversa);
    conversa.hidden = !emConversa;
    intro.hidden = !(emConversa && introAberta);
    if (!intro.hidden) {
      const abertura = estado.cen.nos.inicio.narracao;
      intro.innerHTML = `<span>${esc(estado.cen.introducao)}</span>${abertura ? `<span class="intro-narra">${esc(abertura)}</span>` : ''}`;
    }
    // Enquanto o outro fala e dizes o que sentes, ele fica em destaque. Depois é a tua vez.
    const vez = modo === 'sentir' ? 'outro' : modo === 'fim' ? null : 'eu';
    palco.innerHTML = Cena.desenhar(modo === 'sentir' ? Object.assign({}, estado, { eu: euVisivel() }) : estado, vez, pensamento, caraEu);
    desenharHud();
    if (emConversa) desenharConversa();
    ({
      fim: desenharFim,
      sentir: desenharSentir,
      responder: desenharResponder,
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
      registo = [];
      introAberta = true;
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
      Registo.evento('sentir', Object.assign(momento(), { emocao: b.dataset.sentir, ms: ms() }));
      Motor.sentir(estado, b.dataset.sentir);
      pensar(b.dataset.sentir);
      modo = faseResposta();
    } else if (acao === 'sem-emocao') {
      Registo.evento('sentir', Object.assign(momento(), { emocao: null, ms: ms() }));
      Motor.sentir(estado, null);
      pensar(null);
      modo = faseResposta();
    } else if (acao === 'pausa') {
      voltarPara = modo;
      modo = 'pausa';
    } else if (b.dataset.emocao !== undefined) {
      rotuloPausa = b.dataset.emocao || null;
      Registo.evento('pausa', Object.assign(momento(), { rotulo: rotuloPausa, ms: ms() }));
      Motor.pausa(estado, rotuloPausa);
      modo = 'pausa2';
    } else if (acao === 'distanciar') {
      Registo.evento('distanciar', momento());
      Motor.distanciar(estado);
      modo = 'distancia';
    } else if (acao === 'voltar') {
      modo = voltarPara;
    } else if (b.dataset.i !== undefined) {
      const i = Number(b.dataset.i);
      const op = Motor.atual(estado).opcoes[i];
      introAberta = false;
      Registo.evento('opcao', Object.assign(momento(), {
        i, texto: op.texto, tipo: op.tipo, postura: op.postura || null, visiveis: visiveis(), ms: ms()
      }));
      if (op.tipo === 'leitura' || op.tipo === 'reacao') {
        // A primeira reação e a leitura do outro são pensamentos, não entram na conversa.
        Motor.escolher(estado, i);
        ouvirNo(false);
      } else {
        // Sem previsão: a resposta é dita logo. Até se saber o que se passa, pergunta-se o que sentes.
        const sabia = estado.marcas.sabe;
        Motor.escolher(estado, i);
        registarFala(op);
        ouvirNo(!sabia);
      }
    }
    render();
  });

  render();
})();
