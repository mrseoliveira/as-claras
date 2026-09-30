// Curso de assertividade: navegação entre módulos e exercícios.
// As respostas ficam só no navegador de quem faz o curso.
(function () {
  const C = window.CURSO;
  const CHAVE = 'asclaras-curso-2';   // -2 desde que os exercícios de escrita passaram a ser de escolha
  const ESTILOS = { passiva: 'Passiva', agressiva: 'Agressiva', 'passivo-agressiva': 'Passivo-agressiva', assertiva: 'Assertiva' };

  const nav = document.getElementById('navegacao');
  const conteudo = document.getElementById('conteudo');

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let est = carregar();
  let diarioCopiado = null;   // bloco do diário cujo texto está à vista
  let copiaFalhou = false;

  function carregar() {
    const base = { modulo: 0, feitos: {}, r: {} };
    try { return Object.assign(base, JSON.parse(localStorage.getItem(CHAVE)) || {}); } catch (_) { return base; }
  }
  function guardar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(est)); } catch (_) { /* sem armazenamento, fica só em memória */ }
  }
  // Respostas de um exercício, identificadas por módulo e posição do bloco.
  function resp(chave, inicial) {
    if (!(chave in est.r)) est.r[chave] = inicial;
    return est.r[chave];
  }

  // ---------- blocos ----------

  const B = {
    texto: (b) => b.p.map((t) => `<p>${esc(t)}</p>`).join(''),

    continuo: () => `
      <div class="continuo" role="img" aria-label="Linha contínua: passiva à esquerda, assertiva ao centro, agressiva à direita. A passivo-agressiva mistura as duas pontas.">
        <div class="continuo-linha">
          <span class="ponto p-passiva">Passiva</span>
          <span class="ponto p-assertiva">Assertiva</span>
          <span class="ponto p-agressiva">Agressiva</span>
        </div>
        <p class="continuo-nota"><span class="ponto p-pa">Passivo-agressiva</span> passiva por fora, agressiva por dentro</p>
      </div>`,

    estilos: (b) => `<div class="grelha grelha-2">${b.itens.map((i) => `
      <div class="cartao-info estilo-${i.id}"><h4>${esc(i.nome)}</h4><p>${esc(i.texto)}</p></div>`).join('')}</div>`,

    classificar: (b, k) => exercicioEscolha(b, k, ESTILOS),
    erros: (b, k) => exercicioEscolha(b, k, b.opcoes),

    naoe: (b) => `<ul class="lista-nao">${b.itens.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`,

    nota: (b) => `<p class="nota-evidencia">${esc(b.texto)}</p>`,

    barreiras: (b, k) => {
      const sel = resp(k, []);
      return `
        <div class="exercicio">
          <h3>${esc(b.titulo)}</h3>
          <p class="instrucao">${esc(b.instrucao)}</p>
          <div class="grelha grelha-2">${b.itens.map((i) => {
            const on = sel.includes(i.id);
            return `
              <button class="cartao-escolha${on ? ' ativo' : ''}" data-barreira="${i.id}" data-k="${k}" aria-pressed="${on}">
                <span class="escolha-nome">${esc(i.nome)}</span>
                <span class="escolha-exemplo">${esc(i.exemplo)}</span>
                ${on ? `<span class="escolha-ajuda">${esc(i.ajuda)}</span>` : ''}
              </button>`;
          }).join('')}</div>
        </div>`;
    },

    componentes: (b) => `<div class="grelha grelha-3">${b.itens.map((i) => `
      <div class="cartao-info"><h4>${esc(i.nome)}</h4><p>${esc(i.texto)}</p></div>`).join('')}</div>`,

    funcoes: (b) => `<div class="grelha grelha-3">${b.itens.map((i) => `
      <div class="cartao-info emocao-${i.nome.toLowerCase()}"><h4>${esc(i.nome)}</h4><p>${esc(i.texto)}</p></div>`).join('')}</div>`,

    ferramentas: (b) => `<h3>${esc(b.titulo)}</h3><div class="grelha grelha-2">${b.itens.map((i) => `
      <div class="cartao-info"><h4>${esc(i.nome)}</h4><p>${esc(i.texto)}</p></div>`).join('')}</div>`,

    situacoes: (b) => `<div class="grelha grelha-2">${b.itens.map((i) => `
      <div class="cartao-info"><h4>${esc(i.nome)}</h4><p>${esc(i.texto)}</p></div>`).join('')}</div>`,

    antes: (b) => `<div class="caixa-antes"><h3>${esc(b.titulo)}</h3><ul>${b.itens.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`,

    // Escolher, entre quatro versões, a assertiva. Cada versão explica-se quando é escolhida.
    versoes: (b, k) => {
      const r = resp(k, {});
      return `
        <div class="exercicio">
          <h3>${esc(b.titulo)}</h3>
          <p class="instrucao">${esc(b.instrucao)}</p>
          <p class="rotulo">Uma versão assertiva...</p>
          <ul class="verificar">${b.verificar.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>
          ${b.itens.map((i, n) => {
            const escolha = r[n];
            const v = escolha != null ? i.versoes[escolha] : null;
            return `
              <div class="reescrita">
                <p class="frase-original"><span class="etiqueta">${esc(i.estilo)}</span> ${esc(i.frase)}</p>
                <div class="versoes">${i.versoes.map((x, m) => `
                  <button class="cartao-escolha${escolha === m ? ' ativo' : ''}" data-versao="${m}" data-n="${n}" data-k="${k}" aria-pressed="${escolha === m}">${esc(x.texto)}</button>`).join('')}
                </div>
                ${v ? `<p class="feedback ${v.postura === 'assertiva' ? 'bate' : 'falha'}">${v.postura === 'assertiva' ? 'Sim, esta é assertiva.' : `Esta é ${esc(ESTILOS[v.postura].toLowerCase())}.`} ${esc(v.porque)}</p>` : ''}
              </div>`;
          }).join('')}
        </div>`;
    },

    termos: (b) => `<div class="grelha grelha-2">${b.itens.map((i) => `
      <div class="cartao-info"><h4>${esc(i.nome)}</h4><p>${esc(i.texto)}</p><p class="termo-exemplo">${esc(i.exemplo)}</p></div>`).join('')}</div>`,

    // A escada monta-se escolhendo situações da lista e ordenando-as.
    escada: (b, k) => {
      const degraus = resp(k, []);
      const lista = degraus.map((t, n) => ({ t, n })).reverse();
      const livres = b.situacoes.filter((t) => !degraus.includes(t));
      return `
        <div class="exercicio">
          <h3>${esc(b.titulo)}</h3>
          <p class="instrucao">${esc(b.instrucao)}</p>
          ${degraus.length ? `
            <ol class="escada" reversed>
              ${lista.map(({ t, n }) => `
                <li>
                  <span class="degrau-texto">${esc(t)}</span>
                  <span class="degrau-acoes">
                    <button class="mini" data-subir="${n}" data-k="${k}" ${n === degraus.length - 1 ? 'disabled' : ''}>Mais difícil</button>
                    <button class="mini" data-descer="${n}" data-k="${k}" ${n === 0 ? 'disabled' : ''}>Mais fácil</button>
                    <button class="mini" data-tirar="${n}" data-k="${k}">Tirar</button>
                  </span>
                </li>`).join('')}
            </ol>
            <p class="escada-legenda">Em cima, a mais difícil. Em baixo, a mais fácil, por onde começar.</p>` : ''}
          ${degraus.length < 5 ? `
            <p class="rotulo">${degraus.length ? 'Acrescentar outra' : 'Situações'}</p>
            <div class="chips">${livres.map((t) => `
              <button class="chip" data-acrescentar="${esc(t)}" data-k="${k}">${esc(t)}</button>`).join('')}
            </div>` : ''}
        </div>`;
    },

    // A frase monta-se com peças. Em cada parte, só uma é assertiva.
    construtor: (b, k) => {
      const v = resp(k, {});
      return `
        <div class="exercicio">
          <h3>${esc(b.titulo)}</h3>
          <p class="instrucao">${esc(b.instrucao)}</p>
          ${b.campos.map((c) => {
            const p = v[c.id] != null ? c.pecas[v[c.id]] : null;
            return `
              <div class="item-escolha">
                <p class="rotulo">${esc(c.rotulo)}</p>
                <div class="chips">${c.pecas.map((x, m) => `
                  <button class="chip${v[c.id] === m ? ' ativo' : ''}" data-peca="${m}" data-campo="${c.id}" data-k="${k}" aria-pressed="${v[c.id] === m}">${esc(x.texto)}</button>`).join('')}
                </div>
                ${p ? `<p class="feedback ${p.certa ? 'bate' : 'falha'}">${esc(p.porque)}</p>` : ''}
              </div>`;
          }).join('')}
          <p class="frase-montada">${montar(b, v)}</p>
        </div>`;
    },

    diario: (b, k) => {
      const v = resp(k, {});
      return `
        <div class="exercicio">
          <h3>${esc(b.titulo)}</h3>
          <p class="instrucao">${esc(b.instrucao)}</p>
          ${b.fases.map((f) => `
            <p class="rotulo">${esc(f.nome)}</p>
            <div class="chips chips-coluna">${f.opcoes.map((o, m) => `
              <button class="chip${v[f.id] === m ? ' ativo' : ''}" data-fase="${f.id}" data-opcao="${m}" data-k="${k}" aria-pressed="${v[f.id] === m}">${esc(o)}</button>`).join('')}
            </div>`).join('')}
          <div class="acoes"><button class="avancar" data-copiar="${k}">Copiar o diário</button></div>
          ${diarioCopiado === k ? `
            <p class="copiado" role="status">${copiaFalhou ? 'Não foi possível copiar automaticamente. O texto está em baixo, pronto a selecionar.' : 'Diário copiado. Pode ser colado numa nota ou num documento.'}</p>
            <label class="rotulo" for="diario-texto">O diário em texto</label>
            <textarea id="diario-texto" rows="12" readonly>${esc(textoDiario(k))}</textarea>` : ''}
        </div>`;
    }
  };

  // Exercício de escolha com feedback imediato (classificar estilos, erros de pensamento).
  function exercicioEscolha(b, k, opcoes) {
    const r = resp(k, {});
    return `
      <div class="exercicio">
        <h3>${esc(b.titulo)}</h3>
        ${b.instrucao ? `<p class="instrucao">${esc(b.instrucao)}</p>` : ''}
        ${b.itens.map((i, n) => {
          const escolha = r[n];
          const certo = escolha === i.certa;
          return `
            <div class="item-escolha">
              <p class="frase">${esc(i.frase)}</p>
              <div class="chips">${Object.entries(opcoes).map(([id, nome]) => `
                <button class="chip${escolha === id ? ' ativo' : ''}" data-escolha="${id}" data-n="${n}" data-k="${k}" aria-pressed="${escolha === id}">${esc(nome)}</button>`).join('')}
              </div>
              ${escolha ? `<p class="feedback ${certo ? 'bate' : 'falha'}">${certo ? 'Sim.' : `Aqui, ${esc(opcoes[i.certa].toLowerCase())}.`} ${esc(i.porque)}</p>` : ''}
            </div>`;
        }).join('')}
      </div>`;
  }

  function montar(b, v) {
    const val = (id) => {
      const c = b.campos.find((x) => x.id === id);
      return v[id] != null ? esc(c.pecas[v[id]].texto) : '<span class="vazio">...</span>';
    };
    return `«Quando ${val('quando')}, fico ${val('sinto')}, porque ${val('porque')}. Preferia que ${val('prefiro')}.»`;
  }

  // ---------- páginas ----------

  function desenharNav() {
    const itens = C.modulos.map((m, n) => `
      <button class="nav-item${est.modulo === n ? ' atual' : ''}" data-ir="${n}" ${est.modulo === n ? 'aria-current="page"' : ''}>
        <span class="nav-numero">${n + 1}${est.feitos[m.id] ? ' · feito' : ''}</span>
        <span class="nav-titulo">${esc(m.titulo)}</span>
      </button>`).join('');
    nav.innerHTML = `${itens}
      <button class="nav-item${est.modulo === 'refs' ? ' atual' : ''}" data-ir="refs">
        <span class="nav-numero">Fontes</span><span class="nav-titulo">Referências</span>
      </button>
      <a class="nav-item nav-jogo" href="index.html"><span class="nav-numero">Praticar</span><span class="nav-titulo">Ir para o jogo</span></a>`;
  }

  function desenharModulo() {
    if (est.modulo === 'refs') {
      conteudo.innerHTML = `
        <h2 class="modulo-titulo">Referências</h2>
        <ol class="referencias">${C.referencias.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
        <div class="acoes"><button class="pausa secundario" data-ir="0">Voltar ao início</button></div>`;
      return;
    }
    const n = est.modulo;
    const m = C.modulos[n];
    const ultimo = n === C.modulos.length - 1;
    conteudo.innerHTML = `
      <p class="modulo-numero">Módulo ${n + 1} de ${C.modulos.length}</p>
      <h2 class="modulo-titulo">${esc(m.titulo)}</h2>
      ${m.blocos.map((b, i) => `<div class="bloco bloco-${b.tipo}">${B[b.tipo](b, `${m.id}-${i}`)}</div>`).join('')}
      <div class="acoes acoes-modulo">
        ${ultimo
          ? '<a class="avancar" href="index.html" data-concluir="1">Terminar e ir para o jogo</a>'
          : `<button class="avancar" data-seguinte="1">Módulo ${n + 2}</button>`}
        ${n > 0 ? `<button class="pausa secundario" data-ir="${n - 1}">Módulo anterior</button>` : ''}
      </div>`;
  }

  function render(topo) {
    desenharNav();
    desenharModulo();
    if (topo) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // O diário em texto simples: objetivos e um modelo de registo para repetir.
  // (A impressão não está disponível na versão online, por isso copia-se.)
  function textoDiario(k) {
    const b = C.modulos.find((m) => m.id === 'pratica').blocos.find((x) => x.tipo === 'diario');
    const v = est.r[k] || {};
    const objetivos = b.fases.map((f) => `${f.nome}\n${v[f.id] != null ? f.opcoes[v[f.id]] : '...'}`).join('\n\n');
    const registo = ['Data:', 'O que aconteceu:', 'O que fiz:', 'O que sentia:', 'Como teria sido uma resposta assertiva:', 'O que me dificultou:'].join('\n');
    return `O MEU DIÁRIO DE ASSERTIVIDADE\n\nOBJETIVOS\n\n${objetivos}\n\nREGISTO (repetir para cada situação)\n\n${registo}\n`;
  }

  // ---------- eventos ----------

  document.addEventListener('click', (ev) => {
    const b = ev.target.closest('button, a');
    if (!b || b.disabled) return;
    const d = b.dataset;
    let topo = false;

    if (d.ir !== undefined) {
      est.modulo = d.ir === 'refs' ? 'refs' : Number(d.ir);
      topo = true;
    } else if (d.seguinte) {
      est.feitos[C.modulos[est.modulo].id] = true;
      est.modulo += 1;
      topo = true;
    } else if (d.concluir) {
      est.feitos[C.modulos[est.modulo].id] = true;
      guardar();
      return;   // segue a ligação para o jogo
    } else if (d.escolha) {
      est.r[d.k][d.n] = d.escolha;
    } else if (d.barreira) {
      const sel = est.r[d.k];
      const i = sel.indexOf(d.barreira);
      if (i >= 0) sel.splice(i, 1); else sel.push(d.barreira);
    } else if (d.versao !== undefined) {
      est.r[d.k][d.n] = Number(d.versao);
    } else if (d.peca !== undefined) {
      est.r[d.k][d.campo] = Number(d.peca);
    } else if (d.opcao !== undefined) {
      est.r[d.k][d.fase] = Number(d.opcao);
    } else if (d.acrescentar) {
      est.r[d.k].push(d.acrescentar);
    } else if (d.subir !== undefined || d.descer !== undefined) {
      const lista = est.r[d.k];
      const i = Number(d.subir !== undefined ? d.subir : d.descer);
      const j = d.subir !== undefined ? i + 1 : i - 1;
      [lista[i], lista[j]] = [lista[j], lista[i]];
    } else if (d.tirar !== undefined) {
      est.r[d.k].splice(Number(d.tirar), 1);
    } else if (d.copiar) {
      diarioCopiado = d.copiar;
      copiaFalhou = false;
      const texto = textoDiario(d.copiar);
      const mostrar = () => { render(false); const t = document.getElementById('diario-texto'); if (t && copiaFalhou) { t.focus(); t.select(); } };
      try {
        navigator.clipboard.writeText(texto).then(mostrar, () => { copiaFalhou = true; mostrar(); });
      } catch (_) { copiaFalhou = true; mostrar(); }
      guardar();
      return;
    } else {
      return;
    }
    guardar();
    // O foco fica no botão carregado, para não saltar para o início da página.
    const foco = d.escolha ? `[data-escolha="${d.escolha}"][data-n="${d.n}"][data-k="${d.k}"]`
      : d.versao !== undefined ? `[data-versao="${d.versao}"][data-n="${d.n}"][data-k="${d.k}"]`
      : d.peca !== undefined ? `[data-peca="${d.peca}"][data-campo="${d.campo}"][data-k="${d.k}"]`
      : d.opcao !== undefined ? `[data-opcao="${d.opcao}"][data-fase="${d.fase}"][data-k="${d.k}"]`
      : null;
    render(topo);
    if (foco) { const el = document.querySelector(foco); if (el) el.focus({ preventScroll: true }); }
  });

  render(false);
})();
