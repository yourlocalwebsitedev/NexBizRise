const { useComposition, clamp } = window;
const { C, SANS, IMG, SW, lerp, useMotion, Phone, Lock, Screen, Sheet, Paper, Bg, CornerLogo, End, Rings, makeAd } = window.NBK;

function Piece({ V, W, H }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const R = CUES.Race, O = CUES.Offer;
  const t0 = R + 0.4;
  const split = M.enter(R, R + 0.45) * (1 - M.exit(O - 0.1, O + 0.2));
  const A = V ? { cx: 540, cy: 640, lx: 540, ly: 300 } : { cx: 480, cy: 610, lx: 480, ly: 150 };
  const B = V ? { cx: 540, cy: 1480, lx: 540, ly: 1020 } : { cx: 1440, cy: 620, lx: 1440, ly: 150 };
  const paperT = clamp(T - t0, 0, 3.4), digT = clamp(T - t0, 0, 1.6);
  const lost = T > t0 + 3;
  const shake = lost ? Math.sin(T * 50) * 6 * Math.max(0, 1 - (T - t0 - 3) * 1.5) : 0;

  const hookK = 1 - M.exit(R - 0.2, R + 0.1);
  const hook1 = M.enter(0.1, 0.5), hook2 = M.pop(0.9, 1.3);
  const bigTimer = (3 - clamp((T - 0.9) * 1.8, 0, 0.9)).toFixed(1);

  const cardIn = M.enter(t0 + 0.55, t0 + 0.95);
  const sheet = M.enter(t0 + 1.05, t0 + 1.4), saved = M.pop(t0 + 1.45, t0 + 1.75);
  const phoneY = lerp(700, 0, M.enter(R + 0.1, R + 0.5));

  const label = (p, title, time, good, done) => (
    <div style={{ position: 'absolute', left: p.lx - 360, top: p.ly, width: 720, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, zIndex: 30, opacity: split, transform: `translateY(${(1 - split) * 20}px)` }}>
      <span style={{ fontSize: V ? 40 : 44, fontWeight: 800, letterSpacing: '-0.02em' }}>{title}</span>
      <span style={{ minWidth: 150, padding: '8px 18px', borderRadius: 24, background: done ? (good ? '#E3F4EA' : '#FBE3E1') : '#FFFFFF', color: done ? (good ? C.green : C.red) : C.ink, fontSize: V ? 38 : 42, fontWeight: 800, fontVariantNumeric: 'tabular-nums', textAlign: 'center', boxShadow: '0 8px 20px -10px rgba(16,24,32,0.3)', transform: `translateX(${good ? 0 : shake}px)` }}>{time}</span>
    </div>
  );

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: SANS, color: C.ink, overflow: 'hidden' }}>
      <Bg T={T} W={W} H={H} />
      <CornerLogo V={V} k={1 - M.exit(O, O + 0.3)} />

      {hookK > 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, opacity: hookK, zIndex: 20, padding: '0 90px', textAlign: 'center' }}>
          <span style={{ fontSize: V ? 70 : 76, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, textWrap: 'balance', opacity: hook1, transform: `translateY(${(1 - hook1) * 26}px)` }}>A client asks for your number.</span>
          <span style={{ fontSize: V ? 300 : 280, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.9, color: C.red, fontVariantNumeric: 'tabular-nums', opacity: clamp(hook2, 0, 1), transform: `scale(${0.5 + 0.5 * hook2})` }}>{bigTimer}s</span>
          <span style={{ fontSize: V ? 52 : 56, fontWeight: 700, color: C.muted, opacity: clamp(hook2, 0, 1) }}>Go.</span>
        </div>
      )}

      {split > 0 && <div style={{ position: 'absolute', zIndex: 2, background: 'rgba(16,24,32,0.12)', opacity: split, ...(V ? { left: 80, right: 80, top: 958, height: 4 } : { top: 110, bottom: 110, left: 958, width: 4 }) }}></div>}
      {split > 0 && label(A, 'Paper card', paperT >= 3 ? 'Still looking…' : paperT.toFixed(1) + 's', false, lost)}
      {split > 0 && label(B, 'NexBizRise card', digT.toFixed(1) + 's', true, digT >= 1.6)}

      {split > 0 && [0, 1, 2, 3, 4, 5, 6].map(i => {
        const j = T > t0 && !lost ? 1 : 0.25;
        const x = A.cx + Math.sin(i * 2.3) * 120 + Math.sin(T * 9 + i * 1.7) * 26 * j;
        const y = A.cy + 60 + Math.cos(i * 1.9) * 70 + Math.cos(T * 8 + i) * 18 * j;
        const names = [['Ravi Kumar', 'Sales · Sunrise Motors'], ['Meena Iyer', 'Dentist · SmileCare'], ['Arjun Mehta', 'Property Consultant · Mehta Realty'], ['Imran Shaikh', 'CA · Shaikh & Co'], ['Neha Gupta', 'Interiors · Nest Studio'], ['Vikram Rao', 'Insurance Advisor'], ['Pooja Nair', 'Travel Agent · GoEasy']][i];
        return <Paper key={i} name={names[0]} role={names[1]} phone={'+91 9' + (8123456 + i * 11111)} x={x} y={y} s={V ? 0.62 : 0.66} rot={Math.sin(i * 3.1) * 18 + Math.sin(T * 7 + i) * 6 * j} z={3 + i} style={{ opacity: split }} />;
      })}
      {lost && split > 0 && <div style={{ position: 'absolute', left: A.cx - 260, top: A.cy + (V ? 250 : 300), width: 520, textAlign: 'center', fontSize: V ? 40 : 44, fontWeight: 800, color: C.red, zIndex: 30, opacity: split * M.pop(t0 + 3, t0 + 3.3) }}>Client already left.</div>}

      {split > 0 && <Rings T={T} t={t0 + 0.2} cx={B.cx} cy={B.cy - 120} r={260} />}
      {split > 0 && (
        <div style={{ opacity: split }}>
          <Phone cx={B.cx} cy={B.cy + (V ? 40 : 60)} s={0.46} y={phoneY}>
            <Lock />
            <Screen src={IMG.re} y={lerp(1240, 0, cardIn)} z={2} />
            <Sheet k={sheet} saved={saved} />
          </Phone>
        </div>
      )}

      <End T={T} M={M} at={O} V={V} W={W} H={H} tagline="One tap. Saved in under 2 seconds." />
    </div>
  );
}
window.NBRAdA = makeAd(Piece);
