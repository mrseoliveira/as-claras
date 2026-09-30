// Gera um ficheiro Twee 3 por cenário, para importar no Twine 2 (Biblioteca > Importar).
// Uso: node ferramentas/gerar-twine.js   (a partir da pasta universitarios)
// Os ficheiros saem em ../twine/. Voltar a correr sempre que os diálogos mudarem.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

global.window = global;
for (const f of ['cenario-01', 'cenario-02', 'cenario-03']) require(path.join(__dirname, '..', 'dados', f + '.js'));

const SAIDA = path.join(__dirname, '..', '..', 'twine');
fs.mkdirSync(SAIDA, { recursive: true });

const NOMES_VERDADE = {
  trabalho: 'trabalha à noite', desinteresse: 'perdeu o interesse',
  medo: 'medo de não arranjar emprego', conviccao: 'convicção sincera',
  erro: 'erro do professor', criterio: 'nota justificada'
};

// Nó com a variante da verdade aplicada, como no motor do jogo.
function no(cen, id, verdade) {
  const base = cen.nos[id];
  const v = base.variantes && base.variantes[verdade];
  return v ? Object.assign({}, base, v) : base;
}

// O Twine não aceita estes caracteres dentro do texto de uma ligação.
const limpar = (t) => String(t).replace(/->|<-|\||\[|\]/g, ' ');

function efeitos(e) {
  if (!e) return '';
  const partes = [];
  if (e.eu) partes.push(`tua raiva ${e.eu > 0 ? '+' : ''}${e.eu}`);
  if (e.outro) partes.push(`raiva do outro ${e.outro > 0 ? '+' : ''}${e.outro}`);
  if (e.relacao) partes.push(`relação ${e.relacao > 0 ? '+' : ''}${e.relacao}`);
  return partes.join(', ');
}

function etiquetaOpcao(op) {
  const partes = [];
  if (op.tipo === 'leitura') partes.push(op.certaSe ? `leitura certa se: ${NOMES_VERDADE[op.certaSe]}` : 'leitura errada');
  else if (op.tipo === 'reacao') partes.push(`primeira reação: ${op.lente}`);
  else partes.push(op.postura);
  if (op.requer && op.requer.euMax != null) partes.push(`desfocada com raiva > ${op.requer.euMax}`);
  if (op.requer && op.requer.euMin != null) partes.push(`só com raiva ≥ ${op.requer.euMin}`);
  const ef = efeitos(op.efeitos);
  if (ef) partes.push(ef);
  return `(${partes.join(' · ')})`;
}

function gerar(cen) {
  const titulo = `${cen.numero}. ${cen.titulo}`;
  const passagens = [];
  const nomeP = (verdade, id) => `${NOMES_VERDADE[verdade]} · ${id}`;

  cen.verdades.forEach((verdade, fila) => {
    // Profundidade de cada nó a partir do início, para posicionar no mapa.
    const prof = { inicio: 0 };
    const ordem = ['inicio'];
    for (let i = 0; i < ordem.length; i++) {
      const n = no(cen, ordem[i], verdade);
      for (const op of n.opcoes || []) {
        if (!(op.vai in prof)) { prof[op.vai] = prof[ordem[i]] + 1; ordem.push(op.vai); }
      }
    }
    const porNivel = {};
    for (const id of ordem) {
      const nivel = prof[id];
      const pos = (porNivel[nivel] = (porNivel[nivel] || 0) + 1) - 1;
      const n = no(cen, id, verdade);
      const x = 350 + nivel * 250;   // a coluna 100 é do passo Sorteio
      const y = 100 + fila * 1400 + pos * 175;

      const linhas = [];
      if (n.hora) linhas.push(`''${n.hora}''`);
      if (n.narracao) linhas.push(`//${n.narracao}//`);
      if (n.fala) linhas.push(`''${cen.nomeCurto || cen.outro}:'' ${n.fala}`);
      if (n.pensamentos) {
        linhas.push('Por dentro (conforme a tua raiva):');
        linhas.push(`* calma: ${n.pensamentos.calmo}`);
        linhas.push(`* tensa: ${n.pensamentos.tenso}`);
        linhas.push(`* alta: ${n.pensamentos.quente}`);
      }
      if (n.entrada) linhas.push(`(ao entrar: ${efeitos(n.entrada)})`);
      if (n.leitura || n.pergunta) linhas.push(`''${n.leitura || n.pergunta}''`);
      if (n.fim) {
        linhas.push(`''FINAL: ${n.titulo}''`);
        linhas.push(n.texto);
        if (n.textoSabe) linhas.push(`Se já sabe o que se passa: ${n.textoSabe}`);
        if (n.balanco) linhas.push(`Ganhos: ${n.balanco.ganhos.join(', ')}. Perdas: ${n.balanco.perdas.join(', ')}.`);
      }
      for (const op of n.opcoes || []) {
        linhas.push(`[[${limpar(op.texto)} ${limpar(etiquetaOpcao(op))}->${nomeP(verdade, op.vai)}]]`);
      }
      if (!n.fim && cen.explosao) linhas.push(`(se a raiva ${cen.outro.startsWith('professor') ? 'do professor' : 'do outro'} chegar a 10, salta para ${cen.explosao})`);

      const tags = n.fim ? ' [final]' : (id === 'inicio' ? ' [inicio]' : '');
      passagens.push(`:: ${nomeP(verdade, id)}${tags} {"position":"${x},${y}","size":"200,150"}\n${linhas.join('\n\n')}\n`);
    }
  });

  const arranque = `:: Sorteio [inicio] {"position":"100,${100 + 650}","size":"200,100"}\nNo jogo, a verdade é sorteada no início de cada partida.\n\n${cen.verdades.map((v) => `[[${NOMES_VERDADE[v]}->${nomeP(v, 'inicio')}]]`).join('\n')}\n`;
  const ifid = crypto.randomUUID().toUpperCase();
  const cabecalho = `:: StoryTitle\n${titulo}\n\n:: StoryData\n{\n  "ifid": "${ifid}",\n  "format": "Harlowe",\n  "format-version": "3.3.9",\n  "start": "Sorteio",\n  "zoom": 0.6\n}\n`;
  return [cabecalho, arranque, ...passagens].join('\n');
}

for (const cen of Object.values(window.CENARIOS)) {
  const nome = `cenario-${String(cen.numero).padStart(2, '0')}-${cen.id}.twee`;
  fs.writeFileSync(path.join(SAIDA, nome), gerar(cen));
  console.log('escrito', nome);
}
