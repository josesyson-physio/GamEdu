/* Gamified Edu demo: original code-drawn isometric art (SVG) and the Jo pixel sprite */
'use strict';
(function(){
const TW = 32, TH = 16;
const iso = (x, y, z = 0) => [(x - y) * TW, (x + y) * TH - z];
const P = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
const poly = (pts, fill, extra = '') => `<polygon points="${P(pts)}" fill="${fill}" ${extra}/>`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let seed = 1; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1); };

/* ---- primitives ---- */
function box(x, y, w, d, h, top, left, right, z0 = 0, stroke = 'rgba(20,40,30,.35)'){
  const T = [iso(x, y, z0 + h), iso(x + w, y, z0 + h), iso(x + w, y + d, z0 + h), iso(x, y + d, z0 + h)];
  const L = [iso(x, y + d, z0 + h), iso(x + w, y + d, z0 + h), iso(x + w, y + d, z0), iso(x, y + d, z0)];
  const R = [iso(x + w, y, z0 + h), iso(x + w, y + d, z0 + h), iso(x + w, y + d, z0), iso(x + w, y, z0)];
  const sw = `stroke="${stroke}" stroke-width="1" stroke-linejoin="round"`;
  return poly(L, left, sw) + poly(R, right, sw) + poly(T, top, sw);
}
/* a quad on the front-left face (y = y+d), u along x [0..1], v up [0..1] */
function faceL(x, y, w, d, h, u0, v0, u1, v1, fill, z0 = 0, extra = ''){
  const pt = (u, v) => iso(x + u * w, y + d, z0 + v * h);
  return poly([pt(u0, v0), pt(u1, v0), pt(u1, v1), pt(u0, v1)], fill, extra);
}
function faceR(x, y, w, d, h, u0, v0, u1, v1, fill, z0 = 0, extra = ''){
  const pt = (u, v) => iso(x + w, y + u * d, z0 + v * h);
  return poly([pt(u0, v0), pt(u1, v0), pt(u1, v1), pt(u0, v1)], fill, extra);
}
function tileTop(x, y, w, d, fill, z = 0, extra = ''){ return poly([iso(x, y, z), iso(x + w, y, z), iso(x + w, y + d, z), iso(x, y + d, z)], fill, extra); }

function tree(x, y, s = 1, kind = 'pine', tint = 0){
  const [X, Y] = iso(x, y);
  const g1 = shade('#2f7a4a', tint), g2 = shade('#3f9a58', tint), g3 = shade('#57b86a', tint);
  let o = `<ellipse cx="${X}" cy="${Y + 2}" rx="${10 * s}" ry="${4.5 * s}" fill="rgba(10,40,20,.22)"/>`;
  o += `<rect x="${X - 2 * s}" y="${Y - 10 * s}" width="${4 * s}" height="${11 * s}" fill="#7a4d2c"/>`;
  if(kind === 'pine'){
    o += `<polygon points="${X},${Y - 46 * s} ${X - 14 * s},${Y - 16 * s} ${X + 14 * s},${Y - 16 * s}" fill="${g1}"/>`;
    o += `<polygon points="${X},${Y - 52 * s} ${X - 11 * s},${Y - 28 * s} ${X + 11 * s},${Y - 28 * s}" fill="${g2}"/>`;
    o += `<polygon points="${X},${Y - 56 * s} ${X - 7 * s},${Y - 40 * s} ${X + 2 * s},${Y - 41 * s}" fill="${g3}"/>`;
  } else {
    o += `<circle cx="${X}" cy="${Y - 22 * s}" r="${14 * s}" fill="${g1}"/><circle cx="${X - 5 * s}" cy="${Y - 27 * s}" r="${9 * s}" fill="${g2}"/><circle cx="${X - 7 * s}" cy="${Y - 30 * s}" r="${4 * s}" fill="${g3}"/>`;
  }
  return o;
}
function mountains(x0, x1, base, h, cols, n, sd, snow = true){
  seed = sd; let o = ''; const step = (x1 - x0) / n;
  for(let i = -1; i <= n; i++){
    const cx = x0 + i * step + rnd() * step * .6, hh = h * (.6 + rnd() * .5), w = step * (1 + rnd() * .6);
    o += `<polygon points="${cx - w},${base} ${cx},${base - hh} ${cx + w},${base}" fill="${cols[0]}"/>`;
    o += `<polygon points="${cx},${base - hh} ${cx + w},${base} ${cx + w * .15},${base}" fill="${cols[1]}"/>`;
    if(snow) o += `<polygon points="${cx},${base - hh} ${cx - w * .22},${base - hh * .74} ${cx - w * .08},${base - hh * .78} ${cx + w * .02},${base - hh * .7} ${cx + w * .2},${base - hh * .76}" fill="#fff" opacity=".92"/>`;
  }
  return o;
}
function cloud(x, y, s = 1, op = .9){
  return `<g class="cloud" opacity="${op}"><ellipse cx="${x}" cy="${y}" rx="${46 * s}" ry="${14 * s}" fill="#fff"/><circle cx="${x - 16 * s}" cy="${y - 8 * s}" r="${16 * s}" fill="#fff"/><circle cx="${x + 12 * s}" cy="${y - 12 * s}" r="${20 * s}" fill="#fff"/></g>`;
}
function waterfall(x, y, h, w = 22){
  let o = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#gWater)"/>`;
  for(let i = 0; i < 4; i++) o += `<rect class="fall" x="${x + 3 + i * (w - 6) / 3}" y="${y}" width="2" height="${h}" fill="rgba(255,255,255,.7)" style="animation-delay:-${i * .37}s"/>`;
  o += `<ellipse cx="${x + w / 2}" cy="${y + h}" rx="${w * 1.2}" ry="${w * .35}" fill="rgba(255,255,255,.75)"/>`;
  return o;
}
function island(x, y, w, d, depth, grass = '#7fcf57', dirt = ['#9a6a40', '#7c5230']){
  return box(x, y, w, d, depth, grass, dirt[0], dirt[1], -depth, 'rgba(40,30,20,.25)') +
    poly([iso(x, y + d, 0), iso(x + w, y + d, 0), iso(x + w, y + d, -5), iso(x, y + d, -5)], shade(grass, -.18)) +
    poly([iso(x + w, y, 0), iso(x + w, y + d, 0), iso(x + w, y + d, -5), iso(x + w, y, -5)], shade(grass, -.28));
}
const DEFS = `<defs>
 <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8f2"/><stop offset=".6" stop-color="#c3e8fb"/><stop offset="1" stop-color="#eef9f4"/></linearGradient>
 <linearGradient id="gSkyDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d3b5c"/><stop offset=".55" stop-color="#5a7fa8"/><stop offset="1" stop-color="#f1c58f"/></linearGradient>
 <linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe9fb"/><stop offset="1" stop-color="#5fb4e0"/></linearGradient>
 <linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9f4ff" stop-opacity=".95"/><stop offset="1" stop-color="#7fc5e6" stop-opacity=".85"/></linearGradient>
 <radialGradient id="gSun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff8d8"/><stop offset=".45" stop-color="#ffe9a0" stop-opacity=".8"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>
 <radialGradient id="gGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe38a" stop-opacity=".7"/><stop offset="1" stop-color="#ffe38a" stop-opacity="0"/></radialGradient>
</defs>`;

