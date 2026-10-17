// Mapa das pontuações: todas as respostas de cada cenário, com postura, quando aparecem,
// efeitos nos medidores e destino. Gerado a partir dos dados, para rever sem abrir o código.
// Uso (dentro de universitarios): node ferramentas/gerar-mapa.js  → ferramentas/mapa-pontuacoes.html
const fs = require('fs');
const path = require('path');
const raiz = path.resolve(__dirname, '..');
global.window = {};
for (const f of ['01', '02', '03']) require(path.join(raiz, 'dados', `cenario-${f}.js`));
const Motor = require(path.join(raiz, 'js', 'motor.js'));

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sinal = (v) => (v ? (v > 0 ? `+${v}` : `${v}`) : '');
const POSTURA = { assertiva: 'Assertiva', agressiva: 'Agressiva', passiva: 'Passiva', 'passivo-agressiva': 'Passivo-agressiva' };
const REAGE = { abre: 'aproxima-se', justifica: 'justifica-se', defende: 'defende-se', afasta: 'afasta-se', nada: 'não dá por nada' };

// Percorre todos os caminhos (sem pausas) para saber com que raiva se chega a cada momento
// e que respostas chegam a estar disponíveis. Chave: verdade|momento.
function explorar(c) {
  const chegadas = {};     // momento -> Set de raivas tuas ao chegar
  const vistas = new Set(); // "momento:i" de respostas que aparecem livres em algum caminho
  const memo = new Set();
  const copia = (e) => Object.assign({}, e, { escondidas: new Map(e.escondidas), marcas: Object.assign({}, e.marcas), historico: e.historico.slice(), previsoes: e.previsoes.slice(), avisos: [] });
  function passo(e) {
    const k = `${e.verdade}|${e.no}|${e.eu}|${e.outro}|${e.marcas.sabe ? 1 : 0}`;
    if (memo.has(k)) return;
    memo.add(k);
    (chegadas[e.no] = chegadas[e.no] || new Set()).add(e.eu);
    if (Motor.atual(e).fim) return;
    for (const op of Motor.opcoes(e)) {
      if (op.estado !== 'livre') continue;
      vistas.add(`${e.no}:${e.verdade}:${op.i}`);
      const f = copia(e);
      Motor.escolher(f, op.i);
      passo(f);
    }
  }
  for (const v of c.verdades) passo(Motor.novo(c, v));
  return { chegadas, vistas };
}

function intervalo(set) {
  if (!set || !set.size) return 'nunca se chega aqui';
  const xs = [...set].sort((a, b) => a - b);
  return xs[0] === xs[xs.length - 1] ? `${xs[0]}` : `${xs[0]} a ${xs[xs.length - 1]}`;
}

function quando(r) {
  if (!r) return '<span class="sempre">sempre</span>';
  if (r.euMax != null) return `raiva até ${r.euMax}`;
  if (r.euMin != null) return `<span class="alta">raiva ${r.euMin} ou mais</span>`;
  return '<span class="sempre">sempre</span>';
}

// Ordem de leitura: pela ordem em que os momentos são alcançados a partir do início.
function ordem(c) {
  const vistos = [];
  const fila = ['inicio'];
  while (fila.length) {
    const id = fila.shift();
    if (vistos.includes(id) || !c.nos[id]) continue;
    vistos.push(id);
    const n = c.nos[id];
    const ops = [n.opcoes || [], ...Object.values(n.variantes || {}).map((v) => v.opcoes || [])].flat();
    for (const o of ops) fila.push(o.vai);
  }
  return vistos.concat(Object.keys(c.nos).filter((id) => !vistos.includes(id)));
}

function nome(c, id) {
  const n = c.nos[id];
  if (!n) return id;
  if (n.fim) return `Final: ${n.titulo}`;
  if (id === 'inicio') return 'Primeira reação';
  const t = n.fala || n.narracao || '';
  return `${n.hora || ''} · ${t.length > 60 ? t.slice(0, 57) + '...' : t}`;
}

