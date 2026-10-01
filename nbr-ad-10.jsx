const { useComposition, CompositionStage, Easing, clamp, useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;
const SANS = 'Figtree, system-ui, sans-serif';
const INK = '#101820';
const SW = 520, SH = 1040, IH = Math.round(520 * 3219 / 1320), PAN = IH - SH;
const lerp = (a, b, t) => a + (b - a) * t;
const ICON = {
  cal: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  insta: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01',
  play: 'M8 5l11 7-11 7z',
};
const CARDS = [
  { src: 'campaign/5b-realestate-light.png', bg: '#2D6BFF', word: 'REALTOR', line: 'Realtors get more site visits.', chips: [['cal', 'Book a site visit'], ['pin', 'Directions']] },
  { src: 'campaign/4a-nurse-modern-clean.png', bg: '#FF5C7A', word: 'NURSE', line: 'Nurses get booked for home visits.', chips: [['phone', 'Call now'], ['chat', 'WhatsApp']] },
  { src: 'campaign/6a-creative-dark.png', bg: '#7C4DFF', word: 'CREATIVE', line: 'Creatives show their work.', chips: [['grid', 'Portfolio'], ['insta', 'Instagram']] },
  { src: 'campaign/7a-personal-forest-green.png', bg: '#16A36A', word: 'DANCER', line: 'Teachers fill their classes.', chips: [['cal', 'Book a class'], ['play', 'YouTube']] },
];

function useMotion(T) {
  const f = ease => (a, b) => (b <= a ? (T >= a ? 1 : 0) : ease(clamp((T - a) / (b - a), 0, 1)));
  return { enter: f(Easing.easeOutCubic), exit: f(Easing.easeInCubic), pop: f(Easing.easeOutBack) };
}
const Icon = ({ d, size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={d}></path></svg>
);

function Chip({ icon, label, color, k, style, bob }) {
  return (
    <div style={{ position: 'absolute', height: 96, padding: '0 34px 0 14px', borderRadius: 48, background: '#FFFFFF', boxShadow: '0 24px 50px -18px rgba(16,24,32,0.45)', display: 'flex', alignItems: 'center', gap: 18, fontSize: 34, fontWeight: 800, color: INK, whiteSpace: 'nowrap', opacity: clamp(k, 0, 1), transform: `translateY(${bob}px) scale(${0.4 + 0.6 * k})`, ...style }}>
      <div style={{ width: 68, height: 68, borderRadius: 34, background: color, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={ICON[icon]} /></div>
      {label}
    </div>
  );
}

function Piece({ cornerLogo }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const K = CUES.Cards, O = CUES.Offer;
  const starts = CARDS.map((_, i) => K + 1.5 * i);

  const wipes = [{ at: -1, c: '#0B7C86' }, ...CARDS.map((c, i) => ({ at: starts[i] - 0.25, c: c.bg })), { at: O - 0.25, c: '#FFC933' }];
  const cur = CARDS.findIndex((_, i) => T >= starts[i] && T < starts[i] + 1.5);

  const off = M.enter(O - 0.1, O + 0.6);
  const rise = M.enter(0.55, 1.35);
  const phoneY = lerp(1400, 0, rise) + lerp(0, -108, off);
  const phoneS = lerp(1, 0.55, off);
  const swing = starts.reduce((a, s) => a + (T >= s - 0.25 && T < s + 0.5 ? -5 * (1 - M.pop(s - 0.25, s + 0.5)) : 0), 0);
  const phoneR = lerp(-14, 0, rise) + swing;

  const tapK = M.pop(0.05, 0.45), tapOut = M.enter(0.95, 1.45);
  const logoK = M.pop(O + 0.1, O + 0.55), tagK = M.enter(O + 0.3, O + 0.7);
  const badgeK = M.pop(O + 0.65, O + 0.95), strike = M.enter(O + 0.8, O + 1.05), newP = M.pop(O + 1.05, O + 1.4);
  const btnK = M.pop(O + 1.35, O + 1.7), pulse = T > O + 1.7 ? 1 + 0.03 * Math.sin((T - O - 1.7) * 8) : 1;
  const fan = M.pop(O + 0.25, O + 0.8);
  const burst = clamp((T - (O + 1.1)) / 0.7, 0, 1);
  const DOTS = ['#2D6BFF', '#FF5C7A', '#7C4DFF', '#16A36A', '#0B7C86', '#FF8A3D', '#2D6BFF', '#FF5C7A', '#7C4DFF', '#16A36A', '#0B7C86', '#FF8A3D'];

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: SANS, color: '#FFFFFF' }}>
      {wipes.map((w, i) => {
        const k = i === 0 ? 1 : M.enter(w.at, w.at + 0.5);
        if (k <= 0) return null;
        return <div key={i} style={{ position: 'absolute', left: 540 - 1200, top: 968 - 1200, width: 2400, height: 2400, borderRadius: '50%', background: w.c, transform: `scale(${k})` }}></div>;
      })}

      {CARDS.map((c, i) => {
        const s = starts[i];
        if (T < s - 0.3 || T > s + 1.8) return null;
        const k = M.enter(s - 0.2, s + 0.25) * (1 - M.exit(s + 1.3, s + 1.6));
        const x = lerp(260, -260, clamp((T - s + 0.2) / 1.9, 0, 1));
        return <div key={c.word} style={{ position: 'absolute', left: -400, right: -400, top: 760, textAlign: 'center', fontSize: 330, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: 'rgba(255,255,255,0.2)', opacity: k, transform: `translateX(${x}px)` }}>{c.word}</div>;
      })}

      <div style={{ position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontSize: 300, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, opacity: clamp(tapK, 0, 1) * (1 - tapOut), transform: `translateY(${-420 * tapOut}px) scale(${(0.5 + 0.5 * tapK) * (1 - 0.6 * tapOut)})` }}>Tap.</div>

      {cornerLogo && (
        <div style={{ position: 'absolute', left: 60, top: 60, height: 84, padding: '0 26px 0 14px', borderRadius: 42, background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, opacity: 1 - M.exit(O - 0.1, O + 0.2) }}>
          <img src="assets/nexbizrise-logo.png" style={{ height: 58 }} />
          <span style={{ fontSize: 30, fontWeight: 800, color: INK, letterSpacing: '-0.02em' }}>NexBizRise</span>
        </div>
      )}

      {CARDS.map((c, i) => {
        const s = starts[i];
        if (T < s - 0.1 || T > s + 1.5) return null;
        const k = M.enter(s, s + 0.35) * (1 - M.exit(s + 1.25, s + 1.45));
        return <div key={c.line} style={{ position: 'absolute', left: 80, right: 80, top: 200, textAlign: 'center', fontSize: 68, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', textWrap: 'balance', opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>{c.line}</div>;
      })}

      {[{ src: CARDS[1].src, s: -1 }, { src: CARDS[2].src, s: 1 }].map(f => (
        <img key={f.src} src={f.src} style={{ position: 'absolute', left: 540 - 130, top: 860 - 317, width: 260, height: 634, borderRadius: 30, boxShadow: '0 30px 60px -24px rgba(16,24,32,0.5)', opacity: T >= O + 0.2 ? 1 : 0, transform: `translateX(${f.s * 235 * fan}px) rotate(${f.s * 10 * fan}deg)` }} />
      ))}

      <div style={{ position: 'absolute', left: 262, top: 430, width: 556, height: 1076, borderRadius: 86, background: '#0B0F14', boxShadow: '0 60px 120px -40px rgba(0,0,0,0.6)', transform: `translateY(${phoneY}px) rotate(${phoneR}deg) scale(${phoneS})`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', left: 18, top: 18, width: SW, height: SH, borderRadius: 70, overflow: 'hidden', background: '#FFFFFF' }}>
          {CARDS.map((c, i) => {
            const s = starts[i];
            const inStart = i === 0 ? -1 : s - 0.25;
            const outAt = i === CARDS.length - 1 ? 1e9 : starts[i + 1] - 0.25;
            if (T < inStart || T > outAt + 0.5) return null;
            const x = (i === 0 ? 0 : lerp(SW, 0, M.enter(s - 0.25, s + 0.2))) - SW * 0.3 * M.enter(outAt, outAt + 0.45);
            const pan = PAN * M.enter(s + 0.1, s + 0.85) * (1 - M.enter(O - 0.1, O + 0.5));
            return (
              <div key={i} style={{ position: 'absolute', inset: 0, zIndex: i + 1, transform: `translateX(${x}px)` }}>
                <img src={c.src} style={{ position: 'absolute', left: 0, top: -pan, width: SW, height: IH }} />
                <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0.4 * M.enter(outAt, outAt + 0.45) }}></div>
              </div>
            );
          })}
          {cur >= 0 && (() => {
            const t = starts[cur] + 1.0;
            const k = M.enter(t - 0.3, t - 0.1) * (1 - M.exit(t + 0.2, t + 0.4));
            const rp = clamp((T - t) / 0.4, 0, 1);
            const cx = 0.5 * SW, cy = 0.887 * IH - PAN;
            return k > 0 ? (
              <div style={{ position: 'absolute', left: cx - 44, top: cy - 44, width: 88, height: 88, zIndex: 20, opacity: k }}>
                {T > t && <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '5px solid #FFFFFF', opacity: 0.9 * (1 - rp), transform: `scale(${1 + 1.6 * rp})` }}></div>}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', transform: `scale(${T < t ? 1 : 0.85 + 0.15 * rp})` }}></div>
              </div>
            ) : null;
          })()}
          <div style={{ position: 'absolute', left: SW / 2 - 80, top: 20, width: 160, height: 46, borderRadius: 23, background: '#000', zIndex: 40 }}></div>
        </div>
      </div>

      {CARDS.map((c, i) => {
        const s = starts[i];
        if (T < s || T > s + 1.5) return null;
        const bob = Math.sin((T - s) * 5) * 8;
        const k1 = M.pop(s + 0.2, s + 0.55) * (1 - M.exit(s + 1.25, s + 1.45));
        const k2 = M.pop(s + 0.4, s + 0.75) * (1 - M.exit(s + 1.3, s + 1.5));
        return (
          <React.Fragment key={c.word + 'chips'}>
            <Chip icon={c.chips[0][0]} label={c.chips[0][1]} color={c.bg} k={k1} bob={bob} style={{ left: 60, top: 600, transformOrigin: '100% 50%' }} />
            <Chip icon={c.chips[1][0]} label={c.chips[1][1]} color={c.bg} k={k2} bob={-bob} style={{ right: 60, top: 1310, transformOrigin: '0% 50%' }} />
          </React.Fragment>
        );
      })}

      <div style={{ position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: clamp(logoK, 0, 1), transform: `scale(${0.7 + 0.3 * logoK})` }}>
        <img src="assets/nexbizrise-logo.png" style={{ height: 150 }} />
        <span style={{ fontSize: 68, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: INK }}>NexBizRise</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 372, textAlign: 'center', fontSize: 46, fontWeight: 800, color: INK, opacity: tagK, transform: `translateY(${(1 - tagK) * 24}px)` }}>Get tapped, get remembered.</div>

      {DOTS.map((c, i) => {
        if (burst <= 0 || burst >= 1) return null;
        const a = (i / DOTS.length) * Math.PI * 2 + 0.3;
        const r = 120 + 260 * Easing.easeOutCubic(burst);
        return <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(a) * r * 1.4 - 12, top: 1375 + Math.sin(a) * r * 0.7 - 12, width: 24, height: 24, borderRadius: i % 3 === 0 ? 6 : 12, background: c, opacity: 1 - burst, transform: `rotate(${burst * 180}deg)` }}></div>;
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1230, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ height: 58, padding: '0 28px', borderRadius: 29, background: INK, color: '#FFC933', display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 800, letterSpacing: '0.14em', opacity: clamp(badgeK, 0, 1), transform: `scale(${0.6 + 0.4 * badgeK})` }}>LIMITED-TIME OFFER</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, color: INK, opacity: T >= O + 0.65 ? 1 : 0 }}>
          <span style={{ position: 'relative', fontSize: 66, fontWeight: 700, opacity: 0.6 }}>
            ₹999
            <span style={{ position: 'absolute', left: -6, top: '52%', height: 7, borderRadius: 4, background: '#D42A3C', width: `calc(${strike * 100}% + 12px)` }}></span>
          </span>
          <span style={{ fontSize: 132, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, opacity: clamp(newP, 0, 1), transform: `scale(${0.5 + 0.5 * newP})`, display: 'inline-block' }}>₹799</span>
          <span style={{ fontSize: 40, fontWeight: 700, opacity: clamp(newP, 0, 1) * 0.75 }}>/year</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 190, top: 1530, width: 700, height: 116, borderRadius: 58, background: INK, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 44, fontWeight: 800, opacity: clamp(btnK, 0, 1), transform: `scale(${(0.6 + 0.4 * btnK) * pulse})` }}>Order your card <span>→</span></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1690, textAlign: 'center', fontSize: 40, fontWeight: 800, color: INK, opacity: clamp(btnK, 0, 1) }}>nexbizrise.com</div>
    </div>
  );
}

function NBRAd10() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#0B7C86">
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
window.NBRAd10 = NBRAd10;