/* ---- icons (16x16 paths) ---- */
const ICON = {
  plus:'M6 2h4v4h4v4h-4v4H6v-4H2V6h4z', book:'M2 3h5c1 0 1 1 1 1v10s0-1-1-1H2zM14 3H9c-1 0-1 1-1 1v10s0-1 1-1h5z',
  lens:'M7 2a5 5 0 1 1 0 10A5 5 0 0 1 7 2zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm3.5 7.5 1.5-1.5 3 3-1.5 1.5z',
  scan:'M2 2h4v2H4v2H2zM10 2h4v4h-2V4h-2zM2 10h2v2h2v2H2zM12 10h2v4h-4v-2h2zM5 7h6v2H5z',
  dumbbell:'M1 6h2v4H1zM3 4h2v8H3zM11 4h2v8h-2zM13 6h2v4h-2zM5 7h6v2H5z',
  brain:'M8 2c-2 0-3 1-3 2-2 0-3 2-2 3-1 1-1 3 1 4 0 2 2 3 4 2 2 1 4 0 4-2 2-1 2-3 1-4 1-1 0-3-2-3 0-1-1-2-3-2z',
  bolt:'M9 1 3 9h4l-1 6 6-8H8z', star:'M8 1l2 5h5l-4 3 2 6-5-4-5 4 2-6-4-3h5z',
  wave:'M1 6c2-2 4 2 7 0s5-2 7 0v3c-2-2-4 2-7 0S3 7 1 9zM1 11c2-2 4 2 7 0s5-2 7 0v2c-2-2-4 2-7 0s-5-2-7 0z',
  flask:'M6 1h4v1H9v4l5 8c0 1-1 1-1 1H3s-1 0-1-1l5-8V2H6z', chip:'M4 4h8v8H4zM6 6v4h4V6zM5 1h1v3H5zM10 1h1v3h-1zM5 12h1v3H5zM10 12h1v3h-1zM1 5h3v1H1zM1 10h3v1H1zM12 5h3v1h-3zM12 10h3v1h-3z',
  spark:'M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z', spine:'M6 1h4v2H6zM5 4h6v2H5zM6 7h4v2H6zM5 10h6v2H5zM6 13h4v2H6z', lock:'M4 7V5a4 4 0 0 1 8 0v2h1v8H3V7zm2 0h4V5a2 2 0 0 0-4 0z'
};
const icon = (name, x, y, s, fill) => `<path d="${ICON[name] || ICON.plus}" transform="translate(${x},${y}) scale(${s})" fill="${fill}"/>`;

/* ---- clinic buildings ---- */
function building(b, st, gx, gy){
  const w = 3, d = 3;
  const [cx, cy] = iso(gx + w / 2, gy + d / 2);
  let o = `<g class="bld ${st.unlocked ? (st.lvl ? 'built' : 'plot') : 'locked'}" data-b="${b.id}" tabindex="0" role="button" aria-label="${esc(b.name)}: ${st.unlocked ? (st.lvl ? 'level ' + st.lvl : 'ready to build') : 'locked'}">`;
  o += tileTop(gx - .3, gy - .3, w + .6, d + .6, 'transparent', 0, 'class="hit"');
  if(!st.unlocked){
    o += tileTop(gx, gy, w, d, 'rgba(255,255,255,.18)', 0, 'stroke="rgba(255,255,255,.55)" stroke-dasharray="4 4"');
    const h = 34 + (b.need.stage || 5) * 4, T = [iso(gx, gy, h), iso(gx + w, gy, h), iso(gx + w, gy + d, h), iso(gx, gy + d, h)];
    o += `<g class="ghost">${box(gx + .2, gy + .2, w - .4, d - .4, h, 'rgba(255,255,255,.10)', 'rgba(255,255,255,.08)', 'rgba(255,255,255,.05)', 0, 'rgba(255,255,255,.6)')}</g>`;
    o += `<g transform="translate(${cx - 13},${cy - h - 26})"><rect width="26" height="26" rx="8" fill="#173F31" stroke="#F2C75C" stroke-width="2"/>${icon('lock', 5, 5, 1, '#F2C75C')}</g>`;
    o += `<text x="${cx}" y="${cy + 26}" class="plotlbl">${esc(b.need.levels ? b.need.levels + ' level' : b.need.stage ? 'World ' + b.need.stage : 'All worlds')}</text>`;
    return o + '</g>';
  }
  if(!st.lvl){
    o += tileTop(gx, gy, w, d, '#c79a62', 0, 'stroke="#8a6238" stroke-width="1"');
    for(let i = 0; i <= 3; i++){ const [px, py] = iso(gx + i, gy + d); o += `<rect x="${px - 1.5}" y="${py - 12}" width="3" height="12" fill="#8a6238"/>`; }
    for(let i = 0; i <= 3; i++){ const [px, py] = iso(gx + w, gy + i); o += `<rect x="${px - 1.5}" y="${py - 12}" width="3" height="12" fill="#8a6238"/>`; }
    o += `<polyline points="${P([iso(gx, gy + d, 8), iso(gx + w, gy + d, 8), iso(gx + w, gy, 8)])}" fill="none" stroke="#f2c75c" stroke-width="2" stroke-dasharray="6 4"/>`;
    o += `<g class="buildsign" transform="translate(${cx - 44},${cy - 58})"><rect width="88" height="34" rx="9" fill="#FBF6E9" stroke="#173F31" stroke-width="2.5"/>`;
    o += `<text x="44" y="14" class="signT">BUILD</text>${icon('spark', 22, 19, .62, '#c79a2a')}<text x="52" y="29" class="signC">${st.nextCost}</text>`;
    o += `<rect x="40" y="34" width="4" height="22" fill="#8a6238"/></g>`;
    return o + '</g>';
  }
  const L = st.lvl, h1 = 30, h = L === 1 ? h1 : 56, [c0, c1, c2] = b.col;
  o += `<ellipse cx="${cx}" cy="${cy + 4}" rx="${w * TW * 1.05}" ry="${d * TH * 1.05}" fill="rgba(10,40,20,.18)"/>`;
  if(L >= 3) o += `<ellipse class="lvglow" cx="${cx}" cy="${cy}" rx="${w * TW * 1.25}" ry="${d * TH * 1.25}" fill="url(#gGlow)"/>`;
  o += tileTop(gx - .25, gy - .25, w + .5, d + .5, '#e9e2cf', 0, 'stroke="#c7bc9f"');
  // annex wing at level 2+
  if(L >= 2) o += box(gx + w - .2, gy + .5, 1.1, 2, 26, shade(b.roof, .1), c0, c1);
  o += box(gx, gy, w, d, h, shade(b.roof, .05), c0, c1);
  // parapet
  o += poly([iso(gx, gy, h + 4), iso(gx + w, gy, h + 4), iso(gx + w, gy + d, h + 4), iso(gx, gy + d, h + 4)], 'none', `stroke="${shade(b.roof, -.25)}" stroke-width="3" stroke-linejoin="round"`);
  // windows per floor
  const floors = L === 1 ? 1 : 2, lit = L >= 3 ? '#ffe9a6' : '#bfe3f2';
  for(let f = 0; f < floors; f++){
    const v0 = (f * 28 + 10) / h, v1 = (f * 28 + 22) / h;
    for(let i = 0; i < 3; i++){ if(f === 0 && i === 1) continue; const u0 = .1 + i * .3, u1 = u0 + .18;
      o += faceL(gx, gy, w, d, h, u0, v0, u1, v1, lit, 0, 'stroke="rgba(20,40,30,.35)"'); o += faceR(gx, gy, w, d, h, u0, v0, u1, v1, shade(lit, -.12), 0, 'stroke="rgba(20,40,30,.3)"'); }
  }
  // door + awning
  o += faceL(gx, gy, w, d, h, .4, 0, .6, 18 / h, shade(b.roof, -.2));
  o += poly([iso(gx + w * .35, gy + d, 22), iso(gx + w * .65, gy + d, 22), iso(gx + w * .67, gy + d + .4, 18), iso(gx + w * .33, gy + d + .4, 18)], b.roof, 'stroke="rgba(0,0,0,.2)"');
  // emblem on the right face
  const [ex, ey] = iso(gx + w, gy + d * .5, h * .55);
  o += `<g transform="translate(${ex - 2},${ey - 12}) skewY(-26.6)"><rect width="22" height="22" rx="5" fill="${b.roof}"/>${icon(b.icon, 3, 3, 1, '#fff')}</g>`;
  // roof features by level
  const [rx, ry] = iso(gx + w / 2, gy + d / 2, h);
  if(L >= 2){ // solar panels or roof garden
    o += box(gx + .4, gy + .4, 1.1, .8, 4, '#2b4f7a', '#1d3a5c', '#16304e', h);
    o += box(gx + .4, gy + 1.5, 1.1, .8, 4, '#2b4f7a', '#1d3a5c', '#16304e', h);
  }
  if(L >= 3){
    o += `<ellipse cx="${rx + 18}" cy="${ry + 4}" rx="16" ry="8" fill="${shade(b.roof, .25)}"/><path d="M${rx + 2} ${ry + 4}a16 14 0 0 1 32 0z" fill="url(#gGlass)" stroke="rgba(20,40,30,.4)"/>`;
    o += `<rect x="${rx - 22}" y="${ry - 34}" width="2" height="30" fill="#5a5a5a"/><path class="flag" d="M${rx - 20} ${ry - 34}h16l-4 6 4 6h-16z" fill="#F2C75C"/>`;
  }
  // name plaque
  o += `<g transform="translate(${cx},${cy - h - 26})"><rect x="${-b.sign.length * 3.7 - 10}" y="-11" width="${b.sign.length * 7.4 + 20}" height="20" rx="10" fill="#173F31" stroke="#F2C75C" stroke-width="1.5"/><text class="plaque" y="3">${esc(b.sign)}</text></g>`;
  o += `<g transform="translate(${cx + b.sign.length * 3.7 + 6},${cy - h - 40})"><circle r="9" fill="#F2C75C" stroke="#173F31" stroke-width="2"/><text class="lvl" y="3.5">${L}</text></g>`;
  if(L < 3 && st.canAfford) o += `<g class="upnote" transform="translate(${cx - b.sign.length * 3.7 - 18},${cy - h - 40})"><circle r="9" fill="#77B85A" stroke="#173F31" stroke-width="2"/><path d="M-4 1l4-5 4 5h-2.5v4h-3v-4z" fill="#fff"/></g>`;
  return o + '</g>';
}