function tabela(c, opcoes, id, verdades, an) {
  const aparece = (i) => verdades.some((v) => an.vistas.has(`${id}:${v}:${i}`));
  return `
    <table>
      <thead><tr><th>Resposta</th><th>Postura</th><th>Aparece</th><th>Tu</th><th>${esc(c.nomeCurto || c.outro)}</th><th>Relação</th><th>Reação</th><th>Segue para</th></tr></thead>
      <tbody>${opcoes.map((o, i) => {
        const e = o.efeitos || {};
        const nunca = !aparece(i);
        const post = o.postura ? `<span class="p p-${o.postura}">${POSTURA[o.postura]}</span>` : `<span class="p">${esc(o.tipo)}</span>`;
        return `<tr>
          <td class="txt">${esc(o.texto)}</td>
          <td>${post}</td>
          <td>${quando(o.requer)}${nunca ? '<br><span class="nunca">nunca aparece</span>' : ''}</td>
          <td class="n">${sinal(e.eu)}</td>
          <td class="n">${sinal(e.outro)}</td>
          <td class="n">${sinal(e.relacao)}</td>
          <td>${esc(REAGE[o.reage] || '')}</td>
          <td><a href="#${c.id}-${o.vai}">${esc(nome(c, o.vai))}</a></td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
}

function reacoes(c) {
  const ops = c.nos.inicio.opcoes;
  return `
    <table>
      <thead><tr><th>Primeira reação</th><th>Gatilho</th><th>A tua raiva começa em</th></tr></thead>
      <tbody>${ops.map((o) => `<tr><td class="txt">${esc(o.texto)}</td><td>${esc(o.lente)}</td><td class="n">${c.inicial.eu + ((o.efeitos || {}).eu || 0)}</td></tr>`).join('')}</tbody>
    </table>`;
}

function cenario(c) {
  const an = explorar(c);
  const ids = ordem(c).filter((id) => id !== 'inicio');
  const blocos = ids.map((id) => {
    const n = c.nos[id];
    const entrada = n.entrada ? `<p class="entrada">Ao entrar neste momento: ${Object.entries(n.entrada).map(([k, v]) => `${k === 'eu' ? 'tu' : k === 'outro' ? c.outro : k} ${sinal(v)}`).join(', ')}</p>` : '';
    if (n.fim) {
      return `<section id="${c.id}-${id}" class="no fim"><h3>${esc(nome(c, id))}</h3>${entrada}<p class="narr">${esc(n.texto)}</p></section>`;
    }
    const comVariante = Object.keys(n.variantes || {}).filter((k) => n.variantes[k].opcoes);
    const base = c.verdades.filter((v) => !comVariante.includes(v));
    const variantes = comVariante.map((k) => { const v = n.variantes[k];
      return `<h4>Se a verdade for «${esc(k)}»</h4>${v.fala ? `<p class="fala">«${esc(v.fala)}»</p>` : ''}${tabela(c, v.opcoes, id, [k], an)}`; }).join('');
    const outras = Object.entries(n.variantes || {}).filter(([, v]) => !v.opcoes && v.fala).map(([k, v]) =>
      `<p class="fala var">Se a verdade for «${esc(k)}»: «${esc(v.fala)}»</p>`).join('');
    return `
      <section id="${c.id}-${id}" class="no">
        <h3>${esc(nome(c, id))}${n.marca === 'sabe' ? ' <span class="tag">revelação</span>' : ''}${n.leitura ? ' <span class="tag">leitura do outro</span>' : ''}</h3>
        ${entrada}
        <p class="chega">Chegas aqui com raiva ${intervalo(an.chegadas[id])}${n.entrada && n.entrada.eu ? ' (já com o efeito da fala do outro)' : ''}</p>
        ${n.narracao ? `<p class="narr">${esc(n.narracao)}</p>` : ''}
        ${n.fala ? `<p class="fala">${esc(c.outro)}: «${esc(n.fala)}»</p>` : ''}
        ${outras}
        ${n.leitura ? `<p class="narr">Pergunta: ${esc(n.leitura)}</p>` : ''}
        ${n.opcoes ? tabela(c, n.opcoes, id, base, an) : ''}
        ${variantes}
      </section>`;
  }).join('');
  return `
    <section class="cenario" id="${c.id}">
      <h2>Cenário ${c.numero} · ${esc(c.titulo)}</h2>
      <p>Começas com raiva ${c.inicial.eu}, ${esc(c.outro)} com ${c.inicial.outro}. Verdades possíveis: ${c.verdades.map(esc).join(', ')}.</p>
      ${reacoes(c)}
      ${blocos}
    </section>`;
}

