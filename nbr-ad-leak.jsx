const { useComposition, CompositionStage, Easing, clamp, useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;
const SANS = 'Figtree, system-ui, sans-serif';
const INK = '#1A1410', RED = '#E5484D', GREEN = '#16A36A', GOLD = '#F5B819';
const lerp = (a, b, t) => a + (b - a) * t;

function useMotion(T) {
  const f = ease => (a, b) => (b <= a ? (T >= a ? 1 : 0) : ease(clamp((T - a) / (b - a), 0, 1)));
  return { enter: f(Easing.easeOutCubic), move: f(Easing.easeInOutCubic), pop: f(Easing.easeOutBack) };
}

function Arm({ left, a, color, skin, children }) {
  return (
    <div style={{ position: 'absolute', left, top: 88, width: 20, height: 62, transformOrigin: '10px 10px', transform: `rotate(${a}deg)` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: color }}></div>
      <div style={{ position: 'absolute', left: -2, top: 48, width: 24, height: 24, borderRadius: '50%', background: skin }}></div>
      {children}
    </div>
  );
}
const Wrench = () => (
  <div style={{ position: 'absolute', left: 4, top: 60, width: 12, height: 46 }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: 3, background: 'linear-gradient(90deg,#C9D0D8,#8C959F)' }}></div>
    <div style={{ position: 'absolute', left: -7, top: 38, width: 26, height: 16, borderRadius: 5, background: '#9AA3AD' }}></div>
  </div>
);
const Drink = () => (
  <div style={{ position: 'absolute', left: -6, top: 30, width: 26, height: 34, borderRadius: '4px 4px 8px 8px', background: 'linear-gradient(180deg,#FFD27A,#FF8A3D)', border: '2px solid rgba(255,255,255,0.8)' }}>
    <div style={{ position: 'absolute', left: 14, top: -18, width: 4, height: 24, background: '#E5484D', transform: 'rotate(12deg)' }}></div>
  </div>
);

