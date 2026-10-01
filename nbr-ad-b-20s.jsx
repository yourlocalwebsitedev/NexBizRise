const { useComposition, clamp } = window;
const { C, SANS, IMG, SW, IH, PAN, lerp, useMotion, Phone, Lock, Screen, Sheet, Paper, Bg, CornerLogo, End, Rings, Tap, Text, headStyle, subStyle, makeAd } = window.NBK;

function Piece({ V, W, H }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const J = CUES.Journey, S = CUES.Switch, P = CUES.Proof, O = CUES.Offer;
  const VC = V ? { x: 540, y: 1080 } : { x: 1320, y: 600 };
  const vs = V ? 1 : 0.82;

  const heads = [
    { at: 0.2, until: 1.95, text: 'You handed out 200 visiting cards last month.' },
    { at: J + 0.05, until: J + 1.95, text: 'Day 1: jeans pocket.' },
    { at: J + 2.05, until: J + 3.95, text: 'Day 3: washing machine.' },
    { at: J + 4.05, until: J + 5.95, text: 'Day 5: tea coaster.' },
    { at: J + 6.05, until: S - 0.05, text: 'Day 7: bin.' },
    { at: S + 0.1, until: P - 0.05, text: 'A NexBizRise card goes somewhere better.' },
    { at: P + 0.1, until: O, text: 'Into their contacts. And forwarded to friends.' },
  ];
  const subs = [
    { at: 0.7, until: 1.95, text: "Let's see where they went." },
    { at: S + 0.5, until: P - 0.05, text: 'Tap once. Saved with your photo.' },
  ];

  const vign = i => { const a = J + i * 2; return { k: M.enter(a - 0.05, a + 0.35) * (1 - M.exit(a + 1.75, a + 2.05)), a, x: lerp(W * 0.6, 0, M.enter(a - 0.05, a + 0.35)) - lerp(0, W * 0.6, M.exit(a + 1.75, a + 2.05)) }; };

  // hook stack
  const hk = 1 - M.exit(J - 0.25, J + 0.1);
  const fanK = M.enter(0.3, 1.2);

  // pocket
  const v1 = vign(0), cardDrop = M.move(v1.a + 0.4, v1.a + 1.2);
  // washer
  const v2 = vign(1);
  // coaster
  const v3 = vign(2), cupDown = M.enter(v3.a + 0.3, v3.a + 0.7), cupUp = M.enter(v3.a + 1.1, v3.a + 1.5), stain = M.enter(v3.a + 1.1, v3.a + 1.3);
  // bin
  const v4 = vign(3), fall = M.exit(v4.a + 0.4, v4.a + 1.1);
  const jig = T > v4.a + 1.1 && T < v4.a + 1.6 ? Math.sin((T - v4.a - 1.1) * 40) * 3 * (1 - (T - v4.a - 1.1) / 0.5) : 0;

  // phone
  const pk = M.enter(S, S + 0.8) * (1 - M.exit(O - 0.1, O + 0.2));
  const phoneY = lerp(1400, 0, M.enter(S, S + 0.8));
  const sheet = M.enter(S + 1.2, S + 1.6) * (1 - M.exit(P, P + 0.35));
  const saved = M.pop(S + 1.7, S + 2.0);
  const cardUp = M.enter(S + 0.9, S + 1.3);
  const pan = PAN * M.enter(P + 0.4, P + 1.1);
  const chips = ['Forwarded to Priya', 'Forwarded to Rahul', 'Forwarded to Mom'];

  const vig = (v, children) => v.k > 0 && <div style={{ position: 'absolute', left: VC.x - 400, top: VC.y - 400, width: 800, height: 800, opacity: v.k, transform: `translateX(${v.x}px) scale(${vs})`, zIndex: 5 }}>{children}</div>;

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: SANS, color: C.ink, overflow: 'hidden' }}>
      <Bg T={T} W={W} H={H} />
      <CornerLogo V={V} k={1 - M.exit(O, O + 0.3)} />
      <Text T={T} M={M} items={heads} style={headStyle(V)} />
      <Text T={T} M={M} items={subs} style={subStyle(V)} />

      {hk > 0 && [0, 1, 2, 3, 4].map(i => <Paper key={i} x={VC.x + (i - 2) * 70 * fanK} y={VC.y + Math.abs(i - 2) * 20 * fanK} rot={(i - 2) * 9 * fanK} s={0.9 * vs} z={3 + i} style={{ opacity: hk }} />)}

      {vig(v1, <>
        <div style={{ position: 'absolute', left: 140, top: 150, width: 520, height: 600, borderRadius: '30px 30px 80px 80px', background: 'linear-gradient(160deg,#4C6A93,#2E4868)', boxShadow: 'inset 0 0 0 6px rgba(255,255,255,0.08)' }}></div>
        <Paper x={400} y={lerp(120, 470, cardDrop)} rot={-6} s={0.75} z={1} />
        <div style={{ position: 'absolute', left: 140, top: 400, width: 520, height: 350, borderRadius: '0 0 80px 80px', background: 'linear-gradient(160deg,#557399,#344F72)', zIndex: 2, borderTop: '6px dashed #E0B45A' }}></div>
      </>)}

      {vig(v2, <>
        <div style={{ position: 'absolute', left: 110, top: 80, width: 580, height: 660, borderRadius: 40, background: '#F2F4F6', boxShadow: '0 30px 60px -24px rgba(16,24,32,0.35)' }}>
          <div style={{ position: 'absolute', left: 30, top: 30, width: 520, height: 70, borderRadius: 16, background: '#E1E5EA' }}></div>
          <div style={{ position: 'absolute', left: 90, top: 150, width: 400, height: 400, borderRadius: '50%', background: '#C9D0D8', padding: 24, boxSizing: 'border-box' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'radial-gradient(circle at 40% 35%,#9CC8EC,#3F6E9C)' }}>
              <Paper x={176} y={176} rot={(T - v2.a) * 420} s={0.42} z={1} />
              {[0, 1, 2, 3, 4, 5].map(b => <div key={b} style={{ position: 'absolute', left: 40 + b * 50, top: 300 - ((T * 60 + b * 40) % 280), width: 22, height: 22, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.7)', zIndex: 2 }}></div>)}
            </div>
          </div>
        </div>
      </>)}

      {vig(v3, <>
        <div style={{ position: 'absolute', left: 40, top: 120, width: 720, height: 560, borderRadius: 30, background: 'linear-gradient(160deg,#9A6B45,#7A5033)' }}></div>
        <Paper x={400} y={400} rot={-4} s={0.95} z={2} stain={stain} />
        <div style={{ position: 'absolute', left: 530, top: 180, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle,#6B3F1E 0 55%,#FFFFFF 56% 70%,#E8E1D6 71%)', boxShadow: '0 30px 40px rgba(0,0,0,0.35)', zIndex: 3, opacity: cupDown * (1 - cupUp), transform: `translateY(${lerp(-300, 0, cupDown) - 300 * cupUp}px) scale(${lerp(1.3, 1, cupDown)})` }}></div>
      </>)}

      {vig(v4, <>
        <Paper x={400} y={lerp(140, 560, fall)} rot={lerp(-4, 26, fall)} s={lerp(0.8, 0.6, fall)} z={1} style={{ opacity: T < v4.a + 1.1 ? 1 : 0 }} />
        <div style={{ position: 'absolute', left: 200, top: 440, width: 400, height: 340, transform: `rotate(${jig}deg)`, transformOrigin: '50% 100%', zIndex: 2 }}>
          <div style={{ position: 'absolute', left: -20, top: -20, width: 440, height: 44, borderRadius: 14, background: '#2B3440' }}></div>
          <div style={{ position: 'absolute', inset: '24px 0 0 0', background: '#3A4452', clipPath: 'polygon(0 0,100% 0,88% 100%,12% 100%)' }}></div>
        </div>
      </>)}

      {pk > 0 && <Rings T={T} t={S + 0.6} cx={V ? 540 : 1320} cy={V ? 700 : 400} r={V ? 400 : 300} />}
      {pk > 0 && (
        <Phone cx={V ? 540 : 1320} cy={V ? 1060 : 560} s={V ? 0.92 : 0.72} y={phoneY}>
          <Lock />
          <Screen src={IMG.re} y={lerp(1240, 0, cardUp)} pan={pan} z={2} />
          <Sheet k={sheet} saved={saved} />
          <Tap T={T} M={M} t={P + 1.5} x={SW * 0.5} y={IH * 0.887 - PAN} />
        </Phone>
      )}
      {chips.map((c, i) => {
        const a = P + 1.9 + i * 0.45, k = M.pop(a, a + 0.35) * (1 - M.exit(O - 0.1, O + 0.2));
        if (T < a) return null;
        const pos = V ? [{ x: 90, y: 560 }, { x: 600, y: 760 }, { x: 110, y: 1320 }][i] : [{ x: 120, y: 700 }, { x: 1640, y: 300 }, { x: 1600, y: 760 }][i];
        return <div key={c} style={{ position: 'absolute', left: pos.x, top: pos.y, zIndex: 30, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', borderRadius: 40, background: '#FFFFFF', boxShadow: '0 18px 40px -16px rgba(16,24,32,0.35)', fontSize: 32, fontWeight: 700, opacity: clamp(k, 0, 1), transform: `scale(${0.6 + 0.4 * k})` }}><span style={{ width: 38, height: 38, borderRadius: '50%', background: '#25D366', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>↗</span>{c}</div>;
      })}

      <End T={T} M={M} at={O} V={V} W={W} H={H} tagline="Paper cards get lost. Contacts don't." />
    </div>
  );
}
window.NBRAdB = makeAd(Piece);