const cens = ['grupo', 'amiga', 'docente'].map((id) => window.CENARIOS[id]);
const html = `<!doctype html>
<html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mapa das pontuações</title>
<style>
  body { font: 15px/1.45 -apple-system, system-ui, sans-serif; color: #231d33; background: #fbf7ef; margin: 0; padding: 24px; }
  main { max-width: 1200px; margin: 0 auto; }
  h1 { margin: 0 0 4px; } h2 { margin: 40px 0 8px; padding-top: 12px; border-top: 3px solid #231d33; }
  h3 { margin: 0 0 6px; font-size: 16px; } h4 { margin: 12px 0 4px; font-size: 14px; }
  .regras { background: #fff; border: 2px solid #231d33; border-radius: 12px; padding: 12px 18px; }
  .regras li { margin: 3px 0; }
  nav a { margin-right: 14px; }
  .no { background: #fff; border: 1px solid #d8cfbf; border-radius: 10px; padding: 12px 14px; margin: 12px 0; scroll-margin-top: 12px; }
  .no:target { outline: 3px solid #7a5cc7; }
  .fim { background: #f1ede4; }
  .fala { font-weight: 600; margin: 4px 0; } .fala.var { font-weight: 400; font-style: italic; }
  .narr { font-style: italic; margin: 4px 0; } .entrada { font-size: 13px; color: #7a5cc7; margin: 2px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 14px; }
  th, td { text-align: left; padding: 5px 6px; border-bottom: 1px solid #eee4d3; vertical-align: top; }
  th { font-size: 12px; text-transform: uppercase; letter-spacing: .03em; color: #6b6280; }
  td.txt { width: 38%; } td.n { text-align: center; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .p { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #eee; white-space: nowrap; }
  .p-assertiva { background: #c9efe9; } .p-agressiva { background: #ffd0cc; } .p-passiva { background: #e3e0ee; } .p-passivo-agressiva { background: #ffe7a8; }
  .chega { font-size: 13px; font-weight: 600; margin: 2px 0 4px; }
  .nunca { color: #fff; background: #c2362b; border-radius: 999px; padding: 0 7px; font-size: 11px; font-weight: 700; white-space: nowrap; }
  .alta { color: #c2362b; font-weight: 600; white-space: nowrap; } .sempre { color: #6b6280; }
  .tag { font-size: 11px; font-weight: 600; background: #231d33; color: #fff; border-radius: 999px; padding: 1px 8px; vertical-align: 2px; }
</style></head><body><main>
<h1>Mapa das pontuações</h1>
<p>Gerado a partir dos dados do jogo a ${new Date().toLocaleString('pt-PT')}. Voltar a gerar depois de mudar frases: <code>node ferramentas/gerar-mapa.js</code></p>
<nav>${cens.map((c) => `<a href="#${c.id}">Cenário ${c.numero}</a>`).join('')}</nav>
<div class="regras">
  <h3>Como funcionam os números</h3>
  <ul>
    <li><b>Dois medidores de raiva, de 0 a 10:</b> o teu e o do outro. A relação (0 a 10) está escondida e só pesa nos finais.</li>
    <li><b>Três faixas da tua raiva:</b> 0 a 3 calma, 4 a 6 tensa, 7 a 10 alta. A faixa decide o pensamento que aparece em «Por dentro».</li>
    <li><b>Quando aparece cada resposta:</b> «sempre», «raiva até N» (acima de N fica desfocada, não te ocorre) ou «raiva N ou mais» (só aparece com raiva alta).</li>
    <li><b>Contágio:</b> com o outro em ${7} ou mais, a tua raiva sobe 1 em cada momento novo. <b>Explosão:</b> o outro chega a ${Motor.MAX} e salta para o final da explosão.</li>
    <li><b>Pausa:</b> nomear a emoção −2 (−1 com «Não sei bem»), olhar de fora −1. A partir da terceira pausa, o outro sobe 1.</li>
    <li><b>«Chegas aqui com raiva...»</b> é calculado percorrendo todos os caminhos possíveis, sem pausas (as pausas só baixam). <b>«nunca aparece»</b> marca respostas que nenhum caminho torna disponíveis.</li>
    <li>Os números de cada resposta somam-se ao valor atual, sempre entre 0 e 10. A reação do outro (aproxima-se, justifica-se...) é a resposta certa na previsão.</li>
  </ul>
</div>
${cens.map(cenario).join('')}
</main></body></html>`;

const saida = path.join(__dirname, 'mapa-pontuacoes.html');
fs.writeFileSync(saida, html);
console.log('escrito', saida);