/* ---- the clinic map ---- */
function clinicMap(){
  const ev = GE.state.evidence();
  let o = `<svg class="clinicmap" viewBox="-640 -330 1270 900" role="group" aria-label="Jo's Clinic map">${DEFS}`;
  o += `<rect x="-640" y="-330" width="1270" height="900" fill="url(#gSky)"/>`;
  o += `<circle cx="380" cy="-220" r="110" fill="url(#gSun)"/><circle cx="380" cy="-220" r="34" fill="#fff6c8"/>`;
  o += mountains(-700, 700, 60, 210, ['#9fb3cf', '#7d93b4'], 6, 7) + mountains(-700, 700, 90, 150, ['#7f9cba', '#61809f'], 7, 19);
  o += `<path d="M-640 90 Q-300 60 0 84 T640 76 V570 H-640z" fill="#8fcf6a"/><path d="M-640 120 Q-200 96 120 116 T640 108 V570 H-640z" fill="#79c25a"/>`;
  seed = 9; for(let i = 0; i < 34; i++){ const x = -640 + i * 39 + rnd() * 20, y = 104 + rnd() * 30, k = .5 + rnd() * .35; o += `<g transform="translate(${x},${y}) scale(${k})"><polygon points="0,-46 -14,-8 14,-8" fill="${i % 2 ? '#2c6e45' : '#357d4f'}"/><rect x="-2" y="-8" width="4" height="8" fill="#6b4426"/></g>`; }
  o += cloud(-420, -200, 1.1) + cloud(120, -250, .8, .8) + cloud(500, -120, .9, .85);
  o += `<g class="drift">${island(-6, -4, 3, 3, 38, '#8fd65a')}${tree(-5, -3, .7, 'pine')}${tree(-4.2, -2.4, .6, 'round')}</g>`;
  // main island
  o += island(-1, 0, 20, 16, 70);
  o += waterfall(iso(19, 4)[0] - 4, iso(19, 4)[1] - 2, 120, 20);
  o += tileTop(-1, 0, 20, 16, 'none', 0, 'stroke="rgba(255,255,255,.18)"');
  // paths
  const path = '#efe2c0';
  o += tileTop(0, 6, 18, 1, path) + tileTop(5, 0, 1, 15, path) + tileTop(9, 0, 1, 15, path) + tileTop(13, 0, 1, 15, path) + tileTop(0, 10, 18, 1, path) + tileTop(0, 2, 18, .6, path);
  // pond
  o += `<ellipse cx="${iso(17.5, 14.5)[0]}" cy="${iso(17.5, 14.5)[1]}" rx="46" ry="20" fill="url(#gWater)" stroke="#fff" stroke-opacity=".6"/>`;
  // trees around the edge (drawn in depth order with buildings)
  const items = [];
  seed = 3; const treeSpots = [[0,0],[0,1.5],[1.5,0],[17,0],[18,1.2],[0,13],[0,14.5],[1.6,15],[4.5,15],[18,4.5],[18.2,9],[16.5,15],[12.5,15],[8.5,15],[18.3,12.2]];
  treeSpots.forEach(([x, y], i) => items.push({d: x + y, s: tree(x + .5, y + .5, .8 + rnd() * .35, i % 3 ? 'pine' : 'round')}));
  seed = 21; for(let i = 0; i < 60; i++){ const x = rnd() * 18, y = rnd() * 15; const onPath = (x > 5 && x < 6) || (x > 9 && x < 10) || (x > 13 && x < 14) || (y > 6 && y < 7) || (y > 10 && y < 11); if(onPath) continue; const [fx, fy] = iso(x, y); items.push({d: x + y - .5, s: `<circle cx="${fx}" cy="${fy}" r="2.2" fill="${['#fff','#ffd9e6','#F2C75C','#ef8f7b'][i % 4]}"/>`}); }
  for(const b of GE.BUILDINGS){ const [gx, gy] = GE.PLOTS[b.id]; items.push({d: gx + gy + 3, s: building(b, GE.state.buildingState(b, ev), gx, gy)}); }
  // Jo walking near reception
  const [jx, jy] = iso(5.5, 10.5); items.push({d: 16.2, s: `<g class="jo-walk" transform="translate(${jx},${jy})"><ellipse rx="9" ry="3.5" fill="rgba(0,0,0,.2)"/><image id="joMapImg" x="-12" y="-36" width="24" height="29"/></g>`});
  items.sort((a, b) => a.d - b.d).forEach(it => o += it.s);
  return o + '</svg>';
}

