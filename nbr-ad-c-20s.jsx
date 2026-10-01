const { useComposition, clamp } = window;
const { C, SANS, IMG, lerp, useMotion, Phone, Lock, Screen, Paper, Bg, CornerLogo, End, Text, headStyle, subStyle, makeAd } = window.NBK;

const Contact = ({ phone, title, office, flash, flashField }) => {
  const row = (label, value, f) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '18px 22px', borderRadius: 22, background: flashField === f ? `rgba(22,163,106,${0.12 + 0.18 * flash})` : '#F3F4F6', transition: 'none' }}>
      <span style={{ fontSize: 22, color: C.muted, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 32, fontWeight: 700, color: C.ink }}>{value}</span>
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '110px 34px 0', gap: 14, zIndex: 3 }}>
      <img src="assets/realtor.jpg" style={{ width: 190, height: 190, borderRadius: '50%', objectFit: 'cover', objectPosition: '68% 25%' }} />
      <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.02em', color: C.ink }}>Arjun Mehta</span>
      <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {row('Mobile', phone, 'phone')}
        {row('Title', title, 'title')}
        {row('Office', office, 'office')}
      </div>
      <div style={{ marginTop: 10, height: 64, padding: '0 26px', borderRadius: 32, background: '#E3F4EA', color: C.green, display: 'flex', alignItems: 'center', gap: 10, fontSize: 28, fontWeight: 700, opacity: flash > 0 ? 1 : 0 }}>✓ Card updated</div>
    </div>
  );
};

