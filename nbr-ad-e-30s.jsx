const { useComposition, clamp } = window;
const { C, SANS, IMG, PAN, lerp, useMotion, Phone, Screen, Paper, Bg, CornerLogo, End, Text, makeAd } = window.NBK;

const ROUNDS = [
  { key: 'R1', label: 'Round 1 · Nurse', img: IMG.nurse, name: 'Meera Nair', role: 'Staff Nurse · Home Care', feats: ['Her photo, so you remember her', 'Book a home visit in one tap', 'WhatsApp and call buttons'] },
  { key: 'R2', label: 'Round 2 · Photographer', img: IMG.cre, name: 'Kabir Rao', role: 'Photographer · Kabir Rao Studio', feats: ['His portfolio right on the card', 'Instagram and YouTube links', 'Enquire on WhatsApp'] },
  { key: 'R3', label: 'Round 3 · Realtor', img: IMG.re, name: 'Arjun Mehta', role: 'Property Consultant · Mehta Realty', feats: ['Listings with photos', 'Directions to the office', 'Saved to contacts with his photo'] },
];

function Piece({ V, W, H }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const O = CUES.Offer;
  const L = V
    ? { paper: { x: 290, y: 1000, s: 0.74 }, phone: { x: 800, y: 1000, s: 0.54 }, cd: { x: 540, y: 520 }, feat: { left: 90, right: 90, top: 1440 }, tagA: { x: 290, y: 800 }, tagB: { x: 800, y: 610 } }
    : { paper: { x: 500, y: 600, s: 0.82 }, phone: { x: 1180, y: 590, s: 0.6 }, cd: { x: 850, y: 600 }, feat: { left: 1440, width: 420, top: 360 }, tagA: { x: 500, y: 400 }, tagB: { x: 1180, y: 170 } };
  const head = V
    ? { position: 'absolute', left: 80, right: 80, top: 170, textAlign: 'center', fontSize: 66, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.03em', textWrap: 'balance', zIndex: 20 }
    : { position: 'absolute', left: 200, right: 200, top: 60, textAlign: 'center', fontSize: 62, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.03em', textWrap: 'balance', zIndex: 20 };

  const heads = [
    { at: 0.2, until: CUES.R1 - 0.05, text: 'Quick test. Which card would you save?' },
    ...ROUNDS.flatMap(r => { const a = CUES[r.key]; return [
      { at: a + 0.1, until: a + 3.0, text: r.label },
      { at: a + 3.05, until: a + 6.8, text: 'B. Every time.' },
    ]; }),
  ];

  const hookK = M.pop(0.6, 1.0) * (1 - M.exit(CUES.R1 - 0.2, CUES.R1));
  const cur = ROUNDS.find(r => T >= CUES[r.key] && T < CUES[r.key] + 7);
  const a = cur ? CUES[cur.key] : 0;
  const inK = cur ? M.enter(a, a + 0.5) * (1 - M.exit(a + 6.5, a + 6.95)) : 0;
  const reveal = cur ? M.enter(a + 3.0, a + 3.4) : 0;
  const cdN = cur && T >= a + 0.6 && T < a + 3.0 ? 3 - Math.floor((T - a - 0.6) / 0.8) : null;
  const cdK = cdN ? M.pop(a + 0.6 + (3 - cdN) * 0.8, a + 0.6 + (3 - cdN) * 0.8 + 0.25) : 0;
  const pan = cur ? PAN * 0.55 * M.move(a + 3.4, a + 5.6) : 0;
  const done = ROUNDS.filter(r => T >= CUES[r.key] + 3.2).length;

  const tag = (p, letter, win) => (
    <div style={{ position: 'absolute', left: p.x - 44, top: p.y - 44, width: 88, height: 88, borderRadius: '50%', zIndex: 25, background: win && reveal > 0 ? C.teal : C.ink, color: '#FFFFFF', fontSize: 46, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: inK, transform: `scale(${win ? 1 + 0.2 * Math.sin(Math.PI * reveal) : 1 - 0.15 * reveal})` }}>{letter}</div>
  );

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: SANS, color: C.ink, overflow: 'hidden' }}>
      <Bg T={T} W={W} H={H} />
      <CornerLogo V={V} k={1 - M.exit(O, O + 0.3)} />
      <Text T={T} M={M} items={heads} style={head} />

      {hookK > 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: V ? 60 : 120, opacity: clamp(hookK, 0, 1), zIndex: 10 }}>
          {['A', 'B'].map((l, i) => <div key={l} style={{ width: V ? 300 : 280, height: V ? 300 : 280, borderRadius: 60, background: i ? C.teal : C.ink, color: '#FFF', fontSize: 170, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${(i ? 6 : -6) + Math.sin(T * 5 + i) * 3}deg) scale(${hookK})` }}>{l}</div>)}
        </div>
      )}

      {cur && inK > 0 && (
        <>
          <Paper name={cur.name} role={cur.role} phone="+91 98220 41573" x={L.paper.x - (1 - inK) * 600} y={L.paper.y} s={L.paper.s} rot={-4} z={6} style={{ opacity: inK * (1 - 0.55 * reveal), filter: `grayscale(${reveal})` }} />
          <div style={{ opacity: inK }}>
            <Phone cx={L.phone.x + (1 - inK) * 700} cy={L.phone.y} s={L.phone.s * (1 + 0.06 * reveal)} glow={reveal > 0.5}>
              <Screen src={cur.img} pan={pan} />
            </Phone>
          </div>
          {tag(L.tagA, 'A', false)}
          {tag(L.tagB, 'B', true)}
          {reveal > 0 && <div style={{ position: 'absolute', left: L.paper.x - 70, top: L.paper.y - 70, width: 140, height: 140, zIndex: 26, color: C.red, fontSize: 150, fontWeight: 800, lineHeight: '140px', textAlign: 'center', opacity: inK * reveal, transform: `scale(${0.5 + 0.5 * reveal})` }}>✕</div>}
          {cdN && <div style={{ position: 'absolute', left: L.cd.x - 120, top: L.cd.y - 120, width: 240, height: 240, borderRadius: '50%', zIndex: 30, background: '#FFFFFF', boxShadow: '0 20px 50px -20px rgba(16,24,32,0.4)', fontSize: 150, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: clamp(cdK, 0, 1), transform: `scale(${0.6 + 0.4 * cdK})`, fontVariantNumeric: 'tabular-nums' }}>{cdN}</div>}
          <div style={{ position: 'absolute', zIndex: 30, display: 'flex', flexDirection: 'column', gap: 16, ...L.feat }}>
            {cur.feats.map((f, i) => { const k = M.pop(a + 3.5 + i * 0.55, a + 3.85 + i * 0.55) * (1 - M.exit(a + 6.5, a + 6.95)); return (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px', borderRadius: 22, background: '#FFFFFF', boxShadow: '0 14px 30px -18px rgba(16,24,32,0.35)', fontSize: V ? 34 : 30, fontWeight: 700, opacity: clamp(k, 0, 1), transform: `translateX(${(1 - clamp(k, 0, 1)) * 40}px)` }}>
                <span style={{ width: 42, height: 42, flex: 'none', borderRadius: '50%', background: '#E3F4EA', color: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✓</span>{f}
              </div>); })}
          </div>
        </>
      )}

      {T >= CUES.R1 && T < O + 0.2 && (
        <div style={{ position: 'absolute', zIndex: 35, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 30, background: C.ink, color: '#FFFFFF', fontSize: 28, fontWeight: 800, fontVariantNumeric: 'tabular-nums', ...(V ? { right: 64, top: 74 } : { right: 72, top: 64 }) }}>
          Paper <span style={{ color: '#FF8A7A' }}>0</span> · <span style={{ color: '#6FE3C8' }}>{done}</span> NexBizRise
        </div>
      )}

      <End T={T} M={M} at={O} V={V} W={W} H={H} tagline="Be the card people choose to save." />
    </div>
  );
}
window.NBRAdE = makeAd(Piece);