/* ---- hero world ---- */
function heroWorld(){
  let o = `<svg class="heroworld" viewBox="-520 -300 1040 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${DEFS}`;
  o += `<rect x="-520" y="-300" width="1040" height="640" fill="url(#gSky)"/>`;
  o += `<circle cx="300" cy="-190" r="130" fill="url(#gSun)"/><circle cx="300" cy="-190" r="40" fill="#fff6c8"/>`;
  o += mountains(-600, 600, 90, 240, ['#a7bbd6', '#87a0c0'], 5, 11) + mountains(-600, 600, 130, 170, ['#88a6c4', '#6a89aa'], 6, 29);
  o += cloud(-380, -210, 1.2) + cloud(40, -240, .9, .85) + cloud(420, -60, .8, .8);
  // central island
  o += `<g class="float1">` + island(-3, -3, 7, 7, 60) + waterfall(iso(4, 0)[0] - 2, iso(4, 0)[1], 150, 18);
  o += tileTop(-3, 0, 7, .8, '#efe2c0') + tileTop(0, -3, .8, 7, '#efe2c0');
  const mini = GE.BUILDINGS[0];
  o += box(-2, -2, 2, 2, 34, shade(mini.roof, .05), mini.col[0], mini.col[1]) + faceL(-2, -2, 2, 2, 34, .35, 0, .65, .55, shade(mini.roof, -.2));
  o += box(1.5, -2.5, 2, 2, 50, '#2f7f86', '#e3f0ef', '#b9d6d3') + faceL(1.5, -2.5, 2, 2, 50, .2, .5, .45, .75, '#bfe3f2') + faceL(1.5, -2.5, 2, 2, 50, .55, .5, .8, .75, '#bfe3f2');
  o += box(-2.3, 1.5, 2.2, 2, 24, '#235A40', '#e9dcc4', '#c9b48f');
  o += tree(2.6, 2.2, .8, 'pine') + tree(3.3, 3.2, .65, 'round') + tree(-2.6, -2.9, .6, 'pine');
  const [gx, gy] = iso(1.6, 1.7, 30);
  o += `<g class="gem" transform="translate(${gx},${gy})"><circle r="26" fill="url(#gGlow)"/><polygon points="0,-14 11,-3 0,14 -11,-3" fill="#A9DCEB" stroke="#fff" stroke-width="2"/><polygon points="0,-14 11,-3 0,-1" fill="#d8f2fa"/></g>`;
  o += `<image id="joHeroImg" x="${iso(.2, 1.2)[0] - 16}" y="${iso(.2, 1.2)[1] - 42}" width="32" height="38"/></g>`;
  // left island: school/science hints (coming soon)
  { const [rx, ry] = iso(-10.4, 2.6); o += `<g class="float2">` + island(-12, 1, 3.2, 3.2, 40, '#a3d97a') + tree(-11.4, 3.8, .6, 'pine') + `<g transform="translate(${rx},${ry})"><ellipse rx="16" ry="6" fill="rgba(0,0,0,.2)"/><path d="M0 -78c10 12 12 30 10 52H-10c-2-22 0-40 10-52z" fill="#f4f6f8" stroke="#3b4a5a" stroke-width="2"/><circle cy="-50" r="5" fill="#7fc5e6" stroke="#3b4a5a" stroke-width="1.5"/><path d="M-10 -30l-10 16 10-4zM10 -30l10 16-10-4z" fill="#DF755F"/><path class="flame" d="M-6 -24q6 22 12 0z" fill="#F2C75C"/></g></g>`; }
  // right island: future clinic glow
  o += `<g class="float3">` + island(7, -7, 3.4, 3.4, 44, '#8fd65a') + box(7.5, -6.5, 1.6, 1.6, 58, '#bfe9f5', 'url(#gGlass)', '#9fd3ea') + box(9.2, -6.2, 1, 1, 30, '#6cc2b8', '#e6f5f3', '#a7ddd6') + `</g>`;
  // foreground meadow and pines so the scene sits on land
  o += `<path d="M-700 300 Q-420 210 -150 262 T300 248 T700 236 V400 H-700z" fill="#5eb845"/><path d="M-700 330 Q-300 280 0 312 T700 300 V400 H-700z" fill="#3f9a3c"/>`;
  [[-470,300,1.3],[-420,318,1],[-360,306,1.2],[380,296,1.25],[440,316,1],[490,300,1.3],[-120,330,.9],[160,334,.9]].forEach(([x,y,k]) => { o += `<g transform="translate(${x},${y}) scale(${k})"><polygon points="0,-62 -18,-14 18,-14" fill="#2c6e45"/><polygon points="0,-74 -13,-38 13,-38" fill="#3f9a58"/><rect x="-3" y="-14" width="6" height="14" fill="#7a4d2c"/></g>`; });
  return o + '</svg>';
}

