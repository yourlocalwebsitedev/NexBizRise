const { useComposition, CompositionStage, Easing, clamp, useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;
const C = { bg: '#F4EFE7', ink: '#101820', teal: '#0B7C86', muted: '#5B6270' };
const SANS = 'Figtree, system-ui, sans-serif', SERIF = 'Newsreader, Georgia, serif';
const IMG = { re: 'campaign/5b-realestate-light.png', nurse: 'campaign/4a-nurse-modern-clean.png', cre: 'campaign/6a-creative-dark.png', green: 'campaign/7a-personal-forest-green.png' };
const SW = 620, SH = 1240, IH = Math.round(620 * 3219 / 1320), PAN = IH - SH;
const lerp = (a, b, t) => a + (b - a) * t;

function useMotion(T) {
  const f = ease => (a, b) => (b <= a ? (T >= a ? 1 : 0) : ease(clamp((T - a) / (b - a), 0, 1)));
  return { enter: f(Easing.easeOutCubic), exit: f(Easing.easeInCubic), pop: f(Easing.easeOutBack) };
}

function TextSlot({ T, M, items, style }) {
  const it = items.find(i => T >= i.at && T < i.until);
  if (!it) return null;
  const k = Math.min(M.enter(it.at, it.at + 0.45), 1 - M.exit(it.until - 0.3, it.until));
  return <div style={{ ...style, opacity: k, transform: `translateY(${(1 - k) * 28}px)` }}>{it.text}</div>;
}

function Piece({ cornerLogo }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const S = CUES.Switch, Mo = CUES.Montage, P = CUES.Proof, O = CUES.Offer;

  // Problem: paper card handed over, then dropped in the bin
  const cIn = M.enter(0.1, 0.8), cFall = M.exit(1.5, 2.3);
  const cardX = lerp(900, 0, cIn) + 30 * cFall, cardY = 820 * cFall, cardR = lerp(-10, -3, cIn) + 30 * cFall;
  const binK = M.enter(0.2, 0.7) * (1 - M.exit(S, S + 0.5));
  const binY = lerp(160, 0, M.enter(0.2, 0.7)) + 700 * M.exit(S, S + 0.5);
  const jiggle = T > 2.25 && T < 2.7 ? Math.sin((T - 2.25) * 40) * 3 * (1 - (T - 2.25) / 0.45) : 0;

  // Phone
  const off = M.enter(O, O + 0.7);
  const phoneY = lerp(1500, 0, M.enter(S + 0.1, S + 1.0)) + lerp(0, -58, off);
  const phoneS = lerp(1, 0.5, off);

  const layers = [
    { src: IMG.re, inV: S + 1.1, out: Mo + 2, pan: Mo },
    { src: IMG.nurse, in: Mo + 2, out: Mo + 4, pan: Mo + 2.25 },
    { src: IMG.cre, in: Mo + 4, out: Mo + 6, pan: Mo + 4.25 },
    { src: IMG.green, in: Mo + 6, out: P, pan: Mo + 6.25 },
    { src: IMG.re, in: P, out: 1e9, pan: null },
  ];
  const taps = [
    ...[Mo + 1.0, Mo + 3.25, Mo + 5.25, Mo + 7.25].map(t => ({ t, x: 0.5, y: 0.887, pan: PAN })),
    { t: P + 0.75, x: 0.873, y: 0.035, pan: 0 },
  ];
  const tap = taps.find(q => T >= q.t - 0.5 && T < q.t + 0.5);

  const ring = d => { const k = clamp((T - (S + d)) / 1.1, 0, 1); return { k, on: T > S + d && k < 1 }; };
  const sheet = M.enter(P + 0.95, P + 1.45) * (1 - M.exit(O - 0.1, O + 0.3));
  const saved = M.pop(P + 1.55, P + 1.95);

  const headline = [
    { at: 0.3, until: 2.95, text: 'Most visiting cards end up in the bin.' },
    { at: S + 0.2, until: Mo - 0.05, text: 'What if your card never got lost?' },
    { at: Mo + 0.1, until: Mo + 1.95, text: 'Realtors get more site visits.' },
    { at: Mo + 2.1, until: Mo + 3.95, text: 'Nurses get booked for home visits.' },
    { at: Mo + 4.1, until: Mo + 5.95, text: 'Creatives show their work.' },
    { at: Mo + 6.1, until: Mo + 7.95, text: 'Teachers fill their classes.' },
    { at: P + 0.1, until: O, text: 'Saved straight to their phone. With your photo.' },
  ];
  const sub = [
    { at: Mo + 0.3, until: P - 0.1, text: 'Call, WhatsApp, directions and bookings in one tap.' },
    { at: P + 0.4, until: O, text: 'Ready in 24 hours · Updated by our team' },
  ];

  const fan = M.pop(O + 0.35, O + 0.95);
  const logoK = M.pop(O + 0.1, O + 0.6), tagK = M.enter(O + 0.4, O + 0.8);
  const badgeK = M.pop(O + 0.85, O + 1.2), strike = M.enter(O + 1.0, O + 1.3), newP = M.pop(O + 1.3, O + 1.7);
  const btnK = M.pop(O + 1.6, O + 2.0), pulse = T > O + 2.0 ? 1 + 0.03 * Math.sin((T - O - 2.0) * 7) : 1;

  const drift = Math.sin(T * 0.35) * 60;
  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: SANS, color: C.ink, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', left: -300 + drift, top: 1100 - drift, background: 'radial-gradient(circle, rgba(11,124,134,0.12), rgba(11,124,134,0) 65%)' }}></div>
      <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', left: 560 - drift, top: -200 + drift * 0.6, background: 'radial-gradient(circle, rgba(31,95,168,0.10), rgba(31,95,168,0) 65%)' }}></div>

      {cornerLogo && (
        <div style={{ position: 'absolute', left: 64, top: 64, display: 'flex', alignItems: 'center', gap: 10, opacity: 1 - M.exit(O, O + 0.35) }}>
          <img src="assets/nexbizrise-logo.png" style={{ height: 64 }} />
          <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em' }}>NexBizRise</span>
        </div>
      )}

      <TextSlot T={T} M={M} items={headline} style={{ position: 'absolute', left: 90, right: 90, top: 180, textAlign: 'center', fontSize: 66, lineHeight: 1.12, fontWeight: 800, letterSpacing: '-0.025em', textWrap: 'balance' }} />
      <TextSlot T={T} M={M} items={sub} style={{ position: 'absolute', left: 90, right: 90, top: 1750, textAlign: 'center', fontSize: 36, lineHeight: 1.3, fontWeight: 600, color: C.muted }} />

      {/* Problem */}
      <div style={{ position: 'absolute', left: 240, top: 730, width: 600, height: 340, borderRadius: 18, background: '#FFFDF8', boxShadow: '0 30px 60px -24px rgba(16,24,32,0.35)', padding: 48, boxSizing: 'border-box', display: T < 2.6 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between', transform: `translate(${cardX}px,${cardY}px) rotate(${cardR}deg) scale(${1 - 0.2 * cFall})` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: SERIF, fontSize: 58, fontWeight: 600, lineHeight: 1 }}>Arjun Mehta</span>
          <span style={{ fontSize: 28, color: C.muted }}>Property Consultant · Mehta Realty</span>
        </div>
        <div style={{ height: 2, background: 'rgba(16,24,32,0.12)' }}></div>
        <span style={{ fontSize: 30, fontWeight: 600 }}>+91 98220 41573</span>
      </div>
      <div style={{ position: 'absolute', left: 340, top: 1400, width: 400, height: 360, opacity: binK, transform: `translateY(${binY}px) rotate(${jiggle}deg)`, transformOrigin: '50% 100%' }}>
        <div style={{ position: 'absolute', left: -20, top: -20, width: 440, height: 44, borderRadius: 14, background: '#2B3440' }}></div>
        <div style={{ position: 'absolute', inset: '24px 0 0 0', background: '#3A4452', clipPath: 'polygon(0 0,100% 0,88% 100%,12% 100%)' }}></div>
      </div>

      {/* Switch: tap rings */}
      {[0.55, 0.8].map(d => { const r = ring(d); return r.on ? <div key={d} style={{ position: 'absolute', left: 540 - 400, top: 420 - 400, width: 800, height: 800, borderRadius: '50%', border: '6px solid ' + C.teal, opacity: 0.55 * (1 - r.k), transform: `scale(${0.3 + 1.1 * r.k})` }}></div> : null; })}

      {/* Offer: fanned cards */}
      {[{ src: IMG.nurse, s: -1 }, { src: IMG.cre, s: 1 }].map(f => (
        <img key={f.src} src={f.src} style={{ position: 'absolute', left: 540 - 150, top: 1000 - 366, width: 300, height: 732, borderRadius: 34, boxShadow: '0 30px 60px -24px rgba(16,24,32,0.45)', opacity: T >= O + 0.3 ? 1 : 0, transform: `translateX(${f.s * 250 * fan}px) rotate(${f.s * 9 * fan}deg)` }} />
      ))}

      {/* Phone */}
      <div style={{ position: 'absolute', left: 212, top: 420, width: 656, height: 1276, borderRadius: 96, background: '#0B0F14', boxShadow: '0 60px 120px -40px rgba(16,24,32,0.55)', transform: `translateY(${phoneY}px) scale(${phoneS})`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', left: 18, top: 18, width: SW, height: SH, borderRadius: 80, overflow: 'hidden', background: '#0E1620' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 170, color: '#FFFFFF', gap: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 600, opacity: 0.8 }}>Tuesday, 29 September</span>
            <span style={{ fontSize: 150, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}>10:24</span>
          </div>
          {layers.map((L, i) => {
            const start = L.inV != null ? L.inV : L.in - 0.2;
            if (T < start || T > L.out + 0.3) return null;
            const x = (L.inV != null ? 0 : lerp(SW, 0, M.enter(L.in - 0.2, L.in + 0.25))) - SW * 0.3 * M.enter(L.out - 0.2, L.out + 0.25);
            const y = L.inV != null ? lerp(SH, 0, M.enter(L.inV, L.inV + 0.6)) : 0;
            const pan = L.pan == null ? 0 : PAN * M.enter(L.pan + 0.05, L.pan + 0.7);
            return (
              <div key={i} style={{ position: 'absolute', inset: 0, zIndex: i + 1, transform: `translate(${x}px,${y}px)` }}>
                <img src={L.src} style={{ position: 'absolute', left: 0, top: -pan, width: SW, height: IH }} />
                <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0.4 * M.enter(L.out - 0.2, L.out + 0.25) }}></div>
              </div>
            );
          })}
          {tap && (() => {
            const k = M.enter(tap.t - 0.5, tap.t - 0.25) * (1 - M.exit(tap.t + 0.25, tap.t + 0.5));
            const press = T < tap.t ? 1 - 0.18 * M.enter(tap.t - 0.12, tap.t) : 0.82 + 0.18 * M.enter(tap.t, tap.t + 0.15);
            const rp = clamp((T - tap.t) / 0.5, 0, 1);
            const cx = tap.x * SW, cy = tap.y * IH - tap.pan;
            return (
              <div style={{ position: 'absolute', left: cx - 48, top: cy - 48, width: 96, height: 96, zIndex: 20, opacity: k }}>
                {T > tap.t && <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '5px solid #FFFFFF', opacity: 0.8 * (1 - rp), transform: `scale(${1 + 1.4 * rp})` }}></div>}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: '4px solid ' + C.teal, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', transform: `scale(${(1.25 - 0.25 * k) * press})` }}></div>
              </div>
            );
          })()}
          <div style={{ position: 'absolute', inset: 0, zIndex: 25, background: '#000', opacity: 0.35 * sheet }}></div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 600, zIndex: 30, background: '#FFFFFF', borderRadius: '44px 44px 0 0', transform: `translateY(${(1 - sheet) * 640}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 22, gap: 14 }}>
            <div style={{ width: 90, height: 8, borderRadius: 4, background: '#D5D9DE' }}></div>
            <img src="assets/realtor.jpg" style={{ marginTop: 18, width: 170, height: 170, borderRadius: '50%', objectFit: 'cover', objectPosition: '68% 25%' }} />
            <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.02em' }}>Arjun Mehta</span>
            <span style={{ fontSize: 26, color: C.muted }}>Property Consultant · Mehta Realty</span>
            <span style={{ fontSize: 30, fontWeight: 600 }}>+91 98220 41573</span>
            <div style={{ marginTop: 10, height: 72, padding: '0 30px', borderRadius: 36, background: '#E3F4EA', color: '#11703F', display: 'flex', alignItems: 'center', gap: 12, fontSize: 30, fontWeight: 700, opacity: clamp(saved, 0, 1), transform: `scale(${0.6 + 0.4 * saved})` }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>
              Saved to contacts
            </div>
          </div>
          <div style={{ position: 'absolute', left: SW / 2 - 90, top: 22, width: 180, height: 52, borderRadius: 26, background: '#000', zIndex: 40 }}></div>
        </div>
      </div>

      {/* Offer */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: clamp(logoK, 0, 1), transform: `scale(${0.7 + 0.3 * logoK})` }}>
        <img src="assets/nexbizrise-logo.png" style={{ height: 190 }} />
        <span style={{ fontSize: 76, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>NexBizRise</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 460, textAlign: 'center', fontSize: 48, fontWeight: 700, color: C.teal, opacity: tagK, transform: `translateY(${(1 - tagK) * 24}px)` }}>Get tapped, get remembered.</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1370, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ height: 58, padding: '0 28px', borderRadius: 29, background: C.teal, color: '#FFFFFF', display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 800, letterSpacing: '0.14em', opacity: clamp(badgeK, 0, 1), transform: `scale(${0.6 + 0.4 * badgeK})` }}>LIMITED-TIME OFFER</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, opacity: T >= O + 0.85 ? 1 : 0 }}>
          <span style={{ position: 'relative', fontSize: 66, fontWeight: 700, color: C.muted }}>
            ₹999
            <span style={{ position: 'absolute', left: -6, top: '52%', height: 7, borderRadius: 4, background: '#C8372D', width: `calc(${strike * 100}% + 12px)` }}></span>
          </span>
          <span style={{ fontSize: 128, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, opacity: clamp(newP, 0, 1), transform: `scale(${0.5 + 0.5 * newP})`, display: 'inline-block' }}>₹799</span>
          <span style={{ fontSize: 40, fontWeight: 600, color: C.muted, opacity: clamp(newP, 0, 1) }}>/year</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 190, top: 1640, width: 700, height: 116, borderRadius: 58, background: C.ink, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 44, fontWeight: 800, opacity: clamp(btnK, 0, 1), transform: `scale(${(0.6 + 0.4 * btnK) * pulse})` }}>Order your card <span>→</span></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1790, textAlign: 'center', fontSize: 38, fontWeight: 700, opacity: clamp(btnK, 0, 1) }}>nexbizrise.com</div>
    </div>
  );
}

function NBRAd() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={C.bg}>
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
window.NBRAd = NBRAd;
