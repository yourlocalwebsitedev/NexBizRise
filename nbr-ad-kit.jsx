// Shared pieces for the NexBizRise card ads (vertical 1080x1920 + horizontal 1920x1080).
const { Easing, clamp } = window;
const NBK = {};
NBK.C = { bg: '#F4EFE7', ink: '#101820', teal: '#0B7C86', muted: '#5B6270', red: '#C8372D', green: '#11703F', paper: '#FFFDF8' };
NBK.SANS = 'Figtree, system-ui, sans-serif';
NBK.SERIF = 'Newsreader, Georgia, serif';
NBK.IMG = { re: 'campaign/5b-realestate-light.png', red: 'campaign/5a-realestate-dark.png', nurse: 'campaign/4a-nurse-modern-clean.png', nurse2: 'campaign/4d-nurse-friendly.png', cre: 'campaign/6a-creative-dark.png', green: 'campaign/7a-personal-forest-green.png' };
NBK.SW = 620; NBK.SH = 1240; NBK.IH = Math.round(620 * 3219 / 1320); NBK.PAN = NBK.IH - NBK.SH;
NBK.lerp = (a, b, t) => a + (b - a) * t;
NBK.useMotion = T => {
  const f = ease => (a, b) => (b <= a ? (T >= a ? 1 : 0) : ease(clamp((T - a) / (b - a), 0, 1)));
  return { enter: f(Easing.easeOutCubic), exit: f(Easing.easeInCubic), move: f(Easing.easeInOutCubic), pop: f(Easing.easeOutBack) };
};
NBK.Text = function Text({ T, M, items, style }) {
  const it = items.find(i => T >= i.at && T < i.until);
  if (!it) return null;
  const k = Math.min(M.enter(it.at, it.at + 0.4), 1 - M.exit(it.until - 0.25, it.until));
  return <div style={{ ...style, opacity: k, transform: `translateY(${(1 - k) * 26}px)` }}>{it.text}</div>;
};
NBK.headStyle = (V, extra) => V
  ? { position: 'absolute', left: 80, right: 80, top: 170, textAlign: 'center', fontSize: 68, lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.03em', textWrap: 'balance', zIndex: 20, ...extra }
  : { position: 'absolute', left: 120, width: 760, top: 330, textAlign: 'left', fontSize: 78, lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.035em', textWrap: 'balance', zIndex: 20, ...extra };
NBK.subStyle = (V, extra) => V
  ? { position: 'absolute', left: 90, right: 90, top: 1760, textAlign: 'center', fontSize: 36, lineHeight: 1.3, fontWeight: 600, color: NBK.C.muted, zIndex: 20, ...extra }
  : { position: 'absolute', left: 120, width: 700, top: 700, textAlign: 'left', fontSize: 36, lineHeight: 1.35, fontWeight: 600, color: NBK.C.muted, zIndex: 20, ...extra };
// phone placement: centre point + scale
NBK.Phone = function Phone({ cx, cy, s = 1, y = 0, rot = 0, children, glow }) {
  return (
    <div style={{ position: 'absolute', left: cx - 328, top: cy - 638, width: 656, height: 1276, borderRadius: 96, background: '#0B0F14', boxShadow: glow ? '0 0 0 10px rgba(11,124,134,0.35), 0 60px 120px -40px rgba(16,24,32,0.55)' : '0 60px 120px -40px rgba(16,24,32,0.55)', transform: `translateY(${y}px) rotate(${rot}deg) scale(${s})`, transformOrigin: '50% 50%', zIndex: 10 }}>
      <div style={{ position: 'absolute', left: 18, top: 18, width: NBK.SW, height: NBK.SH, borderRadius: 80, overflow: 'hidden', background: '#0E1620' }}>
        {children}
        <div style={{ position: 'absolute', left: NBK.SW / 2 - 90, top: 22, width: 180, height: 52, borderRadius: 26, background: '#000', zIndex: 60 }}></div>
      </div>
    </div>
  );
};
NBK.Lock = ({ time = '10:24', date = 'Tuesday, 29 September' }) => (
  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#1B2A3A,#0E1620)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 170, color: '#FFFFFF', gap: 6 }}>
    <span style={{ fontSize: 26, fontWeight: 600, opacity: 0.8 }}>{date}</span>
    <span style={{ fontSize: 150, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}>{time}</span>
  </div>
);
NBK.Screen = ({ src, pan = 0, x = 0, y = 0, z = 1, dim = 0 }) => (
  <div style={{ position: 'absolute', inset: 0, zIndex: z, transform: `translate(${x}px,${y}px)` }}>
    <img src={src} style={{ position: 'absolute', left: 0, top: -pan, width: NBK.SW, height: NBK.IH }} />
    {dim > 0 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dim }}></div>}
  </div>
);
// finger tap in screen coordinates
NBK.Tap = function Tap({ T, M, t, x, y }) {
  if (T < t - 0.5 || T > t + 0.5) return null;
  const k = M.enter(t - 0.5, t - 0.25) * (1 - M.exit(t + 0.25, t + 0.5));
  const press = T < t ? 1 - 0.18 * M.enter(t - 0.12, t) : 0.82 + 0.18 * M.enter(t, t + 0.15);
  const rp = clamp((T - t) / 0.5, 0, 1);
  return (
    <div style={{ position: 'absolute', left: x - 48, top: y - 48, width: 96, height: 96, zIndex: 50, opacity: k }}>
      {T > t && <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '5px solid #FFFFFF', opacity: 0.8 * (1 - rp), transform: `scale(${1 + 1.4 * rp})` }}></div>}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: '4px solid ' + NBK.C.teal, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', transform: `scale(${(1.25 - 0.25 * k) * press})` }}></div>
    </div>
  );
};
// NFC tap rings around a point (stage coords)
NBK.Rings = function Rings({ T, t, cx, cy, r = 400 }) {
  return [0, 0.25].map(d => { const k = clamp((T - t - d) / 1.1, 0, 1); if (T < t + d || k >= 1) return null; return <div key={d} style={{ position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', border: '6px solid ' + NBK.C.teal, opacity: 0.55 * (1 - k), transform: `scale(${0.3 + 1.1 * k})`, zIndex: 9 }}></div>; });
};
NBK.Paper = ({ name = 'Arjun Mehta', role = 'Property Consultant · Mehta Realty', phone = '+91 98220 41573', x = 0, y = 0, rot = 0, s = 1, z = 5, stain, stamp, strikePhone, newPhone, style }) => (
  <div style={{ position: 'absolute', left: x - 300, top: y - 170, width: 600, height: 340, borderRadius: 18, background: NBK.C.paper, boxShadow: '0 30px 60px -24px rgba(16,24,32,0.35)', padding: 48, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transform: `rotate(${rot}deg) scale(${s})`, zIndex: z, overflow: 'hidden', ...style }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontFamily: NBK.SERIF, fontSize: 58, fontWeight: 600, lineHeight: 1, color: NBK.C.ink }}>{name}</span>
      <span style={{ fontSize: 28, color: NBK.C.muted }}>{role}</span>
    </div>
    <div style={{ height: 2, background: 'rgba(16,24,32,0.12)' }}></div>
    <span style={{ position: 'relative', fontSize: 30, fontWeight: 600, color: NBK.C.ink, alignSelf: 'flex-start' }}>{phone}
      {strikePhone > 0 && <span style={{ position: 'absolute', left: -4, top: '52%', height: 5, borderRadius: 3, background: NBK.C.red, width: `calc(${strikePhone * 100}% + 8px)` }}></span>}
    </span>
    {stain > 0 && <div style={{ position: 'absolute', left: 330, top: 60, width: 210, height: 210, borderRadius: '50%', border: '16px solid rgba(120,72,30,0.45)', opacity: stain, filter: 'blur(1.5px)' }}></div>}
    {stamp > 0 && <div style={{ position: 'absolute', left: 150, top: 110, padding: '10px 26px', border: '7px solid ' + NBK.C.red, borderRadius: 12, color: NBK.C.red, fontSize: 56, fontWeight: 800, letterSpacing: '0.08em', transform: `rotate(-14deg) scale(${NBK.lerp(2.2, 1, stamp)})`, opacity: clamp(stamp * 1.5, 0, 1) }}>OUTDATED</div>}
  </div>
);
NBK.Sheet = ({ k, saved, name = 'Arjun Mehta', role = 'Property Consultant · Mehta Realty', phone = '+91 98220 41573', photo = 'assets/realtor.jpg', pos = '68% 25%' }) => (
  <>
    <div style={{ position: 'absolute', inset: 0, zIndex: 25, background: '#000', opacity: 0.35 * k }}></div>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 600, zIndex: 30, background: '#FFFFFF', borderRadius: '44px 44px 0 0', transform: `translateY(${(1 - k) * 640}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 22, gap: 14, color: NBK.C.ink }}>
      <div style={{ width: 90, height: 8, borderRadius: 4, background: '#D5D9DE' }}></div>
      <img src={photo} style={{ marginTop: 18, width: 170, height: 170, borderRadius: '50%', objectFit: 'cover', objectPosition: pos }} />
      <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.02em' }}>{name}</span>
      <span style={{ fontSize: 26, color: NBK.C.muted }}>{role}</span>
      <span style={{ fontSize: 30, fontWeight: 600 }}>{phone}</span>
      <div style={{ marginTop: 10, height: 72, padding: '0 30px', borderRadius: 36, background: '#E3F4EA', color: NBK.C.green, display: 'flex', alignItems: 'center', gap: 12, fontSize: 30, fontWeight: 700, opacity: clamp(saved, 0, 1), transform: `scale(${0.6 + 0.4 * saved})` }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>
        Saved to contacts
      </div>
    </div>
  </>
);
NBK.Bg = ({ T, W, H }) => {
  const d = Math.sin(T * 0.35) * 60;
  return (<>
    <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', left: -300 + d, top: H * 0.55 - d, background: 'radial-gradient(circle, rgba(11,124,134,0.12), rgba(11,124,134,0) 65%)' }}></div>
    <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', left: W - 520 - d, top: -200 + d * 0.6, background: 'radial-gradient(circle, rgba(31,95,168,0.10), rgba(31,95,168,0) 65%)' }}></div>
  </>);
};
NBK.CornerLogo = ({ V, k = 1 }) => (
  <div style={{ position: 'absolute', left: V ? 64 : 72, top: V ? 64 : 56, display: 'flex', alignItems: 'center', gap: 10, opacity: k, zIndex: 40 }}>
    <img src="assets/nexbizrise-logo.png" style={{ height: V ? 64 : 56 }} />
    <span style={{ fontSize: V ? 34 : 30, fontWeight: 800, letterSpacing: '-0.02em', color: NBK.C.ink }}>NexBizRise</span>
  </div>
);
// End card: circle wipe then logo, tagline, price, button
NBK.End = function End({ T, M, at, V, W, H, tagline = 'Get tapped, get remembered.', cta = 'Order your card' }) {
  if (T < at - 0.05) return null;
  const wipe = M.enter(at, at + 0.55);
  const logoK = M.pop(at + 0.2, at + 0.65), tagK = M.enter(at + 0.45, at + 0.85);
  const badgeK = M.pop(at + 0.8, at + 1.15), strike = M.enter(at + 0.95, at + 1.25), newP = M.pop(at + 1.2, at + 1.6);
  const btnK = M.pop(at + 1.5, at + 1.9), pulse = T > at + 1.9 ? 1 + 0.03 * Math.sin((T - at - 1.9) * 7) : 1;
  const R = Math.hypot(W, H);
  const brand = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: V ? 'center' : 'flex-start', gap: 8, opacity: clamp(logoK, 0, 1), transform: `scale(${0.7 + 0.3 * logoK})`, transformOrigin: V ? '50% 50%' : '0 50%' }}>
      <img src="assets/nexbizrise-logo.png" style={{ height: V ? 190 : 150 }} />
      <span style={{ fontSize: V ? 76 : 70, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>NexBizRise</span>
      <span style={{ marginTop: 18, fontSize: V ? 48 : 46, fontWeight: 700, color: NBK.C.teal, opacity: tagK, transform: `translateY(${(1 - tagK) * 24}px)`, textAlign: V ? 'center' : 'left', maxWidth: V ? 900 : 760, textWrap: 'balance' }}>{tagline}</span>
    </div>
  );
  const offer = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <div style={{ height: 58, padding: '0 28px', borderRadius: 29, background: NBK.C.teal, color: '#FFFFFF', display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 800, letterSpacing: '0.14em', opacity: clamp(badgeK, 0, 1), transform: `scale(${0.6 + 0.4 * badgeK})` }}>LIMITED-TIME OFFER</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, opacity: T >= at + 0.8 ? 1 : 0 }}>
        <span style={{ position: 'relative', fontSize: 66, fontWeight: 700, color: NBK.C.muted }}>₹999<span style={{ position: 'absolute', left: -6, top: '52%', height: 7, borderRadius: 4, background: NBK.C.red, width: `calc(${strike * 100}% + 12px)` }}></span></span>
        <span style={{ fontSize: 128, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, opacity: clamp(newP, 0, 1), transform: `scale(${0.5 + 0.5 * newP})`, display: 'inline-block' }}>₹799</span>
        <span style={{ fontSize: 40, fontWeight: 600, color: NBK.C.muted, opacity: clamp(newP, 0, 1) }}>/year</span>
      </div>
      <div style={{ marginTop: 16, width: 700, height: 116, borderRadius: 58, background: NBK.C.ink, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 44, fontWeight: 800, opacity: clamp(btnK, 0, 1), transform: `scale(${(0.6 + 0.4 * btnK) * pulse})` }}>{cta} <span>→</span></div>
      <span style={{ fontSize: 38, fontWeight: 700, opacity: clamp(btnK, 0, 1) }}>nexbizrise.com</span>
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none', color: NBK.C.ink }}>
      <div style={{ position: 'absolute', left: W / 2 - R, top: H / 2 - R, width: R * 2, height: R * 2, borderRadius: '50%', background: NBK.C.bg, transform: `scale(${wipe})` }}></div>
      {V
        ? <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 110 }}>{brand}{offer}</div>
        : <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0 120px', gap: 60 }}>{brand}{offer}</div>}
    </div>
  );
};
// Standard wrapper: format tweak + stage
NBK.makeAd = (Piece, bg) => function Ad() {
  const { CompositionStage, useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio } = window;
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const V = t.format !== 'Horizontal';
  const W = V ? 1080 : 1920, H = V ? 1920 : 1080;
  return (
    <>
      <CompositionStage key={t.format} width={W} height={H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={bg || NBK.C.bg}>
        <Piece V={V} W={W} H={H} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Video" />
        <TweakRadio label="Format" value={t.format} options={['Vertical', 'Horizontal']} onChange={v => setTweak('format', v)} />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </>
  );
};
window.NBK = NBK;
