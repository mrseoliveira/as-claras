// Registo anónimo das jogadas no Supabase (tabela "eventos", ver ferramentas/supabase.sql).
// Sem URL e chave preenchidos, ou sem consentimento, não envia nada.
// Não guarda nomes, IPs nem o user agent completo, só uma sessão aleatória e o código que a pessoa escolher.
(function (global) {
  const SUPABASE_URL = '';   // ex.: https://xxxx.supabase.co
  const SUPABASE_KEY = '';   // chave pública (anon / publishable), só permite inserir
  const VERSAO = 'prototipo-conversa-2026-10-17';
  const RESERVA = 'asclaras-registo-pendente';

  let ativo = false;
  let sessao = null;
  let codigo = null;
  let ordem = 0;
  let contexto = { cenario: null, partida: null };
  let fila = [];
  let aEnviar = false;
  let temporizador = null;

  const configurado = () => !!(SUPABASE_URL && SUPABASE_KEY);

  function novoId() {
    if (global.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  // Eventos que não chegaram a sair numa visita anterior (sem rede, janela fechada).
  function recuperar() {
    try {
      const antigos = JSON.parse(localStorage.getItem(RESERVA)) || [];
      localStorage.removeItem(RESERVA);
      return antigos;
    } catch (_) { return []; }
  }
  function reservar() {
    try { localStorage.setItem(RESERVA, JSON.stringify(fila.slice(-500))); } catch (_) { /* sem armazenamento, perde-se */ }
  }

  function pedido(linhas, keepalive) {
    return fetch(`${SUPABASE_URL}/rest/v1/eventos`, {
      method: 'POST',
      keepalive: !!keepalive,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(linhas)
    });
  }

  async function enviar() {
    temporizador = null;
    if (aEnviar || !fila.length) return;
    aEnviar = true;
    const lote = fila.slice(0, 50);
    try {
      const r = await pedido(lote);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      fila = fila.slice(lote.length);
      reservar();
    } catch (_) {
      reservar();   // tenta outra vez no próximo evento
    }
    aEnviar = false;
    if (fila.length) agendar();
  }

  function agendar() {
    if (!temporizador) temporizador = setTimeout(enviar, 1500);
  }

  function consentir(cod) {
    if (!configurado()) return;
    ativo = true;
    sessao = novoId();
    codigo = (cod || '').trim().toUpperCase().slice(0, 40) || null;
    fila = recuperar();
    evento('sessao_inicio', {
      ecra: `${screen.width}x${screen.height}`,
      janela: `${innerWidth}x${innerHeight}`,
      toque: matchMedia('(pointer: coarse)').matches,
      idioma: navigator.language
    });
  }

  function definirContexto(c) {
    contexto = Object.assign({}, contexto, c);
  }

  function evento(tipo, dados) {
    if (!ativo) return;
    ordem += 1;
    fila.push({
      sessao,
      codigo,
      versao: VERSAO,
      cenario: contexto.cenario,
      partida: contexto.partida,
      ordem,
      tipo,
      momento: new Date().toISOString(),
      dados: dados || {}
    });
    agendar();
  }

  // Ao sair da página, o que estiver na fila vai com keepalive (sobrevive ao fecho da janela).
  addEventListener('pagehide', () => {
    if (!ativo || !fila.length) return;
    reservar();
    pedido(fila.slice(0, 50), true).then((r) => { if (r.ok) { fila = fila.slice(50); reservar(); } }).catch(() => {});
  });

  global.Registo = { configurado, consentir, evento, definirContexto, ativo: () => ativo };
})(window);