function Peg({ x, y, s = 1, flip = 1, shirt, over, cap, hair, skin = '#F1C096', armL = 8, armR = -8, eyes = 1, mouth = 'smile', shades, stache, tool, bob = 0 }) {
  const e = 9 * eyes;
  return (
    <div style={{ position: 'absolute', left: x - 60, top: y - 200, width: 120, height: 200, transformOrigin: '50% 100%', transform: `translateY(${bob}px) scale(${s * flip},${s})` }}>
      <div style={{ position: 'absolute', left: 8, top: 190, width: 104, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.28)', transform: `translateY(${-bob}px)` }}></div>
      <Arm left={20} a={armL} color={shirt} skin={skin}></Arm>
      {[34, 64].map(l => (
        <div key={l} style={{ position: 'absolute', left: l, top: 148, width: 22, height: 48, borderRadius: 7, background: over || '#34425E' }}>
          <div style={{ position: 'absolute', left: -1, bottom: 0, width: 28, height: 13, borderRadius: '6px 10px 4px 4px', background: '#2A1E16' }}></div>
        </div>
      ))}
      <div style={{ position: 'absolute', left: 24, top: 78, width: 72, height: 82, borderRadius: '30px 30px 14px 14px', background: shirt, overflow: 'hidden' }}>
        {over && <div style={{ position: 'absolute', left: 12, top: 26, width: 48, height: 60, borderRadius: 6, background: over }}>
          <div style={{ position: 'absolute', left: 8, top: 8, width: 8, height: 8, borderRadius: '50%', background: GOLD }}></div>
          <div style={{ position: 'absolute', right: 8, top: 8, width: 8, height: 8, borderRadius: '50%', background: GOLD }}></div>
        </div>}
        {!over && [[14, 18], [44, 30], [24, 52], [52, 60]].map(([l, t], i) => <div key={i} style={{ position: 'absolute', left: l, top: t, width: 12, height: 12, borderRadius: '50%', background: '#FFE36E' }}></div>)}
      </div>
      <div style={{ position: 'absolute', left: 26, top: 12, width: 68, height: 68, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45) 0, rgba(255,255,255,0) 38%), ${skin}` }}></div>
      {[54, 74].map(l => <div key={l} style={{ position: 'absolute', left: l - e / 2 + 4, top: 44 - e / 2 + 4, width: e, height: e, borderRadius: '50%', background: '#1A1410', boxShadow: eyes > 1.3 ? '0 0 0 4px #FFFFFF' : 'none' }}></div>)}
      {stache && <div style={{ position: 'absolute', left: 56, top: 55, width: 30, height: 9, borderRadius: '5px 5px 9px 9px', background: '#5A3A22' }}></div>}
      {mouth === 'o'
        ? <div style={{ position: 'absolute', left: 64, top: 63, width: 14, height: 16, borderRadius: '50%', background: '#5A1E14' }}></div>
        : <div style={{ position: 'absolute', left: 62, top: 60, width: 18, height: 9, borderBottom: '3px solid #6B2E1E', borderRadius: '0 0 10px 10px' }}></div>}
      {shades && <div style={{ position: 'absolute', left: 46, top: 36, width: 46, height: 15, borderRadius: '4px 4px 8px 8px', background: '#111' }}></div>}
      {cap && <><div style={{ position: 'absolute', left: 22, top: 4, width: 76, height: 36, borderRadius: '38px 38px 6px 6px', background: cap }}></div>
        <div style={{ position: 'absolute', left: 72, top: 32, width: 38, height: 10, borderRadius: 6, background: '#A8302A' }}></div></>}
      {hair && <div style={{ position: 'absolute', left: 22, top: 2, width: 78, height: 30, borderRadius: '40px 40px 8px 20px', background: hair, transform: 'rotate(-6deg)' }}></div>}
      <Arm left={80} a={armR} color={shirt} skin={skin}>{tool === 'wrench' && <Wrench />}{tool === 'drink' && <Drink />}</Arm>
    </div>
  );
}

const Coin = ({ x, y, k = 1, size = 38 }) => (
  <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', zIndex: 5, background: 'radial-gradient(circle at 35% 30%, #FFF2B0 0, #F5B819 45%, #C98A06 100%)', border: '3px solid #B07A05', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, fontWeight: 800, color: '#8A5A00', transform: `scale(${k})`, boxShadow: '0 4px 8px rgba(0,0,0,0.35)' }}>$</div>
);

function Room({ left, top, w, h, bg, children }) {
  return (
    <div style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden', background: bg, boxShadow: 'inset 0 30px 50px -20px rgba(0,0,0,0.35), inset 0 -10px 30px -10px rgba(0,0,0,0.25)' }}>
      <div style={{ position: 'absolute', left: -left, top: -top, width: 1080, height: 1920 }}>{children}</div>
    </div>
  );
}

const CAM = (C) => [
  [C.Establish, 540, 1000, 0.88], [C.Establish + 2.3, 540, 980, 1.0],
  [C.Fix + 0.6, 610, 800, 1.9], [C.Fix + 2.4, 615, 800, 1.98],
  [C.Leak + 0.5, 360, 1000, 1.45], [C.Rival - 0.2, 350, 1010, 1.5],
  [C.Rival + 0.5, 560, 1330, 1.35], [C.Turn - 0.1, 570, 1325, 1.42],
  [C.Turn + 0.5, 420, 860, 1.7], [C.Patch - 0.1, 415, 860, 1.78],
  [C.Patch + 0.5, 330, 900, 1.5], [C.End, 330, 900, 1.56],
];
function camAt(keys, T) {
  if (T <= keys[0][0]) return keys[0].slice(1);
  for (let i = 0; i < keys.length - 1; i++) {
    const [ta, ...a] = keys[i], [tb, ...b] = keys[i + 1];
    if (T <= tb) { const p = Easing.easeInOutCubic(clamp((T - ta) / (tb - ta), 0, 1)); return a.map((v, j) => lerp(v, b[j], p)); }
  }
  return keys[keys.length - 1].slice(1);
}

function Piece({ footnote }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const F = CUES.Fix, L = CUES.Leak, R = CUES.Rival, TU = CUES.Turn, P = CUES.Patch, E = CUES.End;
  const [cx, cy, cs] = camAt(CAM(CUES), T);

  // coins that drip to the rival
  const drops = [L + 0.5, L + 1.5, L + 2.3, L + 3.0, L + 3.6, R + 0.3, R + 1.1, R + 1.9, TU + 0.35];
  const coinPos = u => ({ x: 260 + 130 * Math.min(u / 0.45, 1), y: 780 - 300 * u + 1000 * u * u });
  const landed = drops.filter(t => T >= t + 0.96).length;
  const ringWins = [...drops.map(t => [t - 0.55, t]), [P + 0.8, P + 1.3]];
  const ringing = ringWins.some(([a, b]) => T >= a && T < b);
  const buzz = ringing ? Math.sin(T * 80) * 4 : 0;

  // Tony
  const fixed = T >= F + 1.4;
  const walk = M.move(TU + 0.1, TU + 0.8);
  const shock = T >= TU + 1.0 && T < P;
  let tx = lerp(545, 470, walk), tflip = T >= TU + 0.1 ? -1 : 1, tBob = 0, tArmL = 8, tArmR = -75 + 14 * Math.sin(T * 9), tEyes = 1, tMouth = 'smile', tTool = 'wrench';
  if (fixed && T < L) { tArmR = -75; tArmL = lerp(8, 165, M.pop(F + 1.6, F + 1.9)); }
  if (T >= TU + 0.1) { tArmR = 8; tBob = walk > 0 && walk < 1 ? -Math.abs(Math.sin(T * 18)) * 10 : 0; }
  if (shock) { const k = M.pop(TU + 1.0, TU + 1.2); tEyes = 1 + 0.9 * k; tMouth = 'o'; tArmL = 150 * k; tArmR = -150 * k; tBob = -26 * Math.sin(Math.PI * clamp((T - TU - 1.0) / 0.35, 0, 1)); tTool = null; }
  if (T >= P) { tTool = null; tArmR = lerp(-150, 8, M.enter(P, P + 0.3)); tArmL = lerp(150, 8, M.enter(P, P + 0.3)); }
  if (T >= P + 2.3) { const k = M.pop(P + 2.3, P + 2.6); tArmL = 160 * k; tArmR = -160 * k; tBob = -Math.abs(Math.sin((T - P - 2.3) * 9)) * 22; }

  // Chad
  const tubK = M.pop(R + 1.5, R + 1.85);
  const hop = clamp((T - R - 1.6) / 0.45, 0, 1);
  const chadX = lerp(540, 590, hop), chadY = lerp(1550, 1575, hop) - 90 * Math.sin(Math.PI * hop);
  const truckX = lerp(1200, 850, M.enter(R + 0.6, R + 1.25));
  const truckBounce = T > R + 1.25 && T < R + 1.6 ? -Math.sin((T - R - 1.25) * 18) * 4 : 0;
  const chadBob = Math.sin(T * 7) * 3;

  // drip
  const dripOn = T < F + 1.4;
  const dp = ((T * 2.2) % 1);
  const puddle = 1 - M.enter(F + 1.4, F + 2.4);

  // patch
  const tapeK = M.pop(P + 0.3, P + 0.65);
  const bubK = M.pop(P + 1.35, P + 1.7);
  const jarU = (T - P - 2.0) / 0.5;
  const jarFill = T >= P + 2.5 ? 1 : 0;

  const captions = [
    { at: 0.3, until: F - 0.1, text: 'Tony is the best plumber in town.' },
    { at: F + 0.2, until: L - 0.1, text: 'He can fix any leak.' },
    { at: L + 0.2, until: L + 2.0, text: 'Except one.' },
    { at: L + 2.05, until: R - 0.1, text: 'Every missed call drips away…' },
    { at: R + 0.2, until: TU - 0.1, text: '…to the guy downstairs.' },
    { at: TU + 0.3, until: TU + 1.5, text: 'You fix leaks for a living.' },
    { at: TU + 1.55, until: P - 0.1, text: 'Why is your business leaking?' },
    { at: P + 0.2, until: E - 0.2, text: 'NexBizRise texts every missed caller back in seconds.' },
  ];
  const cap = captions.find(c => T >= c.at && T < c.until);
  const capK = cap ? Math.min(M.enter(cap.at, cap.at + 0.3), 1 - M.enter(cap.until - 0.2, cap.until)) : 0;

  const endK = M.enter(E - 0.25, E + 0.35);
  const logoK = M.pop(E + 0.25, E + 0.6), h1K = M.pop(E + 0.5, E + 0.95), subK = M.enter(E + 0.9, E + 1.25), btnK = M.pop(E + 1.2, E + 1.55), urlK = M.enter(E + 1.4, E + 1.7);
  const pulse = T > E + 1.6 ? 1 + 0.03 * Math.sin((T - E - 1.6) * 7) : 1;

  const tag = (x, y, t0, text, color) => {
    const u = (T - t0) / 0.9;
    if (u < 0 || u > 1) return null;
    return <div key={t0 + text} style={{ position: 'absolute', left: x, top: y - 40 * u, zIndex: 6, padding: '6px 14px', borderRadius: 16, background: '#FFFFFF', color, fontSize: 22, fontWeight: 800, whiteSpace: 'nowrap', opacity: u < 0.75 ? 1 : 1 - (u - 0.75) / 0.25, transform: `scale(${M.pop(t0, t0 + 0.2)})`, boxShadow: '0 6px 14px rgba(0,0,0,0.3)' }}>{text}</div>;
  };

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: SANS, background: 'radial-gradient(ellipse at 50% 40%, #5A463A 0%, #2A1F18 55%, #140E0A 100%)' }}>
      {[[160, 300, 220, '#FFB86B'], [900, 520, 280, '#FFD9A0'], [780, 1500, 240, '#FF9E6B'], [120, 1300, 200, '#FFE2B8']].map(([x, y, r, c], i) => (
        <div key={i} style={{ position: 'absolute', left: x - r + Math.sin(T * 0.4 + i) * 20, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${c}33 0%, ${c}00 70%)` }}></div>
      ))}

      {/* WORLD */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${540 - cx * cs}px, ${960 - cy * cs}px) scale(${cs})` }}>
        <div style={{ position: 'absolute', left: -700, top: 1680, width: 2480, height: 900, background: 'linear-gradient(180deg,#6A4428 0%,#3A2414 60%)' }}></div>
        <div style={{ position: 'absolute', left: 30, top: 1660, width: 1020, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', filter: 'blur(14px)' }}></div>
        <div style={{ position: 'absolute', left: 50, top: 1566, width: 980, height: 124, borderRadius: 12, background: 'linear-gradient(180deg,#7A5030 0%,#4E3019 100%)', boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.15)' }}>
          <div style={{ position: 'absolute', left: 350, top: 34, width: 280, height: 56, borderRadius: 6, background: 'linear-gradient(180deg,#F0D48A,#B8913E)', border: '3px solid #8A6A28', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', color: '#4A3510' }}>TONY'S PLUMBING</div>
        </div>
        <div style={{ position: 'absolute', left: 62, top: 250, width: 956, height: 200, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', background: 'repeating-linear-gradient(0deg,#B5553C 0 22px,#9E4631 22px 26px)' }}></div>
        <div style={{ position: 'absolute', left: 90, top: 430, width: 900, height: 1136, background: '#E6D6BC', borderRadius: 4 }}></div>

        <Room left={110} top={450} w={860} h={450} bg="repeating-linear-gradient(90deg,#F6E7C8 0 28px,#F0DBB4 28px 56px)">
          <div style={{ position: 'absolute', left: 430, top: 510, width: 150, height: 140, borderRadius: 6, border: '10px solid #FFFFFF', boxSizing: 'border-box', background: 'linear-gradient(180deg,#8FD0F0,#CBEBF7)' }}>
            <div style={{ position: 'absolute', left: 55, top: 0, width: 10, height: '100%', background: '#FFFFFF' }}></div>
          </div>
          <div style={{ position: 'absolute', left: 200, top: 560, width: 90, height: 70, border: '6px solid #8A5A34', background: '#F2B8A0', boxSizing: 'border-box' }}></div>
          <div style={{ position: 'absolute', left: 630, top: 700, width: 280, height: 24, borderRadius: 4, background: '#A7B2BD' }}></div>
          <div style={{ position: 'absolute', left: 760, top: 648, width: 14, height: 54, background: '#C9D0D8', borderRadius: 4 }}></div>
          <div style={{ position: 'absolute', left: 740, top: 646, width: 50, height: 12, borderRadius: 6, background: '#C9D0D8' }}></div>
          <div style={{ position: 'absolute', left: 640, top: 724, width: 260, height: 176, background: '#EDE3D2', border: '4px solid #D6C8B0', boxSizing: 'border-box' }}>
            <div style={{ position: 'absolute', left: 124, top: 12, width: 4, height: 144, background: '#D6C8B0' }}></div>
            <div style={{ position: 'absolute', left: 104, top: 74, width: 12, height: 12, borderRadius: '50%', background: '#B09A78' }}></div>
            <div style={{ position: 'absolute', left: 136, top: 74, width: 12, height: 12, borderRadius: '50%', background: '#B09A78' }}></div>
          </div>
          <div style={{ position: 'absolute', left: 596, top: 796, width: 48, height: 18, borderRadius: 4, background: 'linear-gradient(180deg,#D5DBE1,#8C959F)' }}></div>
          <div style={{ position: 'absolute', left: 604, top: 792, width: 12, height: 26, borderRadius: 3, background: '#7B848E' }}></div>
          {dripOn && <div style={{ position: 'absolute', left: 603, top: 818 + dp * dp * 80, width: 12, height: 16, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: '#5FB8F0', opacity: dp < 0.95 ? 1 : 0 }}></div>}
          <div style={{ position: 'absolute', left: 570, top: 892, width: 80, height: 14, borderRadius: '50%', background: 'rgba(95,184,240,0.6)', transform: `scale(${puddle})` }}></div>
          {fixed && T < L && <div style={{ position: 'absolute', left: 620, top: 760, fontSize: 40, color: '#FFFFFF', textShadow: '0 0 10px #FFE36E', opacity: 1 - M.enter(F + 1.9, F + 2.4), transform: `scale(${M.pop(F + 1.4, F + 1.7)}) rotate(${T * 90}deg)` }}>✦</div>}

          <div style={{ position: 'absolute', left: 110, top: 900, width: 860, height: 50, background: 'repeating-linear-gradient(90deg,#B98552 0 118px,#9C6C40 118px 122px)' }}></div>
          <div style={{ position: 'absolute', left: 130, top: 820, width: 190, height: 16, borderRadius: 4, background: '#8A5A34' }}></div>
          <div style={{ position: 'absolute', left: 142, top: 836, width: 12, height: 64, background: '#6E4526' }}></div>
          <div style={{ position: 'absolute', left: 296, top: 836, width: 12, height: 64, background: '#6E4526' }}></div>
          <div style={{ position: 'absolute', left: 150, top: 766, width: 56, height: 56, borderRadius: '8px 8px 12px 12px', background: 'rgba(210,235,245,0.55)', border: '3px solid rgba(255,255,255,0.8)', boxSizing: 'border-box', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: jarFill ? 20 : 0, background: GOLD }}></div>
          </div>
          <div style={{ position: 'absolute', left: 240, top: 760, width: 40, height: 62, borderRadius: 8, background: '#101418', transform: `translateX(${buzz}px) rotate(${buzz * 1.5}deg)`, boxShadow: ringing ? '0 0 24px 6px rgba(22,163,106,0.6)' : 'none' }}>
            <div style={{ position: 'absolute', left: 4, top: 6, width: 32, height: 50, borderRadius: 5, background: ringing ? GREEN : '#2A3038' }}></div>
          </div>
          {ringing && [0, 0.5].map(o => { const r = ((T * 2 + o) % 1); return <div key={o} style={{ position: 'absolute', left: 260 - 30 - r * 50, top: 790 - 30 - r * 50, width: 60 + r * 100, height: 60 + r * 100, borderRadius: '50%', border: '4px solid ' + GREEN, boxSizing: 'border-box', opacity: 1 - r }}></div>; })}
          {T >= L && T < R && [0, 0.7].map(o => { const r = ((T - L) * 0.9 + o) % 1.4 / 1.4; return <div key={o} style={{ position: 'absolute', left: 580 + r * 30, top: 700 - r * 90, fontSize: 38, fontWeight: 800, color: '#6B4A2A', opacity: Math.sin(Math.PI * r) }}>♪</div>; })}

          <Peg x={tx} y={900} flip={tflip} shirt="#E0443A" over="#2F5DA8" cap="#E0443A" stache armL={tArmL} armR={tArmR} eyes={tEyes} mouth={tMouth} tool={tTool} bob={tBob} />
          {T >= TU + 1.0 && T < TU + 1.6 && (() => { const u = clamp((T - TU - 1.0) / 0.5, 0, 1); return <div style={{ position: 'absolute', left: 500, top: 800 + 90 * u * u, width: 12, height: 46, borderRadius: 3, background: '#9AA3AD', transform: `rotate(${u * 300}deg)` }}></div>; })()}
          {shock && <div style={{ position: 'absolute', left: 452, top: 630, fontSize: 70, fontWeight: 800, color: RED, transform: `scale(${M.pop(TU + 1.05, TU + 1.3)})` }}>!</div>}
          {tapeK > 0 && <div style={{ position: 'absolute', left: 340, top: 890, width: 104, height: 50, zIndex: 3, borderRadius: 4, background: '#F7F2E4', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: clamp(tapeK * 2, 0, 1), transform: `rotate(-7deg) scale(${lerp(2.4, 1, tapeK)})` }}><img src="assets/nexbizrise-logo.png" style={{ height: 32 }} /></div>}
        </Room>

        <div style={{ position: 'absolute', left: 90, top: 950, width: 900, height: 80, background: 'linear-gradient(180deg,#9A8A7A,#7A6B5C)' }}></div>
        <div style={{ position: 'absolute', left: 368, top: 900, width: 44, height: 130, background: '#140E0A', clipPath: 'polygon(40% 0,62% 0,54% 20%,76% 38%,52% 58%,70% 78%,56% 100%,36% 100%,44% 78%,24% 58%,46% 38%,30% 20%)', opacity: T >= P + 0.5 ? 0.3 : 1 }}></div>
        {T >= TU + 1.1 && T < P + 0.3 && <div style={{ position: 'absolute', left: 390 - 60, top: 910 - 60, width: 120, height: 120, borderRadius: '50%', border: '5px dashed ' + RED, boxSizing: 'border-box', opacity: 0.6 + 0.4 * Math.sin(T * 10), transform: `scale(${M.pop(TU + 1.1, TU + 1.4)})` }}></div>}

        <Room left={110} top={1030} w={860} h={520} bg="linear-gradient(180deg,#4F6478 0%,#3E5062 100%)">
          <div style={{ position: 'absolute', left: 110, top: 1030, width: 860, height: 520, background: 'repeating-linear-gradient(0deg,rgba(0,0,0,0.08) 0 2px,rgba(0,0,0,0) 2px 40px)' }}></div>
          <div style={{ position: 'absolute', left: 620, top: 1110, width: 170, height: 70, borderRadius: 6, background: '#F2E8D5', border: '5px solid #C99A45', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: INK, letterSpacing: '0.06em' }}>CHAD'S PLUMBING</div>
          <div style={{ position: 'absolute', left: 110, top: 1500, width: 860, height: 50, background: '#5E4B3A' }}></div>
          <div style={{ position: 'absolute', left: 340, top: 1430, width: 100, height: 90, clipPath: 'polygon(0 0,100% 0,88% 100%,12% 100%)', background: 'linear-gradient(90deg,#8C959F,#C9D0D8 45%,#7B848E)' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 10, background: '#6B737C' }}></div>
          </div>
          {landed > 0 && <div style={{ position: 'absolute', left: 346, top: 1432 - Math.min(landed, 9) * 5, width: 88, height: 18 + Math.min(landed, 9) * 5, borderRadius: '50% 50% 0 0', background: 'radial-gradient(circle at 40% 30%, #FFF2B0, #F5B819 50%, #C98A06)' }}></div>}

          <div style={{ position: 'absolute', left: truckX - 120, top: 1400 + truckBounce, width: 240, height: 110 }}>
            <div style={{ position: 'absolute', left: 0, top: 10, width: 160, height: 80, borderRadius: 8, background: '#FFFFFF', boxShadow: 'inset 0 -6px 0 #E0E0E0' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 36, height: 12, background: RED }}></div>
              <div style={{ position: 'absolute', left: 12, top: 10, fontSize: 18, fontWeight: 800, color: INK }}>CHAD'S</div>
            </div>
            <div style={{ position: 'absolute', left: 160, top: 30, width: 76, height: 60, borderRadius: '8px 22px 8px 8px', background: '#FFFFFF' }}>
              <div style={{ position: 'absolute', left: 10, top: 8, width: 44, height: 24, borderRadius: '4px 14px 4px 4px', background: '#8FD0F0' }}></div>
            </div>
            {[34, 176].map(l => <div key={l} style={{ position: 'absolute', left: l, top: 76, width: 36, height: 36, borderRadius: '50%', background: '#1A1A1A', border: '8px solid #333', boxSizing: 'border-box' }}></div>)}
            {T > R + 1.3 && <div style={{ position: 'absolute', left: 60, top: -30, fontSize: 30, color: '#FFFFFF', transform: `scale(${M.pop(R + 1.3, R + 1.5)})` }}>✦ NEW ✦</div>}
          </div>

          <Peg x={chadX} y={chadY} flip={-1} shirt="#FF6FA8" hair="#E8B84A" shades armL={10} armR={-40 + (T % 0.8 < 0.2 ? -20 : 0)} tool="drink" bob={hop > 0 ? 0 : chadBob} />
          {tubK > 0 && <div style={{ position: 'absolute', left: 470, top: 1440, width: 250, height: 110, transformOrigin: '50% 100%', transform: `scale(${tubK})` }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 250, height: 110, borderRadius: '20px 20px 12px 12px', background: 'linear-gradient(180deg,#F4F4F4,#CFCFCF)' }}></div>
            <div style={{ position: 'absolute', left: 10, top: 6, width: 230, height: 20, borderRadius: 10, background: '#39C3D9' }}></div>
            {[30, 90, 150, 200].map((l, i) => <div key={l} style={{ position: 'absolute', left: l, top: -10 - ((T * 1.5 + i * 0.3) % 1) * 40, width: 14, height: 14, borderRadius: '50%', border: '3px solid #BFF3FB', opacity: 1 - ((T * 1.5 + i * 0.3) % 1) }}></div>)}
            <div style={{ position: 'absolute', left: 190, top: -26, width: 34, height: 30, borderRadius: '50% 50% 45% 45%', background: '#FFD23F' }}>
              <div style={{ position: 'absolute', left: -10, top: 10, width: 14, height: 8, borderRadius: 4, background: '#FF8A3D' }}></div>
              <div style={{ position: 'absolute', left: 6, top: 8, width: 5, height: 5, borderRadius: '50%', background: INK }}></div>
            </div>
          </div>}
        </Room>

        {drops.map(t0 => {
          const u = T - t0; if (u < 0) return null;
          const p = coinPos(u); if (p.y > 1418) return null;
          return <Coin key={t0} x={p.x} y={p.y} k={Math.min(1, u / 0.12)} />;
        })}
        {drops.map(t0 => tag(300, 700, t0, 'Missed call  −$285', RED))}
        {drops.map(t0 => tag(450, 1380, t0 + 0.96, '+$285', GREEN))}

        {jarU >= 0 && jarU < 1 && <Coin x={lerp(260, 178, jarU)} y={780 - 110 * Math.sin(Math.PI * jarU)} />}
        {tag(120, 700, P + 2.5, '+$285', GREEN)}
        <div style={{ position: 'absolute', left: 90, top: 560, width: 440, zIndex: 7, display: 'flex', flexDirection: 'column', gap: 6, opacity: clamp(bubK, 0, 1), transformOrigin: '30% 100%', transform: `scale(${0.6 + 0.4 * bubK})` }}>
          <div style={{ padding: '14px 18px', borderRadius: '22px 22px 22px 6px', background: '#FFFFFF', color: INK, fontSize: 24, lineHeight: 1.3, fontWeight: 600, boxShadow: '0 10px 24px rgba(0,0,0,0.3)' }}>Hi! Sorry I missed you. I'm on a job. Can I call you back in 20 min?</div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', background: GREEN, alignSelf: 'flex-start', padding: '4px 12px', borderRadius: 12 }}>Sent automatically · 5 sec</span>
        </div>
      </div>

      {/* tilt-shift */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 330, pointerEvents: 'none', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', maskImage: 'linear-gradient(180deg,#000 0%,rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(180deg,#000 0%,rgba(0,0,0,0) 100%)' }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 380, pointerEvents: 'none', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', maskImage: 'linear-gradient(0deg,#000 0%,rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(0deg,#000 0%,rgba(0,0,0,0) 100%)' }}></div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)' }}></div>

      {cap && <div style={{ position: 'absolute', left: 70, right: 70, top: 120, zIndex: 40, display: 'flex', justifyContent: 'center', opacity: capK, transform: `translateY(${(1 - capK) * 24}px)` }}>
        <span style={{ padding: '22px 36px', borderRadius: 30, background: '#FFF8EC', color: INK, fontSize: 60, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', textAlign: 'center', textWrap: 'balance', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.5)' }}>{cap.text}</span>
      </div>}

      {/* End */}
      <div style={{ position: 'absolute', left: 540 - 1200, top: 960 - 1200, width: 2400, height: 2400, borderRadius: '50%', background: '#FFC933', zIndex: 50, transform: `scale(${endK})` }}></div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 51, color: INK, pointerEvents: 'none', display: T >= E - 0.25 ? 'block' : 'none' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: clamp(logoK, 0, 1), transform: `scale(${0.7 + 0.3 * logoK})` }}>
          <img src="assets/nexbizrise-logo.png" style={{ height: 150 }} />
          <span style={{ fontSize: 62, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>NexBizRise</span>
        </div>
        <div style={{ position: 'absolute', left: 60, right: 60, top: 560, textAlign: 'center', fontSize: 190, fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.95, opacity: clamp(h1K, 0, 1), transform: `scale(${0.4 + 0.6 * h1K}) rotate(${(1 - clamp(h1K, 0, 1)) * -6}deg)` }}>Plug the leak.</div>
        <div style={{ position: 'absolute', left: 110, right: 110, top: 960, textAlign: 'center', fontSize: 46, fontWeight: 700, lineHeight: 1.3, color: '#3A3320', opacity: subK }}>Missed-call text-back for plumbers, HVAC and home services.</div>
        <div style={{ position: 'absolute', left: 190, top: 1170, width: 700, height: 116, borderRadius: 58, background: INK, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 44, fontWeight: 800, opacity: clamp(btnK, 0, 1), transform: `scale(${(0.6 + 0.4 * btnK) * pulse})` }}>Book a free demo <span>→</span></div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1325, textAlign: 'center', fontSize: 40, fontWeight: 800, opacity: urlK }}>nexbizrise.com</div>
        {footnote && <div style={{ position: 'absolute', left: 90, right: 90, bottom: 70, textAlign: 'center', fontSize: 22, lineHeight: 1.4, color: '#3A3320', opacity: urlK }}>Illustration. $285 is the average home-service job (HomeAdvisor). Results vary.</div>}
      </div>
    </div>
  );
}

function NBRLeak() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#140E0A">
        <Piece footnote={t.footnote} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Video" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
        <TweakToggle label="Footnote" value={t.footnote} onChange={v => setTweak('footnote', v)} />
      </TweaksPanel>
    </>
  );
}
window.NBRLeak = NBRLeak;