function Piece({ V, W, H }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const Pn = CUES.Pain, S = CUES.Switch, P = CUES.Proof, O = CUES.Offer;
  const VC = V ? { x: 540, y: 1080 } : { x: 1320, y: 600 };
  const s = V ? 1 : 0.85;

  const heads = [
    { at: 0.2, until: Pn - 0.05, text: 'New phone number?' },
    { at: Pn + 0.05, until: Pn + 1.6, text: 'Reprint 500 cards.' },
    { at: Pn + 1.7, until: Pn + 3.3, text: 'Promoted? Reprint again.' },
    { at: Pn + 3.4, until: S - 0.05, text: 'Moved office? Again.' },
    { at: S + 0.1, until: P - 0.05, text: 'With NexBizRise, just send us a message.' },
    { at: P + 0.1, until: O, text: 'Everyone who saved you sees the change.' },
  ];
  const subs = [{ at: 0.9, until: Pn - 0.05, text: '500 cards just became scrap paper.' }];

  const stackK = 1 - M.exit(S - 0.3, S + 0.1);
  const stamp0 = M.enter(0.9, 1.2);
  const rounds = [0, 1, 2].map(i => { const a = Pn + i * 1.66; return { a, out: M.move(a - 0.1, a + 0.35), inn: M.enter(a + 0.15, a + 0.55), stamp: M.enter(a + 0.85, a + 1.1) }; });
  const r = T < Pn ? -1 : Math.min(2, Math.floor((T - Pn) / 1.66));
  const cur = r < 0 ? null : rounds[r];
  const cardProps = [
    { phone: '+91 98220 41573', strikePhone: 1, role: 'Property Consultant · Mehta Realty' },
    { phone: '+91 98220 77310', role: 'Property Consultant · Mehta Realty' },
    { phone: '+91 98220 77310', role: 'Senior Consultant · Mehta Realty' },
  ];
  const cp = r < 0 ? { phone: '+91 98220 41573', role: 'Property Consultant · Mehta Realty' } : cardProps[r];
  const stampK = r < 0 ? stamp0 : cur.stamp;
  const slide = r < 0 ? 0 : lerp(W, 0, cur.inn);
  const counter = r < 0 ? 0 : r + 1;
  const bump = r < 0 ? 0 : M.pop(rounds[r].a + 0.85, rounds[r].a + 1.15);

  const pk = M.enter(S, S + 0.7) * (1 - M.exit(P - 0.1, P + 0.3));
  const phoneY = lerp(1400, 0, M.enter(S, S + 0.7));
  const m1 = M.pop(S + 0.8, S + 1.1), m2 = M.pop(S + 1.8, S + 2.1), toContact = M.enter(S + 2.8, S + 3.2);
  const flash = T > S + 3.2 ? 0.5 + 0.5 * Math.sin((T - S - 3.2) * 6) : 0;

  const bubble = (k, mine, text) => (
    <div style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '82%', padding: '18px 22px', borderRadius: mine ? '26px 26px 6px 26px' : '26px 26px 26px 6px', background: mine ? '#D9FDD3' : '#FFFFFF', color: C.ink, fontSize: 30, lineHeight: 1.35, boxShadow: '0 2px 4px rgba(0,0,0,0.08)', opacity: clamp(k, 0, 1), transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: mine ? '100% 100%' : '0 100%' }}>{text}</div>
  );

  const small = V ? [{ x: 250, y: 1160 }, { x: 540, y: 1100 }, { x: 830, y: 1160 }] : [{ x: 1080, y: 620 }, { x: 1400, y: 580 }, { x: 1720, y: 620 }];
  const pr = M.enter(P, P + 0.5) * (1 - M.exit(O - 0.1, O + 0.2));

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: SANS, color: C.ink, overflow: 'hidden' }}>
      <Bg T={T} W={W} H={H} />
      <CornerLogo V={V} k={1 - M.exit(O, O + 0.3)} />
      <Text T={T} M={M} items={heads} style={headStyle(V)} />
      <Text T={T} M={M} items={subs} style={subStyle(V)} />

      {stackK > 0 && (
        <div style={{ position: 'absolute', inset: 0, opacity: stackK }}>
          <div style={{ position: 'absolute', left: VC.x - 300 * s, top: VC.y + 170 * s - 10, width: 600 * s, transform: `translateX(${slide}px)`, zIndex: 2 }}>
            {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ height: 9 * s, marginTop: 1, borderRadius: 3, background: i % 2 ? '#F3EEE3' : '#E9E2D4', boxShadow: '0 1px 0 rgba(16,24,32,0.08)' }}></div>)}
          </div>
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${slide}px)` }}>
            <Paper x={VC.x} y={VC.y} s={s} z={4} phone={cp.phone} role={cp.role} strikePhone={cp.strikePhone ? 0 : 0} stamp={stampK} />
          </div>
          {r >= 0 && T < S && (
            <div style={{ position: 'absolute', zIndex: 30, display: 'flex', alignItems: 'center', gap: 16, padding: '18px 30px', borderRadius: 40, background: C.ink, color: '#FFFFFF', fontSize: V ? 38 : 36, fontWeight: 800, transform: `scale(${1 + 0.12 * Math.sin(Math.PI * clamp(bump, 0, 1))})`, ...(V ? { left: 0, right: 0, margin: '0 auto', width: 'fit-content', top: 1560 } : { left: 120, top: 640 }) }}>
              Reprints this year: <span style={{ color: '#FF8A7A', fontVariantNumeric: 'tabular-nums' }}>{counter}</span>
            </div>
          )}
        </div>
      )}

      {pk > 0 && (
        <Phone cx={V ? 540 : 1320} cy={V ? 1060 : 560} s={V ? 0.92 : 0.72} y={phoneY}>
          <div style={{ position: 'absolute', inset: 0, background: '#EFE7DE', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 180, background: '#075E54', color: '#FFFFFF', display: 'flex', alignItems: 'flex-end', gap: 18, padding: '0 28px 24px' }}>
              <img src="assets/nexbizrise-logo.png" style={{ width: 70, height: 70, borderRadius: '50%', background: '#FFFFFF', objectFit: 'contain' }} />
              <span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 32, fontWeight: 700 }}>NexBizRise Support</span><span style={{ fontSize: 22, opacity: 0.8 }}>online</span></span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 16, padding: '0 24px 60px' }}>
              {bubble(m1, true, 'Hi! My new number is +91 98220 77310')}
              {bubble(m2, false, 'Done ✓ Your card now shows the new number.')}
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, zIndex: 3, transform: `translateX(${lerp(620, 0, toContact)}px)` }}>
            <Contact phone="+91 98220 77310" title="Property Consultant" office="Baner, Pune" flash={flash} flashField="phone" />
          </div>
        </Phone>
      )}

      {pr > 0 && small.map((p, i) => (
        <div key={i} style={{ opacity: pr }}>
          <Phone cx={p.x} cy={p.y} s={V ? 0.4 : 0.42} rot={(i - 1) * 6} y={lerp(300, 0, M.enter(P + i * 0.15, P + 0.5 + i * 0.15))}>
            <Contact phone="+91 98220 77310" title="Property Consultant" office="Baner, Pune" flash={T > P + 0.8 + i * 0.3 ? 1 : 0} flashField="phone" />
          </Phone>
        </div>
      ))}
      {pr > 0 && ['Priya’s phone', 'Rahul’s phone', 'Mr. Shah’s phone'].map((n, i) => (
        <div key={n} style={{ position: 'absolute', left: small[i].x - 150, width: 300, top: small[i].y + (V ? 300 : 310), textAlign: 'center', fontSize: 28, fontWeight: 700, color: C.muted, opacity: pr * M.enter(P + 0.6 + i * 0.15, P + 1 + i * 0.15), zIndex: 30 }}>{n}</div>
      ))}

      <End T={T} M={M} at={O} V={V} W={W} H={H} tagline="Change anything. Never reprint again." />
    </div>
  );
}
window.NBRAdC = makeAd(Piece);