/* ---- card art (game + category covers) ---- */
function cardArt(kind){
  const W = 320, H = 180;
  let o = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${DEFS}`;
  const sky = (a, b) => `<linearGradient id="k${kind}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><rect width="${W}" height="${H}" fill="url(#k${kind})"/>`;
  const hills = (c1, c2) => `<path d="M0 130 Q60 100 120 125 T240 118 T320 122 V180 H0z" fill="${c1}"/><path d="M0 150 Q80 128 160 148 T320 142 V180 H0z" fill="${c2}"/>`;
  const mts = (c) => `<polygon points="-10,130 60,50 130,130" fill="${c}"/><polygon points="80,130 170,35 260,130" fill="${shade(c, -.1)}"/><polygon points="200,130 280,60 350,130" fill="${c}"/><polygon points="170,35 150,58 162,55 172,62 186,52" fill="#fff"/>`;
  switch(kind){
    case 'anatomy-run':
      o += sky('#6cc4f5', '#e6f6ff') + mts('#9fb3cf') + hills('#8fd65a', '#5eb845');
      o += `<rect x="0" y="150" width="${W}" height="30" fill="#8a5a33"/><rect x="0" y="146" width="${W}" height="8" fill="#9be35a"/>`;
      o += `<g transform="translate(190,92)"><circle r="22" fill="url(#gGlow)"/><polygon points="0,-12 10,-2 0,12 -10,-2" fill="#A9DCEB" stroke="#fff" stroke-width="2"/></g>`;
      o += `<rect x="150" y="104" width="22" height="22" rx="3" fill="#e0a664" stroke="#b97a3e" stroke-width="2"/><rect x="172" y="104" width="22" height="22" rx="3" fill="#7fd6f0" stroke="#4aa6c8" stroke-width="2"/>`;
      o += `<image class="cardjo" x="70" y="104" width="36" height="43"/>`; break;
    case 'assessment-lab':
      o += `<rect width="${W}" height="${H}" fill="#0f2e33"/><g opacity=".18">${Array.from({length: 12}, (_, i) => `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="${H}" stroke="#7fe3d2"/>`).join('')}${Array.from({length: 7}, (_, i) => `<line x1="0" y1="${i * 30}" x2="${W}" y2="${i * 30}" stroke="#7fe3d2"/>`).join('')}</g>`;
      o += `<polyline class="ecg" points="0,120 60,120 75,120 85,90 95,150 105,60 115,130 125,120 200,120 215,120 225,96 235,140 245,74 255,124 265,120 320,120" fill="none" stroke="#7fe3d2" stroke-width="3"/>`;
      o += `<g transform="translate(46,30)"><rect width="74" height="96" rx="8" fill="#FBF6E9"/><rect x="24" y="-6" width="26" height="12" rx="4" fill="#c79a2a"/><rect x="10" y="20" width="54" height="5" rx="2" fill="#2f7f86"/><rect x="10" y="34" width="44" height="4" rx="2" fill="#9fb3b0"/><rect x="10" y="46" width="50" height="4" rx="2" fill="#9fb3b0"/><rect x="10" y="58" width="36" height="4" rx="2" fill="#9fb3b0"/><circle cx="54" cy="80" r="8" fill="#DF755F"/></g>`;
      o += `<g transform="translate(230,46) rotate(30)"><rect x="-4" y="0" width="8" height="70" rx="3" fill="#c7cfd6"/><path d="M-22 -6h44a8 8 0 0 1 0 16h-44a8 8 0 0 1 0-16z" fill="#DF755F"/></g>`; break;
    case 'root-cause':
      o += `<rect width="${W}" height="${H}" fill="#1d1636"/>` + Array.from({length: 40}, (_, i) => `<rect x="${(i % 10) * 34 + 4}" y="${Math.floor(i / 10) * 40 + 8}" width="24" height="26" rx="4" fill="${['#3d2f6e','#4b3a86','#2f5d7c'][i % 3]}"/>`).join('');
      o += `<path d="M0 98 Q80 84 160 100 T320 96" stroke="#ffe066" stroke-width="4" fill="none" opacity=".7"/><path d="M0 112 Q90 126 170 110 T320 116" stroke="#ff5d6c" stroke-width="3" stroke-dasharray="7 5" fill="none" opacity=".7"/>`;
      o += `<g transform="translate(230,70)"><circle r="44" fill="#ff5d8f" opacity=".25"/><rect x="-30" y="-26" width="60" height="48" rx="10" fill="#7a1f4a" stroke="#1b0f22" stroke-width="3"/><rect x="-20" y="-10" width="9" height="8" fill="#ffe066"/><rect x="-4" y="-10" width="9" height="8" fill="#ffe066"/><rect x="12" y="-10" width="9" height="8" fill="#ffe066"/><circle cx="-11" cy="-30" r="4" fill="#ff5d8f"/><circle cx="11" cy="-30" r="4" fill="#ff5d8f"/><circle r="40" fill="none" stroke="#b4abff" stroke-width="3" opacity=".8"/></g>`;
      o += `<g transform="translate(120,120)"><path d="M0 -16 L6 -4 L18 -6 L9 3 L14 15 L0 8 L-14 15 L-9 3 L-18 -6 L-6 -4Z" fill="#ff4d5e" stroke="#1b0f22" stroke-width="2"/></g><g transform="translate(170,140)"><circle r="12" fill="#5fb8ff" stroke="#1b0f22" stroke-width="2"/></g>`;
      o += `<circle cx="96" cy="128" r="5" fill="#3ee0b0"/><line x1="96" y1="128" x2="116" y2="122" stroke="#3ee0b0" stroke-width="3" stroke-dasharray="4 4"/>`;
      o += `<image class="cardjo" x="56" y="116" width="36" height="43"/>`; break;
    case 'clinic':
      o += sky('#7cc8f2', '#eef9f4') + mts('#9fb3cf') + hills('#8fd65a', '#5eb845');
      o += `<g transform="translate(160,128) scale(.62)">` + box(-2, -2, 3, 3, 48, '#c8452f', '#f4e3c3', '#d8b98a') + faceL(-2, -2, 3, 3, 48, .4, 0, .6, .4, '#8a3a2d') + faceL(-2, -2, 3, 3, 48, .08, .55, .3, .8, '#bfe3f2') + faceL(-2, -2, 3, 3, 48, .7, .55, .92, .8, '#bfe3f2') + box(1.6, -1.6, 2, 2, 72, '#bfe9f5', 'url(#gGlass)', '#9fd3ea') + tree(-2.6, 1.6, .9, 'round') + tree(2.6, 1.3, .8, 'pine') + `</g>`; break;
    case 'physio':
      o += sky('#6cc4f5', '#eaf8ff') + mts('#a7bbd6') + hills('#8fd65a', '#5eb845');
      o += `<g transform="translate(160,92)"><circle r="40" fill="url(#gGlow)"/><rect x="-9" y="-28" width="18" height="56" rx="4" fill="#fff"/><rect x="-28" y="-9" width="56" height="18" rx="4" fill="#fff"/><rect x="-6" y="-25" width="12" height="50" rx="3" fill="#e3342f"/><rect x="-25" y="-6" width="50" height="12" rx="3" fill="#e3342f"/></g>`; break;
    case 'rocket':
      o += `<rect width="${W}" height="${H}" fill="#14204a"/>` + Array.from({length: 30}, (_, i) => `<circle cx="${(i * 89) % W}" cy="${(i * 47) % 120}" r="${i % 4 ? 1 : 1.8}" fill="#fff" opacity=".85"/>`).join('');
      o += `<circle cx="262" cy="40" r="20" fill="#f2a98a"/><path d="M0 150 Q80 135 160 148 T320 140 V180 H0z" fill="#3b4a5a"/>`;
      o += `<g transform="translate(150,150) rotate(18)"><path d="M0 -110c16 18 18 48 14 82H-14c-4-34-2-64 14-82z" fill="#f4f6f8" stroke="#0c2219" stroke-width="2.5"/><circle cy="-66" r="8" fill="#7fc5e6" stroke="#0c2219" stroke-width="2"/><path d="M-14 -40l-16 26 16-6zM14 -40l16 26-16-6z" fill="#DF755F" stroke="#0c2219" stroke-width="2"/><path class="flame" d="M-9 -28q9 40 18 0z" fill="#F2C75C"/><path d="M-5 -28q5 22 10 0z" fill="#fff"/></g>`;
      o += `<path d="M120 172 q30 -26 60 0" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="10" stroke-linecap="round"/>`; break;
    case 'ai-remote':
      o += sky('#ffcf9a', '#fff1dc') + `<polygon points="-10,120 70,60 150,120" fill="#c9a37a"/><polygon points="120,120 210,50 300,120" fill="#b48a62"/>` + hills('#b9d77a', '#94c25a');
      o += `<g transform="translate(70,128)"><rect x="-22" y="-26" width="44" height="26" fill="#f4e3c3" stroke="#7a4d2c" stroke-width="2"/><polygon points="-28,-26 0,-46 28,-26" fill="#c8452f"/><rect x="-5" y="-14" width="10" height="14" fill="#7a4d2c"/></g>`;
      o += `<g transform="translate(140,134)"><rect x="-18" y="-20" width="36" height="20" fill="#f4e3c3" stroke="#7a4d2c" stroke-width="2"/><polygon points="-24,-20 0,-36 24,-20" fill="#e07a3a"/></g>`;
      o += `<g transform="translate(232,140)"><rect x="-3" y="-90" width="6" height="90" fill="#3b4a5a"/><path d="M-16 -70h32M-12 -54h24" stroke="#3b4a5a" stroke-width="3"/><circle cy="-94" r="6" fill="#7fe3d2"/><circle class="pulse" cy="-94" r="16" fill="none" stroke="#7fe3d2" stroke-width="2"/><circle class="pulse" cy="-94" r="28" fill="none" stroke="#7fe3d2" stroke-width="1.5" opacity=".6"/></g>`;
      o += `<g transform="translate(176,58)"><rect x="-16" y="-4" width="32" height="8" rx="4" fill="#173F31"/><circle cx="-18" cy="-6" r="6" fill="none" stroke="#173F31" stroke-width="2"/><circle cx="18" cy="-6" r="6" fill="none" stroke="#173F31" stroke-width="2"/><rect x="-5" y="4" width="10" height="8" rx="2" fill="#F2C75C"/></g>`;
      o += `<rect x="96" y="150" width="34" height="18" fill="#2b4f7a" transform="skewX(-20)"/>`; break;
    case 'school':
      o += sky('#ffd6a5', '#fff4e3') + hills('#c9e48f', '#a9d06a');
      o += `<g transform="translate(110,60)"><rect width="100" height="70" rx="6" fill="#4a7bd0"/><rect x="8" y="8" width="40" height="54" fill="#fff"/><rect x="52" y="8" width="40" height="54" fill="#fdf6e3"/><rect x="14" y="18" width="28" height="4" fill="#9ab"/><rect x="14" y="28" width="22" height="4" fill="#9ab"/><rect x="58" y="18" width="28" height="4" fill="#9ab"/></g><g transform="translate(232,40) rotate(35)"><rect width="12" height="70" fill="#F2C75C"/><polygon points="0,70 12,70 6,84" fill="#e0a664"/></g>`; break;
    case 'science':
      o += `<rect width="${W}" height="${H}" fill="#1b2350"/>` + Array.from({length: 26}, (_, i) => `<circle cx="${(i * 97) % W}" cy="${(i * 53) % H}" r="${i % 3 ? 1 : 1.8}" fill="#fff" opacity=".8"/>`).join('');
      o += `<g transform="translate(110,96)"><circle r="34" fill="#f2a98a"/><ellipse rx="56" ry="12" fill="none" stroke="#F2C75C" stroke-width="5"/></g><g transform="translate(230,70)"><path d="M-10 -30h20v10l18 40a8 8 0 0 1-7 12h-42a8 8 0 0 1-7-12l18-40z" fill="#b8f0e3" stroke="#fff" stroke-width="3"/><path d="M-22 18h44l4 8a6 6 0 0 1-5 6h-42a6 6 0 0 1-5-6z" fill="#77B85A"/></g>`; break;
    case 'maths':
      o += sky('#c7b8f0', '#f1ecff') + hills('#b9a6e8', '#9a84d8');
      o += `<g transform="translate(160,92)"><polygon points="-70,30 -40,-30 -10,30" fill="#F2C75C" stroke="#fff" stroke-width="3"/><rect x="0" y="-26" width="52" height="52" rx="6" fill="#DF755F" stroke="#fff" stroke-width="3"/><circle cx="-90" cy="-6" r="0"/><text x="26" y="12" class="mathT">π</text></g>`; break;
    case 'medical':
      o += sky('#ffd2d6', '#fff2f3') + hills('#f2b3ba', '#e0939c');
      o += `<g transform="translate(160,90)"><path d="M0 30C-40 4-44-26-22-34-10-38 0-28 0-22 0-28 10-38 22-34 44-26 40 4 0 30z" fill="#e3342f" stroke="#fff" stroke-width="4"/><polyline points="-34,-4 -14,-4 -8,-16 0,10 8,-8 34,-8" fill="none" stroke="#fff" stroke-width="4"/></g>`; break;
    case 'engineering':
      o += sky('#b9cad6', '#eef3f6') + hills('#9fb0bd', '#7f909e');
      o += `<g transform="translate(128,92)"><circle r="34" fill="#3b4a5a"/><circle r="12" fill="#b9cad6"/>${Array.from({length: 8}, (_, i) => `<rect x="-7" y="-46" width="14" height="16" rx="3" fill="#3b4a5a" transform="rotate(${i * 45})"/>`).join('')}</g><g transform="translate(220,120)"><rect x="-6" y="-60" width="12" height="60" fill="#F2C75C"/><rect x="-6" y="-66" width="56" height="12" fill="#F2C75C" transform="rotate(-20 0 -60)"/><circle cy="-60" r="9" fill="#DF755F"/></g>`; break;
  }
  return o + '</svg>';
}

/* ---- futuristic smart clinic ---- */
const FUTURE_PARTS = [
  {id:'land', stage:0, name:'Green campus and mountain valley'},
  {id:'glass', stage:1, name:'Glass rehabilitation hall (Upper Limb Hills)'},
  {id:'sensors', stage:1, name:'Sensor-based assessment suite (Upper Limb Hills)'},
  {id:'gym', stage:2, name:'Smart rehabilitation gym (Sports Ground)'},
  {id:'pool', stage:2, name:'Hydrotherapy pool (Sports Ground)'},
  {id:'ai', stage:3, name:'AI movement-analysis studio (Spine Canyon)'},
  {id:'wear', stage:3, name:'Wearable technology bay (Spine Canyon)'},
  {id:'neuro', stage:4, name:'Advanced neurological rehabilitation (Neuro Nights)'},
  {id:'robot', stage:4, name:'Robotic gait training (Neuro Nights)'},
  {id:'research', stage:5, name:'Research laboratory (build the Smart Clinic)'},
  {id:'solar', stage:5, name:'Sustainable energy and roof gardens (build the Smart Clinic)'}
];
function futureClinic(stagesDone, previewAll){
  const on = p => previewAll || stagesDone >= p.stage;
  const part = (p, solid, holo) => `<g class="fpart ${on(p) ? 'on' : 'holo'}" data-part="${p.id}">${on(p) ? solid : holo}</g>`;
  const ghost = (x, y, w, d, h, z0 = 0) => box(x, y, w, d, h, 'rgba(127,227,210,.10)', 'rgba(127,227,210,.07)', 'rgba(127,227,210,.05)', z0, 'rgba(127,227,210,.75)');
  const tag = (x, y, z, n) => { const [X, Y] = iso(x, y, z); return `<g transform="translate(${X},${Y})"><rect x="${n > 4 ? -38 : -30}" y="-11" width="${n > 4 ? 76 : 60}" height="20" rx="10" fill="rgba(15,46,51,.85)" stroke="#7fe3d2"/><text class="htag" y="3">${n > 4 ? 'FINAL GOAL' : 'WORLD ' + n}</text></g>`; };
  const F = Object.fromEntries(FUTURE_PARTS.map(p => [p.id, p]));
  let o = `<svg class="futuremap" viewBox="-620 -360 1240 860" role="img" aria-label="Futuristic Smart Clinic">${DEFS}`;
  o += `<rect x="-620" y="-360" width="1240" height="860" fill="${previewAll || stagesDone >= 5 ? 'url(#gSky)' : 'url(#gSkyDusk)'}"/>`;
  o += `<circle cx="-360" cy="-230" r="120" fill="url(#gSun)"/>`;
  o += mountains(-700, 700, 40, 240, ['#9fb3cf', '#7d93b4'], 6, 41) + mountains(-700, 700, 80, 170, ['#7f9cba', '#61809f'], 7, 53);
  o += `<path d="M-620 70 Q-300 44 0 66 T620 58 V500 H-620z" fill="#8fcf6a"/><path d="M-620 104 Q-200 82 120 100 T620 94 V500 H-620z" fill="#79c25a"/>`;
  o += cloud(-200, -250, 1, .8) + cloud(330, -200, .9, .7);
  o += island(-2, -1, 22, 16, 80, '#86d35a');
  o += waterfall(iso(20, 3)[0] - 4, iso(20, 3)[1], 140, 22);
  o += tileTop(-1, 6, 21, 1.2, '#e9eef0') + tileTop(8, -1, 1.2, 16, '#e9eef0');
  const items = [];
  // glass hall (centre)
  items.push({d: 14, s: part(F.glass, box(4, 1, 6, 4, 90, '#bfe9f5', 'url(#gGlass)', '#9fd3ea') + faceL(4, 1, 6, 4, 90, 0, .33, 1, .35, 'rgba(255,255,255,.7)') + faceL(4, 1, 6, 4, 90, 0, .66, 1, .68, 'rgba(255,255,255,.7)') + box(5, 2, 4, 2, 20, '#86d35a', '#5eb845', '#4c9a3a', 90) + tree(6.2, 3, .5, 'round') + tree(7.6, 2.8, .45, 'round'),
    ghost(4, 1, 6, 4, 90) + tag(7, 3, 110, 1))});
  // sensor suite
  items.push({d: 6, s: part(F.sensors, box(0, 0, 3, 3, 46, '#4a4f9a', '#e7e9f6', '#c2c7e6') + [0, 1, 2].map(i => faceL(0, 0, 3, 3, 46, .1 + i * .3, .4, .28 + i * .3, .75, '#7fe3d2')).join('') + `<circle cx="${iso(1.5, 1.5, 60)[0]}" cy="${iso(1.5, 1.5, 60)[1]}" r="6" fill="#7fe3d2" class="pulse"/>`,
    ghost(0, 0, 3, 3, 46) + tag(1.5, 1.5, 62, 1))});
  // AI studio
  items.push({d: 22, s: part(F.ai, box(12, 0, 3, 3, 60, '#2b5d8f', '#e4eef7', '#b8cde3') + `<g transform="translate(${iso(13.5, 1.5, 78)[0]},${iso(13.5, 1.5, 78)[1]})"><circle r="16" fill="none" stroke="#7fe3d2" stroke-width="2" class="spin"/><circle r="6" fill="#7fe3d2"/></g>`,
    ghost(12, 0, 3, 3, 60) + tag(13.5, 1.5, 76, 3))});
  // neuro rehab
  items.push({d: 12, s: part(F.neuro, box(0, 5, 3, 3, 40, '#6b4a9a', '#ece2f6', '#cdb8e6') + faceL(0, 5, 3, 3, 40, .3, 0, .7, .5, '#a98ccf'),
    ghost(0, 5, 3, 3, 40) + tag(1.5, 6.5, 54, 4))});
  // smart gym
  items.push({d: 26, s: part(F.gym, box(12, 5, 4, 3, 36, '#c25e49', '#fbe2d9', '#efb9a6') + [0, 1, 2, 3].map(i => faceL(12, 5, 4, 3, 36, .05 + i * .24, .3, .2 + i * .24, .8, '#ffe9a6')).join(''),
    ghost(12, 5, 4, 3, 36) + tag(14, 6.5, 50, 2))});
  // pool
  items.push({d: 24, s: part(F.pool, tileTop(4, 8.5, 6, 3, '#e9eef0') + tileTop(4.4, 8.9, 5.2, 2.2, 'url(#gWater)', 0, 'class="pool"') + `<path d="M${iso(5, 9.6)[0]} ${iso(5, 9.6)[1]}q12 -5 24 0t24 0" stroke="#fff" fill="none" stroke-width="2" opacity=".8"/>`,
    tileTop(4, 8.5, 6, 3, 'rgba(127,227,210,.08)', 0, 'stroke="#7fe3d2" stroke-dasharray="5 4"') + tag(7, 10, 16, 2))});
  // wearables bay
  items.push({d: 18, s: part(F.wear, box(0, 10, 3, 3, 30, '#2f7f86', '#e3f0ef', '#b9d6d3') + `<g transform="translate(${iso(1.5, 11.5, 44)[0]},${iso(1.5, 11.5, 44)[1]})"><rect x="-10" y="-6" width="20" height="12" rx="6" fill="#173F31" stroke="#7fe3d2" stroke-width="2"/><circle r="3" fill="#7fe3d2" class="pulse"/></g>`,
    ghost(0, 10, 3, 3, 30) + tag(1.5, 11.5, 44, 3))});
  // research lab
  items.push({d: 30, s: part(F.research, box(16, 9, 3, 3, 50, '#3b4a5a', '#eef0f2', '#cfd5db') + `<path d="M${iso(17.5, 10.5, 50)[0] - 20} ${iso(17.5, 10.5, 50)[1]}a20 16 0 0 1 40 0z" fill="url(#gGlass)" stroke="#3b4a5a"/>`,
    ghost(16, 9, 3, 3, 50) + tag(17.5, 10.5, 70, 5))});
  // robotic gait trainer
  const [gx, gy] = iso(12.6, 10.8);
  items.push({d: 25, s: part(F.robot, tileTop(11.5, 10, 3, 1.6, '#3b4a5a') + `<g transform="translate(${gx},${gy})"><rect x="-22" y="-56" width="4" height="50" fill="#9aa6b2"/><rect x="18" y="-56" width="4" height="50" fill="#9aa6b2"/><rect x="-22" y="-60" width="44" height="6" rx="3" fill="#cfd5db"/><circle cy="-40" r="7" fill="#7fe3d2"/><rect x="-5" y="-33" width="10" height="16" rx="3" fill="#2b5d8f"/><rect x="-7" y="-17" width="4" height="14" fill="#cfd5db" class="legA"/><rect x="3" y="-17" width="4" height="14" fill="#cfd5db" class="legB"/></g>`,
    tileTop(11.5, 10, 3, 1.6, 'rgba(127,227,210,.08)', 0, 'stroke="#7fe3d2" stroke-dasharray="5 4"') + tag(13, 10.8, 30, 4))});
  // sustainability: turbines + solar
  const turb = (x, y) => { const [X, Y] = iso(x, y); return `<g transform="translate(${X},${Y})"><rect x="-2" y="-90" width="4" height="90" fill="#eef0f2"/><g class="blades" transform="translate(0,-90)"><path d="M0 0L-4 -36L4 -36z" fill="#fff"/><path d="M0 0L-4 -36L4 -36z" fill="#fff" transform="rotate(120)"/><path d="M0 0L-4 -36L4 -36z" fill="#fff" transform="rotate(240)"/></g></g>`; };
  items.push({d: 5, s: part(F.solar, turb(18.5, 0) + turb(19.5, 3) + box(5, 2.2, 1.6, 1, 3, '#2b4f7a', '#1d3a5c', '#16304e', 110) + box(7.2, 2.2, 1.6, 1, 3, '#2b4f7a', '#1d3a5c', '#16304e', 110),
    turb(18.5, 0).replace(/#eef0f2|#fff/g, 'rgba(127,227,210,.5)') + tag(18.5, 0, 120, 5))});
  // land features always present
  seed = 77; [[-1, 14], [1, 14.5], [3.5, 14.6], [10.5, 14.5], [14.5, 14.6], [19.6, 13.6], [19.8, 7], [-1.2, 3]].forEach(([x, y], i) => items.push({d: x + y, s: tree(x + .4, y + .4, .9 + rnd() * .3, i % 2 ? 'round' : 'pine')}));
  items.sort((a, b) => a.d - b.d).forEach(it => o += it.s);
  return o + '</svg>';
}

/* ---- Jo pixel sprite (same character as Anatomy Run, redrawn for the platform) ---- */
const LOOKS = [
  {style:'fade', top:['#7fc3db', '#3f8fae'], pants:'#3d4c6b', shoe:'#DF755F'},
  {style:'wavy', top:['#ef8f7b', '#c25e49'], pants:'#4a5266', shoe:'#77B85A'}
];
const SPR = {};
function joSprite(look, frame){
  const av = LOOKS[look] || LOOKS[0], key = look + frame; if(SPR[key]) return SPR[key];
  const c = document.createElement('canvas'); c.width = 20; c.height = 24; const g = c.getContext('2d');
  const fem = av.style === 'wavy', skin = fem ? '#f0bd95' : '#d2936a', skin2 = fem ? '#d09a72' : '#ad7148', hair = fem ? '#4a2416' : '#221528', hair2 = fem ? '#7a3f24' : '#4b3460',
    shirt = av.top[0], shirt2 = av.top[1], pant = av.pants, pant2 = '#2b3550', shoe = av.shoe, WH = '#ffffff', INK = '#1b1220';
  const F = {idle:{fl:[0,0],bl:[0,0],fa:0,ba:0,bob:0}, run1:{fl:[2,0],bl:[-2,-1],fa:-1,ba:1,bob:0}, run2:{fl:[0,-1],bl:[0,0],fa:0,ba:0,bob:-1}, run3:{fl:[-2,-1],bl:[2,0],fa:1,ba:-1,bob:0}, wave:{fl:[0,0],bl:[0,0],fa:2,ba:0,bob:0}}[frame] || {fl:[0,0],bl:[0,0],fa:0,ba:0,bob:0};
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x + 1, y + 1, w, h); }, b = F.bob;
  const leg = (x, o, back) => { R(x + o[0], 17 + b, 3, 3 + o[1] - b, back ? pant2 : pant); R(x + o[0], 20 + o[1], 4, 2, shoe); R(x + o[0], 21 + o[1], 4, 1, back ? '#a8503f' : '#b85a47'); R(x + o[0] + 3, 20 + o[1], 1, 1, WH); };
  leg(6, F.bl, true); leg(10, F.fl, false);
  R(4, 12 + b, 2, 2, shirt2); R(4 + F.ba, 14 + b, 2, 3, skin2);
  R(5, 12 + b, 9, 5, shirt); R(5, 16 + b, 9, 1, shirt2); R(5, 12 + b, 1, 5, shirt2); R(6, 17 + b, 7, 1, pant);
  R(8, 13 + b, 3, 3, WH); R(9, 13 + b, 1, 3, '#e3342f'); R(8, 14 + b, 3, 1, '#e3342f');
  R(4, 4 + b, 11, 7, skin); R(5, 11 + b, 9, 1, skin); R(15, 8 + b, 1, 1, skin); R(4, 8 + b, 1, 2, skin2); R(5, 11 + b, 9, 1, skin2); R(6, 11 + b, 7, 1, skin);
  R(3, 1 + b, 11, 3, hair); R(2, 2 + b, 13, 3, hair); R(4, 0 + b, 2, 1, hair); R(7, 0 + b, 3, 1, hair); R(11, 0 + b, 2, 1, hair); R(1, 3 + b, 1, 4, hair); R(2, 5 + b, 2, 4, hair); R(15, 3 + b, 1, 2, hair);
  R(4, 5 + b, 2, 1, hair); R(7, 5 + b, 2, 1, hair); R(11, 5 + b, 1, 1, hair); R(13, 5 + b, 2, 1, hair);
  R(5, 1 + b, 2, 1, hair2); R(9, 2 + b, 2, 1, hair2); R(12, 1 + b, 1, 1, hair2); R(3, 4 + b, 1, 1, hair2); R(13, 3 + b, 1, 1, hair2);
  if(fem){ R(1, 6 + b, 3, 8, hair); R(2, 14 + b, 2, 1, hair); R(2, 8 + b, 1, 2, hair2); R(14, 5 + b, 2, 1, hair); }
  R(7, 6 + b, 2, 3, INK); R(7, 6 + b, 1, 1, WH); R(11, 6 + b, 2, 3, INK); R(11, 6 + b, 1, 1, WH);
  R(5, 9 + b, 2, 1, '#f29a8a');
  if(fem){ R(10, 10 + b, 2, 1, '#c2553f'); R(13, 9 + b, 1, 1, '#f29a8a'); } else { R(9, 10 + b, 5, 1, hair); R(10, 11 + b, 2, 1, '#8a4a35'); }
  if(F.fa === 2){ R(12, 11 + b, 2, 2, shirt2); R(13, 8 + b, 2, 3, skin); R(13, 7 + b, 2, 1, WH); } else { R(12, 12 + b, 2, 2, shirt2); R(12 + F.fa, 14 + b, 2, 3, skin); }
  const d = g.getImageData(0, 0, 20, 24), a = d.data, op = (x, y) => x >= 0 && y >= 0 && x < 20 && y < 24 && a[(y * 20 + x) * 4 + 3] > 0, add = [];
  for(let y = 0; y < 24; y++) for(let x = 0; x < 20; x++) if(!op(x, y) && (op(x - 1, y) || op(x + 1, y) || op(x, y - 1) || op(x, y + 1))) add.push([x, y]);
  g.fillStyle = INK; for(const [x, y] of add) g.fillRect(x, y, 1, 1);
  return SPR[key] = c;
}
const URLS = {};
function joURL(look, frame){ const k = look + frame; if(!URLS[k]) URLS[k] = joSprite(look, frame).toDataURL(); return URLS[k]; }
function joCanvas(look, scale, frame = 'idle'){
  const c = document.createElement('canvas'); c.width = 20 * scale; c.height = 24 * scale; c.className = 'jo';
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(joSprite(look, frame), 0, 0, 20 * scale, 24 * scale);
  return c;
}

GE.art = {clinicMap, heroWorld, cardArt, futureClinic, FUTURE_PARTS, joCanvas, joURL, icon, ICON, esc, shade};
})();
