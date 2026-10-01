const { useComposition, CompositionStage, Easing, clamp, useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;
const SANS = 'Figtree, system-ui, sans-serif', SERIF = 'Newsreader, Georgia, serif';
const INK = '#101820', MUTED = '#5B6270';
const SW = 520, SH = 1040, IH = Math.round(520 * 3219 / 1320);
const lerp = (a, b, t) => a + (b - a) * t;
const IMG = { re: 'campaign/5b-realestate-light.png', nurse: 'campaign/4a-nurse-modern-clean.png', cre: 'campaign/6a-creative-dark.png' };
const PAPER = [
  { name: 'Arjun Mehta', role: 'Property Consultant · Mehta Realty', phone: '+91 98220 41573', stripe: '#2D6BFF' },
  { name: 'Dr. Priya Sharma', role: 'Dentist · SmileCare Clinic', phone: '+91 98450 22318', stripe: '#FF5C7A' },
  { name: 'Neha Kapoor', role: 'Hair & Makeup · Glow Studio', phone: '+91 99300 71842', stripe: '#7C4DFF' },
  { name: 'Rahul Jain', role: 'Chartered Accountant · Jain & Co.', phone: '+91 98111 40926', stripe: '#16A36A' },
  { name: 'Imran Shaikh', role: 'Interiors · Nest Design', phone: '+91 97690 55013', stripe: '#FF8A3D' },
];
const SPREAD = [[540, 1250, -4], [380, 880, -12], [720, 990, 9], [400, 1420, 7], [700, 1580, -8]];
const FROM = [[0, 0], [-700, -500], [900, -400], [-800, 300], [900, 500]];

function useMotion(T) {
  const f = ease => (a, b) => (b <= a ? (T >= a ? 1 : 0) : ease(clamp((T - a) / (b - a), 0, 1)));
  return { enter: f(Easing.easeOutCubic), exit: f(Easing.easeInCubic), pop: f(Easing.easeOutBack) };
}
const Clock = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>;
const Check = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>;

function Paper({ p, x, y, r, s, z }) {
  return (
    <div style={{ position: 'absolute', left: x - 300, top: y - 170, width: 600, height: 340, zIndex: z, borderRadius: 16, overflow: 'hidden', background: '#FFFDF8', color: INK, boxShadow: '0 30px 60px -22px rgba(16,24,32,0.45)', transform: `rotate(${r}deg) scale(${s})` }}>
      <div style={{ height: 16, background: p.stripe }}></div>
      <div style={{ padding: '34px 44px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontFamily: SERIF, fontSize: 54, fontWeight: 600, lineHeight: 1 }}>{p.name}</span>
        <span style={{ fontSize: 27, color: MUTED }}>{p.role}</span>
        <div style={{ height: 2, margin: '18px 0 8px', background: 'rgba(16,24,32,0.1)' }}></div>
        <span style={{ fontSize: 30, fontWeight: 700 }}>{p.phone}</span>
      </div>
    </div>
  );
}

function Piece({ cornerLogo }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const A = CUES.Meet, B = CUES.Pile, H = CUES.Hassle, K = CUES.Tap, P = CUES.Price;

  const wipes = [{ at: -1, c: '#2D6BFF' }, { at: B - 0.2, c: '#FF5C7A' }, { at: H - 0.2, c: '#7C4DFF' }, { at: K - 0.2, c: '#16A36A' }, { at: P - 0.2, c: '#FFC933' }];
  const captions = [
    { at: A + 0.15, until: A + 1.55, text: 'You meet a realtor.' },
    { at: A + 1.6, until: B - 0.05, text: 'He hands you his card.' },
    { at: B + 0.1, until: B + 1.5, text: 'The dentist. The salon. The CA.' },
    { at: B + 1.55, until: H - 0.05, text: 'Everyone hands you one.' },
    { at: H + 0.1, until: H + 1.3, text: 'But then what?' },
    { at: H + 1.35, until: K - 0.05, text: 'Type it all in. Hope it’s right.' },
    { at: K + 0.1, until: K + 1.5, text: 'What if you just tapped?' },
    { at: K + 1.55, until: P - 0.05, text: 'Saved. With his photo.' },
  ];
  const cap = captions.find(c => T >= c.at && T < c.until);
  const capK = cap ? Math.min(M.enter(cap.at, cap.at + 0.4), 1 - M.exit(cap.until - 0.25, cap.until)) : 0;

  // Meet
  const portK = M.pop(A + 0.2, A + 0.65) * (1 - M.exit(B, B + 0.3));
  const bubK = M.pop(A + 0.7, A + 1.05) * (1 - M.exit(B - 0.1, B + 0.2));

  // Paper cards
  const gather = M.enter(B + 2.2, B + 2.8), toCorner = M.enter(H, H + 0.6), away = M.exit(K, K + 0.6);
  const papers = PAPER.map((p, i) => {
    let x, y, r, s, vis = true;
    const [sx, sy, sr] = SPREAD[i];
    if (i === 0) {
      const k = M.enter(A + 1.3, A + 2.0);
      x = lerp(290, sx, k); y = lerp(770, sy, k); r = lerp(-20, sr, k); s = lerp(0.3, 1, k); vis = T >= A + 1.3;
    } else {
      const k = M.pop(B + 0.2 + 0.3 * (i - 1), B + 0.7 + 0.3 * (i - 1));
      x = sx + FROM[i][0] * (1 - k); y = sy + FROM[i][1] * (1 - k); r = sr + 30 * (1 - k); s = 1; vis = T >= B + 0.2 + 0.3 * (i - 1);
    }
    const pr = (i - 2) * 3;
    x = lerp(x, 540, gather); y = lerp(y, 1250, gather); r = lerp(r, pr, gather);
    x = lerp(x, 200, toCorner); y = lerp(y, 1580, toCorner); r += -8 * toCorner; s *= lerp(1, 0.5, toCorner);
    x = lerp(x, -600, away); y = lerp(y, 1800, away); r += -40 * away;
    return { p, x, y, r, s, vis: vis && T < K + 0.7, z: 10 + i };
  });

  // Phone
  const phoneRise = M.enter(H + 0.1, H + 0.8), phoneOut = M.exit(P, P + 0.5);
  const phoneX = lerp(600, 540, M.enter(K, K + 0.5));
  const phoneY = lerp(1400, 0, phoneRise) + 1700 * phoneOut;
  const typed = (s, a, b) => s.slice(0, Math.floor(s.length * clamp((T - H - a) / (b - a), 0, 1)));
  const fields = [
    { l: 'First name', v: typed('Arjun', 0.7, 1.1), a: 0.7, b: 1.1 },
    { l: 'Last name', v: typed('Mehta', 1.1, 1.5), a: 1.1, b: 1.5 },
    { l: 'Company', v: typed('Mehta Realty', 1.5, 2.0), a: 1.5, b: 2.0 },
    { l: 'Phone', v: typed('+91 98220 41573', 2.0, 3.1), a: 2.0, b: 3.1 },
  ];
  const nChars = fields.reduce((n, f) => n + f.v.length, 0);
  const caretOn = Math.floor(T * 3) % 2 === 0;
  const timerK = M.pop(H + 0.5, H + 0.85) * (1 - M.exit(K, K + 0.25));
  const secs = Math.min(59, Math.floor(clamp(T - H - 0.5, 0, 3) * 19) + 3);
  const cardUp = M.enter(K + 0.5, K + 1.0);
  const tapT = K + 1.5, tapK = M.enter(tapT - 0.35, tapT - 0.15) * (1 - M.exit(tapT + 0.2, tapT + 0.4)), rp = clamp((T - tapT) / 0.4, 0, 1);
  const sheet = M.enter(K + 1.8, K + 2.25), saved = M.pop(K + 2.3, K + 2.7);
  const ring = d => { const k = clamp((T - (K + d)) / 0.9, 0, 1); return T > K + d && k < 1 ? k : null; };

  // Price
  const logoK = M.pop(P + 0.1, P + 0.5), bigK = M.pop(P + 0.4, P + 0.8), yearK = M.enter(P + 0.7, P + 1.05), fracK = M.enter(P + 1.1, P + 1.45);
  const offK = M.pop(P + 1.5, P + 1.8), strike = M.enter(P + 1.75, P + 2.0), btnK = M.pop(P + 2.1, P + 2.45), urlK = M.enter(P + 2.3, P + 2.6);
  const pulse = T > P + 2.5 ? 1 + 0.03 * Math.sin((T - P - 2.5) * 7) : 1;
  const burst = clamp((T - (P + 0.5)) / 0.8, 0, 1);
  const DOTS = ['#2D6BFF', '#FF5C7A', '#7C4DFF', '#16A36A', '#0B7C86', '#FF8A3D', '#2D6BFF', '#FF5C7A', '#7C4DFF', '#16A36A', '#0B7C86', '#FF8A3D', '#2D6BFF', '#FF5C7A'];
  const thumbs = [[IMG.nurse, 290, -7], [IMG.re, 540, 0], [IMG.cre, 790, 7]];

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: SANS, color: '#FFFFFF' }}>
      {wipes.map((w, i) => {
        const k = i === 0 ? 1 : M.enter(w.at, w.at + 0.55);
        return k > 0 ? <div key={i} style={{ position: 'absolute', left: 540 - 1200, top: 960 - 1200, width: 2400, height: 2400, borderRadius: '50%', background: w.c, transform: `scale(${k})` }}></div> : null;
      })}

      {cornerLogo && (
        <div style={{ position: 'absolute', left: 60, top: 60, zIndex: 50, height: 84, padding: '0 26px 0 14px', borderRadius: 42, background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, opacity: 1 - M.exit(P - 0.2, P + 0.1) }}>
          <img src="assets/nexbizrise-logo.png" style={{ height: 58 }} />
          <span style={{ fontSize: 30, fontWeight: 800, color: INK, letterSpacing: '-0.02em' }}>NexBizRise</span>
        </div>
      )}
      {cap && <div style={{ position: 'absolute', left: 80, right: 80, top: 210, zIndex: 50, textAlign: 'center', fontSize: 76, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', textWrap: 'balance', opacity: capK, transform: `translateY(${(1 - capK) * 30}px)` }}>{cap.text}</div>}

      {/* Meet */}
      <div style={{ position: 'absolute', left: 140, top: 620, width: 300, height: 300, borderRadius: '50%', border: '10px solid #FFFFFF', boxSizing: 'border-box', overflow: 'hidden', boxShadow: '0 30px 60px -24px rgba(0,0,0,0.5)', opacity: clamp(portK, 0, 1), transform: `scale(${0.5 + 0.5 * portK})` }}>
        <img src="assets/realtor.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '68% 25%' }} />
      </div>
      <div style={{ position: 'absolute', left: 170, top: 940, width: 240, height: 60, borderRadius: 30, background: INK, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, opacity: clamp(portK, 0, 1) }}>Arjun · Realtor</div>
      <div style={{ position: 'absolute', left: 480, top: 650, padding: '26px 36px', borderRadius: '36px 36px 36px 8px', background: '#FFFFFF', color: INK, fontSize: 46, fontWeight: 800, opacity: clamp(bubK, 0, 1), transform: `scale(${0.5 + 0.5 * bubK})`, transformOrigin: '0% 100%' }}>Here’s my card!</div>

      {papers.map((q, i) => q.vis ? <Paper key={i} {...q} /> : null)}

      {/* Tap rings */}
      {[0.15, 0.4].map(d => { const k = ring(d); return k != null ? <div key={d} style={{ position: 'absolute', left: 540 - 380, top: 480 - 380, width: 760, height: 760, borderRadius: '50%', border: '7px solid #FFFFFF', opacity: 0.7 * (1 - k), transform: `scale(${0.3 + 1.1 * k})` }}></div> : null; })}

      {/* Phone */}
      <div style={{ position: 'absolute', left: phoneX - 278, top: 480, width: 556, height: 1076, borderRadius: 86, background: '#0B0F14', boxShadow: '0 60px 120px -40px rgba(0,0,0,0.6)', transform: `translateY(${phoneY}px)`, display: T >= H ? 'block' : 'none' }}>
        <div style={{ position: 'absolute', left: 18, top: 18, width: SW, height: SH, borderRadius: 70, overflow: 'hidden', background: '#F2F2F7', color: INK }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 90, padding: '0 34px', display: 'flex', justifyContent: 'space-between', fontSize: 28 }}>
            <span style={{ color: '#2D6BFF' }}>Cancel</span><span style={{ fontWeight: 700 }}>New contact</span><span style={{ color: '#9AA1AB' }}>Done</span>
          </div>
          <div style={{ position: 'absolute', left: SW / 2 - 70, top: 160, width: 140, height: 140, borderRadius: '50%', background: '#C7CBD1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 700 }}>?</div>
          <div style={{ position: 'absolute', left: 30, right: 30, top: 330, borderRadius: 24, background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
            {fields.map((f, i) => {
              const active = T - H >= f.a && T - H < f.b + 0.15;
              return (
                <div key={f.l} style={{ height: 76, padding: '0 26px', display: 'flex', alignItems: 'center', fontSize: 28, borderBottom: i < 3 ? '1px solid #E3E5E8' : '0' }}>
                  {f.v ? <span>{f.v}</span> : <span style={{ color: '#A7ADB5' }}>{active ? '' : f.l}</span>}
                  {active && caretOn && <span style={{ width: 3, height: 34, marginLeft: 2, background: '#2D6BFF' }}></span>}
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 360, background: '#D1D4D9', padding: '26px 10px 0', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: 'repeat(10, minmax(0,1fr))', gridAutoRows: '72px', gap: 10 }}>
            {Array.from({ length: 30 }).map((_, i) => <div key={i} style={{ borderRadius: 10, background: nChars > 0 && T - H < 3.15 && (nChars * 7) % 30 === i ? '#9AA1AB' : '#FFFFFF', boxShadow: '0 2px 0 #A9AEB6' }}></div>)}
          </div>
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - cardUp) * SH}px)`, display: T >= K + 0.5 ? 'block' : 'none' }}>
            <img src={IMG.re} style={{ position: 'absolute', left: 0, top: 0, width: SW, height: IH }} />
          </div>
          {tapK > 0 && (
            <div style={{ position: 'absolute', left: 0.873 * SW - 44, top: 0.035 * IH - 44, width: 88, height: 88, opacity: tapK }}>
              {T > tapT && <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '5px solid #16A36A', opacity: 1 - rp, transform: `scale(${1 + 1.5 * rp})` }}></div>}
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}></div>
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0.35 * sheet }}></div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 540, background: '#FFFFFF', borderRadius: '40px 40px 0 0', transform: `translateY(${(1 - sheet) * 580}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 22, gap: 12 }}>
            <div style={{ width: 80, height: 8, borderRadius: 4, background: '#D5D9DE' }}></div>
            <img src="assets/realtor.jpg" style={{ marginTop: 14, width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', objectPosition: '68% 25%' }} />
            <span style={{ fontSize: 42, fontWeight: 800 }}>Arjun Mehta</span>
            <span style={{ fontSize: 24, color: MUTED }}>Property Consultant · Mehta Realty</span>
            <span style={{ fontSize: 28, fontWeight: 600 }}>+91 98220 41573</span>
            <div style={{ marginTop: 8, height: 68, padding: '0 28px', borderRadius: 34, background: '#E3F4EA', color: '#11703F', display: 'flex', alignItems: 'center', gap: 10, fontSize: 28, fontWeight: 800, opacity: clamp(saved, 0, 1), transform: `scale(${0.6 + 0.4 * saved})` }}><Check />Saved to contacts</div>
          </div>
          <div style={{ position: 'absolute', left: SW / 2 - 80, top: 20, width: 160, height: 46, borderRadius: 23, background: '#000' }}></div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 40, top: 640, zIndex: 30, height: 92, padding: '0 30px 0 22px', borderRadius: 46, background: '#FFFFFF', color: INK, display: 'flex', alignItems: 'center', gap: 12, fontSize: 34, fontWeight: 800, boxShadow: '0 24px 50px -18px rgba(16,24,32,0.45)', opacity: clamp(timerK, 0, 1), transform: `scale(${0.5 + 0.5 * timerK})` }}>
        <span style={{ color: '#D42A3C', display: 'flex' }}><Clock /></span>{'0:' + String(secs).padStart(2, '0')}<span style={{ fontSize: 26, fontWeight: 600, color: MUTED }}>typing…</span>
      </div>

      {/* Price */}
      {thumbs.map(([src, cx, r], i) => {
        const k = M.pop(P + 0.3 + 0.12 * i, P + 0.9 + 0.12 * i);
        return T >= P + 0.3 ? <img key={src} src={src} style={{ position: 'absolute', left: cx - 115, top: 1440, width: 230, height: 561, borderRadius: 28, boxShadow: '0 30px 60px -24px rgba(16,24,32,0.5)', transform: `translateY(${(1 - k) * 600}px) rotate(${r}deg)` }} /> : null;
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: clamp(logoK, 0, 1), transform: `scale(${0.7 + 0.3 * logoK})` }}>
        <img src="assets/nexbizrise-logo.png" style={{ height: 140 }} />
        <span style={{ fontSize: 60, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: INK }}>NexBizRise</span>
      </div>
      {DOTS.map((c, i) => {
        if (burst <= 0 || burst >= 1) return null;
        const a = (i / DOTS.length) * Math.PI * 2 + 0.3, rr = 160 + 300 * Easing.easeOutCubic(burst);
        return <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(a) * rr * 1.3 - 13, top: 640 + Math.sin(a) * rr * 0.75 - 13, width: 26, height: 26, borderRadius: i % 3 === 0 ? 6 : 13, background: c, opacity: 1 - burst, transform: `rotate(${burst * 200}deg)` }}></div>;
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 500, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16, color: INK, opacity: clamp(bigK, 0, 1), transform: `scale(${0.5 + 0.5 * bigK})` }}>
        <span style={{ fontSize: 250, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>₹799</span>
        <span style={{ fontSize: 44, fontWeight: 700, opacity: 0.7 }}>+ GST</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 790, textAlign: 'center', fontSize: 66, fontWeight: 800, letterSpacing: '-0.02em', color: INK, opacity: yearK, transform: `translateY(${(1 - yearK) * 24}px)` }}>for one whole year.</div>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 890, textAlign: 'center', fontSize: 42, fontWeight: 600, color: '#3A3320', opacity: fracK, transform: `translateY(${(1 - fracK) * 20}px)` }}>A fraction of what paper cards cost.</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1010, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: clamp(offK, 0, 1), transform: `scale(${0.6 + 0.4 * offK})` }}>
        <div style={{ height: 58, padding: '0 26px', borderRadius: 29, background: INK, color: '#FFC933', display: 'flex', alignItems: 'center', fontSize: 25, fontWeight: 800, letterSpacing: '0.14em' }}>LIMITED-TIME OFFER</div>
        <span style={{ position: 'relative', fontSize: 44, fontWeight: 700, color: INK, opacity: 0.65 }}>
          was ₹999
          <span style={{ position: 'absolute', left: 88, top: '54%', height: 6, borderRadius: 3, background: '#D42A3C', width: `calc(${strike} * (100% - 82px))` }}></span>
        </span>
      </div>
      <div style={{ position: 'absolute', left: 190, top: 1130, width: 700, height: 116, borderRadius: 58, background: INK, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 44, fontWeight: 800, opacity: clamp(btnK, 0, 1), transform: `scale(${(0.6 + 0.4 * btnK) * pulse})` }}>Order your card <span>→</span></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1280, textAlign: 'center', fontSize: 40, fontWeight: 800, color: INK, opacity: urlK }}>nexbizrise.com</div>
    </div>
  );
}

function NBRStory() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#2D6BFF">
        <Piece cornerLogo={t.cornerLogo} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Video" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
        <TweakToggle label="Corner logo" value={t.cornerLogo} onChange={v => setTweak('cornerLogo', v)} />
      </TweaksPanel>
    </>
  );
}
window.NBRStory = NBRStory;
