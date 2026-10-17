// Ilustração da cena em SVG: formas planas, cores saturadas, contorno escuro.
// A expressão de cada personagem acompanha a raiva. Quem tem a vez fica a cores,
// o outro fica esbatido. Com a tua raiva alta, a cena fecha-se em túnel e a cara
// do outro desfoca (a raiva estreita a atenção).
// O espaço, a aparência do outro e os objetos vêm de cenario.cena.
(function (global) {
  const TINTA = '#2b2042';

  // Sobrancelhas desenhadas do lado esquerdo e espelhadas para o direito.
  const ROSTOS = {
    calmo:       { sobr: 'M -36 218 Q -24 209 -11 216', olhos: 'redondos', boca: 'M -18 265 Q 0 281 18 265' },
    tenso:       { sobr: 'M -36 215 L -11 215',          olhos: 'redondos', boca: 'M -16 271 L 16 271' },
    zangado:     { sobr: 'M -38 208 L -10 221',          olhos: 'estreitos', boca: 'M -20 279 Q 0 261 20 279' },
    vergonha:    { sobr: 'M -36 219 L -12 210',          olhos: 'baixos',   boca: 'M -10 273 Q 0 268 10 273' },
    triste:      { sobr: 'M -36 219 L -12 210',          olhos: 'redondos', boca: 'M -14 276 Q 0 267 14 276' },
    preocupado:  { sobr: 'M -36 218 L -12 208',          olhos: 'redondos', boca: 'M -16 274 Q -8 267 0 273 Q 8 279 16 272' },
    indiferente: { sobr: 'M -36 216 Q -24 213 -11 216', olhos: 'lado',     boca: 'M -14 272 Q 2 275 16 266' }
  };

  const EXPR_POR_BANDA = { calmo: 'calmo', tenso: 'tenso', quente: 'zangado' };

  // Paleta de cada espaço.
  const LOCAIS = {
    sala:     { parede: '#ffc87a', rodape: '#ffb25e', mesa: '#3fb8af', mesaFrente: '#2f948d' },
    cafe:     { parede: '#ffd3c4', rodape: '#f7a98f', mesa: '#c98b5e', mesaFrente: '#a86f45' },
    gabinete: { parede: '#cfe3d4', rodape: '#aecdb8', mesa: '#a86b3c', mesaFrente: '#8a5530' }
  };

  const contorno = `stroke="${TINTA}" stroke-width="5" stroke-linejoin="round"`;

  function olhos(tipo) {
    if (tipo === 'baixos') {
      const arco = 'M -30 241 Q -22 248 -14 241';
      return `<path d="${arco}" fill="none" stroke="${TINTA}" stroke-width="5" stroke-linecap="round"/>
              <path d="${arco}" transform="scale(-1,1)" fill="none" stroke="${TINTA}" stroke-width="5" stroke-linecap="round"/>`;
    }
    if (tipo === 'lado') {
      return `<ellipse cx="-16" cy="241" rx="6" ry="5" fill="${TINTA}"/>
              <ellipse cx="28" cy="241" rx="6" ry="5" fill="${TINTA}"/>
              <path d="M -32 235 L -10 235 M 12 235 L 34 235" stroke="${TINTA}" stroke-width="4" stroke-linecap="round"/>`;
    }
    const ry = tipo === 'estreitos' ? 4 : 7.5;
    return `<ellipse cx="-22" cy="239" rx="7" ry="${ry}" fill="${TINTA}"/>
            <ellipse cx="22" cy="239" rx="7" ry="${ry}" fill="${TINTA}"/>`;
  }

  function oculos() {
    return `<g fill="none" stroke="${TINTA}" stroke-width="4">
              <circle cx="-22" cy="240" r="15"/><circle cx="22" cy="240" r="15"/>
              <path d="M -7 238 Q 0 233 7 238"/>
            </g>`;
  }

  function rosto(expr, raiva, comOculos) {
    const r = ROSTOS[expr] || ROSTOS.calmo;
    const rubor = ((raiva / 10) * 0.8).toFixed(2);
    return `
      <circle cx="-40" cy="260" r="13" fill="#ff4d6d" opacity="${rubor}"/>
      <circle cx="40" cy="260" r="13" fill="#ff4d6d" opacity="${rubor}"/>
      <g fill="none" stroke="${TINTA}" stroke-width="6" stroke-linecap="round">
        <path d="${r.sobr}"/><path d="${r.sobr}" transform="scale(-1,1)"/>
      </g>
      ${olhos(r.olhos)}
      ${comOculos ? oculos() : ''}
      <path d="${r.boca}" fill="none" stroke="${TINTA}" stroke-width="5.5" stroke-linecap="round"/>`;
  }

  function vapor(raiva) {
    if (raiva < global.Motor.ALTA + 2) return '';
    const onda = (x) => `<path class="vapor" d="M ${x} 158 q -9 -12 0 -24 q 9 -12 0 -24" fill="none" stroke="#ff4d6d" stroke-width="6" stroke-linecap="round"/>`;
    return `<g>${onda(-34)}${onda(0)}${onda(34)}</g>`;
  }

  // Cabelo em duas camadas: atrás da cabeça e por cima dela.
  function cabeloAtras(tipo, cor) {
    if (tipo === 'liso') {
      return `<path d="M -70 262 Q -78 164 0 160 Q 78 164 70 262 L 58 262 Q 60 214 36 198 Q 6 214 -30 204 Q -56 214 -58 262 Z" fill="${cor}" ${contorno}/>`;
    }
    if (tipo === 'comprido') {
      return `<path d="M -74 330 Q -88 168 0 162 Q 88 168 74 330 Q 40 318 0 322 Q -40 318 -74 330 Z" fill="${cor}" ${contorno}/>`;
    }
    return '';
  }

  function cabeloFrente(tipo, cor) {
    if (tipo === 'liso') {
      return `<path d="M -60 222 Q -50 176 0 172 Q 50 176 60 222 Q 30 200 4 208 Q -28 198 -60 222 Z" fill="${cor}" ${contorno}/>`;
    }
    if (tipo === 'curto') {
      // Corte curto, com risca ao lado.
      return `<path d="M -65 236 Q -72 166 0 164 Q 72 166 65 236 Q 60 206 44 194 Q 10 200 -22 190 Q -48 196 -58 214 Z" fill="${cor}" ${contorno}/>`;
    }
    if (tipo === 'comprido') {
      return `<path d="M -62 230 Q -58 170 0 168 Q 60 170 64 226 Q 44 192 -4 198 Q -36 204 -62 230 Z" fill="${cor}" ${contorno}/>`;
    }
    if (tipo === 'grisalho') {
      // Entradas: cabelo só dos lados.
      const lado = 'M -66 256 Q -72 204 -48 186 Q -40 200 -42 214 Q -54 224 -54 256 Z';
      return `<path d="${lado}" fill="${cor}" ${contorno}/><path d="${lado}" transform="scale(-1,1)" fill="${cor}" ${contorno}/>`;
    }
    return '';
  }

  function balao(tipo, lado, cor) {
    const x = lado === 'esquerda' ? -150 : 78;
    if (tipo === 'fala') {
      const cauda = lado === 'esquerda' ? 'M 58 40 L 78 58 L 44 44' : 'M 14 40 L -6 58 L 28 44';
      return `
        <g class="balao" transform="translate(${x},136)">
          <path d="${cauda}" fill="#fff" stroke="${TINTA}" stroke-width="5" stroke-linejoin="round"/>
          <rect width="72" height="48" rx="16" fill="#fff" stroke="${TINTA}" stroke-width="5"/>
          <path d="${cauda}" fill="#fff" stroke="none" transform="translate(0,-3)"/>
          <circle cx="20" cy="24" r="5" fill="${TINTA}"/><circle cx="36" cy="24" r="5" fill="${TINTA}"/><circle cx="52" cy="24" r="5" fill="${TINTA}"/>
        </g>`;
    }
    return `
      <g class="balao" transform="translate(${x},120)">
        <circle cx="6" cy="70" r="7" fill="${cor}" stroke="${TINTA}" stroke-width="4"/>
        <circle cx="18" cy="54" r="10" fill="${cor}" stroke="${TINTA}" stroke-width="4"/>
        <ellipse cx="54" cy="24" rx="44" ry="28" fill="${cor}" stroke="${TINTA}" stroke-width="5"/>
        <circle cx="38" cy="24" r="4.5" fill="${TINTA}"/><circle cx="54" cy="24" r="4.5" fill="${TINTA}"/><circle cx="70" cy="24" r="4.5" fill="${TINTA}"/>
      </g>`;
  }

  // Nuvem de pensamento com texto, por cima da cabeça. Contorno feito com duas passagens
  // (círculos com traço e depois só o preenchimento), para ficar só a silhueta da nuvem.
  function nuvem(texto, cor) {
    const cx = 0, cy = 82, rx = 200, ry = 52, r = 26, n = 16;
    const bolas = Array.from({ length: n }, (_, k) => {
      const a = (k / n) * Math.PI * 2;
      return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    });
    const forma = (estilo) => `
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${estilo}/>
      ${bolas.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" ${estilo}/>`).join('')}`;
    return `
      <g class="balao nuvem">
        <circle cx="96" cy="176" r="6" fill="${cor}" stroke="${TINTA}" stroke-width="4"/>
        <circle cx="116" cy="156" r="10" fill="${cor}" stroke="${TINTA}" stroke-width="4"/>
        ${forma(`fill="${cor}" stroke="${TINTA}" stroke-width="10"`)}
        ${forma(`fill="${cor}"`)}
        <foreignObject x="${cx - 175}" y="${cy - 54}" width="350" height="108">
          <div xmlns="http://www.w3.org/1999/xhtml" class="nuvem-texto">${texto.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</div>
        </foreignObject>
      </g>`;
  }

  function personagem(p) {
    const expr = p.expr || EXPR_POR_BANDA[global.Motor.banda(p.raiva)];
    const cara = rosto(expr, p.raiva, p.oculos);
    return `
      <g transform="translate(${p.x},0)">
        <g ${p.apagado ? 'filter="url(#apagar)" opacity="0.6"' : ''}>
          ${cabeloAtras(p.cabeloTipo, p.cabelo)}
          <path d="M -100 430 Q -104 322 -42 302 L 42 302 Q 104 322 100 430 Z" fill="${p.camisola}" ${contorno}/>
          <path d="M -16 306 L -20 350 M 16 306 L 20 350" stroke="${TINTA}" stroke-width="4" stroke-linecap="round"/>
          <circle cx="0" cy="238" r="64" fill="${p.pele}" stroke="${TINTA}" stroke-width="5"/>
          ${cabeloFrente(p.cabeloTipo, p.cabelo)}
          ${p.desfoque ? `<g filter="url(#desfoque)">${cara}</g>` : cara}
          ${vapor(p.raiva)}
        </g>
        ${p.pensa ? nuvem(p.pensa, p.corBalao) : p.balao ? balao(p.balao, p.ladoBalao, p.corBalao) : ''}
      </g>`;
  }

  function relogio(hora) {
    const [h, m] = hora.split(':').map(Number);
    return `
      <g transform="translate(118,104)">
        <circle r="44" fill="#fffaf0" stroke="${TINTA}" stroke-width="6"/>
        <line x1="0" y1="0" x2="0" y2="-24" stroke="${TINTA}" stroke-width="7" stroke-linecap="round" transform="rotate(${(h % 12) * 30 + m * 0.5})"/>
        <line x1="0" y1="0" x2="0" y2="-34" stroke="#ff4d6d" stroke-width="5" stroke-linecap="round" transform="rotate(${m * 6})"/>
        <circle r="5" fill="${TINTA}"/>
      </g>`;
  }

  function janela(hora) {
    const h = Number(hora.split(':')[0]);
    const dia = h >= 8 && h < 19;
    const ceu = dia ? '#8fd3ff' : '#3a3a8c';
    const astro = dia
      ? `<circle cx="538" cy="88" r="22" fill="#ffd23f" stroke="${TINTA}" stroke-width="4"/>
         <ellipse cx="428" cy="160" rx="34" ry="14" fill="#fff"/>`
      : `<circle cx="538" cy="88" r="20" fill="#fff3b0"/><circle cx="548" cy="82" r="18" fill="${ceu}"/>
         <circle cx="420" cy="80" r="3" fill="#fff3b0"/><circle cx="462" cy="160" r="2.5" fill="#fff3b0"/><circle cx="506" cy="160" r="3" fill="#fff3b0"/>`;
    return `
      <rect x="376" y="46" width="208" height="156" rx="12" fill="${ceu}" stroke="${TINTA}" stroke-width="6"/>
      ${astro}
      <line x1="480" y1="46" x2="480" y2="202" stroke="${TINTA}" stroke-width="6"/>
      <line x1="376" y1="124" x2="584" y2="124" stroke="${TINTA}" stroke-width="6"/>`;
  }

  function prateleira(base) {
    const livros = [['#ff4d6d', 18, 70], ['#3fb8af', 14, 60], ['#ffd23f', 22, 74], ['#7a5cc7', 16, 66], ['#ff8c42', 20, 72]];
    let x = 832;
    const l = livros.map(([c, w, h]) => {
      const r = `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${c}" stroke="${TINTA}" stroke-width="4"/>`;
      x += w + 2;
      return r;
    }).join('');
    return `<rect x="820" y="${base}" width="116" height="12" fill="#b0643a" stroke="${TINTA}" stroke-width="4"/>${l}`;
  }

  // Elemento de parede próprio de cada espaço, à direita.
  function decoracao(local) {
    if (local === 'cafe') {
      return `
        <line x1="870" y1="0" x2="870" y2="40" stroke="${TINTA}" stroke-width="4"/>
        <path d="M 836 80 Q 836 40 870 40 Q 904 40 904 80 Z" fill="#ffd23f" stroke="${TINTA}" stroke-width="5"/>
        <rect x="780" y="120" width="150" height="110" rx="8" fill="#2f5d50" stroke="${TINTA}" stroke-width="6"/>
        <path d="M 800 150 L 900 150 M 800 175 L 880 175 M 800 200 L 890 200" stroke="#fff6e6" stroke-width="5" stroke-linecap="round"/>`;
    }
    if (local === 'gabinete') {
      return `
        <rect x="810" y="40" width="110" height="80" fill="#fffaf0" stroke="${TINTA}" stroke-width="6"/>
        <rect x="824" y="54" width="82" height="52" fill="none" stroke="#b0643a" stroke-width="4"/>
        <circle cx="865" cy="92" r="8" fill="#ff4d6d"/>
        ${prateleira(236)}`;
    }
    return prateleira(176);
  }

  function fundo(hora, local) {
    const c = LOCAIS[local] || LOCAIS.sala;
    return `
      <rect width="960" height="520" fill="${c.parede}"/>
      <rect y="300" width="960" height="220" fill="${c.rodape}"/>
      ${janela(hora)}
      ${relogio(hora)}
      ${decoracao(local)}`;
  }

  function mesa(local) {
    const c = LOCAIS[local] || LOCAIS.sala;
    return `
      <rect x="40" y="418" width="880" height="34" rx="8" fill="${c.mesa}" stroke="${TINTA}" stroke-width="6"/>
      <rect x="64" y="452" width="832" height="80" fill="${c.mesaFrente}" stroke="${TINTA}" stroke-width="6"/>`;
  }

  const ADERECOS = {
    portatil: `
      <rect x="-74" y="340" width="148" height="80" rx="8" fill="#cfd6ff" stroke="${TINTA}" stroke-width="5"/>
      <circle cx="0" cy="380" r="9" fill="#9aa4e8"/>`,
    caneca: `
      <rect x="-18" y="384" width="36" height="36" rx="5" fill="#ff4d6d" stroke="${TINTA}" stroke-width="5"/>
      <path d="M 18 392 Q 32 396 18 410" fill="none" stroke="${TINTA}" stroke-width="5"/>`,
    chavena: `
      <ellipse cx="0" cy="418" rx="34" ry="7" fill="#fff" stroke="${TINTA}" stroke-width="4"/>
      <path d="M -22 390 L 22 390 L 16 416 L -16 416 Z" fill="#fff" stroke="${TINTA}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M 21 394 Q 34 398 19 408" fill="none" stroke="${TINTA}" stroke-width="4"/>`,
    folha: `
      <path d="M -40 404 L 36 398 L 42 420 L -34 424 Z" fill="#fffaf0" stroke="${TINTA}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M -26 410 L 22 406" stroke="#9aa4e8" stroke-width="3"/>`,
    papeis: `
      <rect x="-50" y="398" width="100" height="22" fill="#fffaf0" stroke="${TINTA}" stroke-width="4"/>
      <rect x="-44" y="386" width="96" height="14" fill="#fff" stroke="${TINTA}" stroke-width="4"/>`
  };

  function adereco(tipo, x) {
    return ADERECOS[tipo] ? `<g transform="translate(${x},0)">${ADERECOS[tipo]}</g>` : '';
  }

  // vez: 'outro' (o outro fala, tu pensas) | 'eu' (é a tua vez) | null (ninguém em destaque)
  // pensa: o pensamento automático, numa nuvem por cima da tua cabeça
  function desenhar(e, vez, pensa) {
    const no = global.Motor.atual(e);
    const cen = e.cen;
    const cfg = cen.cena || {};
    const local = cfg.local || 'sala';
    const ap = cfg.outro || {};
    const ad = cfg.aderecos || {};
    const hora = no.hora || '12:00';
    const A = global.Motor.ALTA;
    const desfoqueOutro = e.eu >= A ? (e.eu - A + 1) * 1.3 : 0;
    const tunel = Math.max(0, Math.min(1, (e.eu - global.Motor.TENSA + 1) / 7)) * 0.85;
    const art = cen.artigos || { o: 'o', ao: 'ao' };
    const aderecoOutro = no.aderecoOutro || ad.outro;   // ex.: o Tomás passa a ter o portátil quando começa a escrever

    const eu = personagem({
      x: 270, raiva: e.eu, expr: no.exprEu || null,
      pele: '#f5c7a1', camisola: '#ffd23f', cabelo: '#2b2042', cabeloTipo: 'liso',
      apagado: vez === 'outro',
      balao: vez === 'outro' ? 'pensa' : null, ladoBalao: 'direita', corBalao: '#fff1b8',
      pensa: vez === 'outro' ? null : pensa
    });
    const outro = no.ausente ? '' : personagem({
      x: 690, raiva: e.outro, expr: no.expr && no.expr !== 'calmo' ? no.expr : null,
      pele: ap.pele, camisola: ap.camisola, cabelo: ap.cabelo, cabeloTipo: ap.cabeloTipo, oculos: ap.oculos,
      apagado: vez === 'eu', desfoque: desfoqueOutro > 0,
      balao: vez === 'outro' ? 'fala' : null, ladoBalao: 'esquerda'
    });

    const artigoMaiusc = art.o[0].toUpperCase() + art.o.slice(1);
    const legenda = no.ausente
      ? 'Já não está mais ninguém.'
      : (vez === 'outro' ? `${artigoMaiusc} ${cen.outro} está a falar.` : `É a tua vez de responder ${art.ao} ${cen.outro}.`)
        + (pensa && vez !== 'outro' ? ` Pensas: ${pensa}` : '');

    return `
      <svg viewBox="0 0 960 520" role="img" aria-label="${hora}. ${legenda}">
        <defs>
          <filter id="apagar"><feColorMatrix type="saturate" values="0.15"/></filter>
          <filter id="desfoque" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${desfoqueOutro.toFixed(1)}"/></filter>
          <radialGradient id="tunel" cx="50%" cy="48%" r="62%">
            <stop offset="45%" stop-color="${TINTA}" stop-opacity="0"/>
            <stop offset="100%" stop-color="${TINTA}" stop-opacity="1"/>
          </radialGradient>
        </defs>
        ${fundo(hora, local)}
        ${outro}
        ${eu}
        ${mesa(local)}
        ${adereco(ad.eu, 270)}
        ${no.ausente ? '' : adereco(aderecoOutro, aderecoOutro === 'portatil' ? 690 : 610)}
        ${tunel > 0 ? `<rect class="tunel" width="960" height="520" fill="url(#tunel)" opacity="${tunel.toFixed(2)}"/>` : ''}
      </svg>`;
  }

  global.Cena = { desenhar };
})(window);
