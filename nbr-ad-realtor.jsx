const { useComposition, CompositionStage, Easing, clamp, useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;
const SANS = 'Figtree, system-ui, sans-serif';
const INK = '#101820', MUTED = '#5B6270';
const SW = 520, SH = 1040, IH = Math.round(520 * 3219 / 1320), PAN = IH - SH;
const lerp = (a, b, t) => a + (b - a) * t;
const IMG = { dark: 'campaign/5a-realestate-dark.png', light: 'campaign/5b-realestate-light.png' };
const PEOPLE = [['RS', '#FF5C7A'], ['AK', '#FFC933'], ['PM', '#16A36A'], ['NJ', '#FF8A3D'], ['VT', '#7C4DFF'], ['SK', '#0BB5C4'], ['DG', '#FF5C7A'], ['MB', '#FFC933']];
const SEATS = PEOPLE.map((_, i) => [210 + 220 * (i % 4) + (i >= 4 ? 110 : 0) - (i >= 4 ? 110 : 0), i < 4 ? 1290 : 1480]);
const NOTES = [
  { icon: 'chat', c: '#25D366', t: 'Rohan Shah', b: 'Is the Baner 2BHK still available?' },
  { icon: 'phone', c: '#2D6BFF', t: 'Incoming call', b: 'Priya M. · Saved from your card' },
  { icon: 'cal', c: '#FF8A3D', t: 'Site visit booked', b: 'Saturday, 11:00 AM · Wakad' },
  { icon: 'chat', c: '#25D366', t: 'Neha Joshi', b: 'Can we see the flat tomorrow?' },
];
const ICON = {
  cal: 'M4 5h16v15H4zM4 10h16M8 3v4M16 3v4',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  users: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.2a3.5 3.5 0 0 1 0 6.6',
  nfc: 'M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17',
};
const Icon = ({ d, size = 30, w = 2.3 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d={d}></path></svg>;

function useMotion(T) {
  const f = ease => (a, b) => (b <= a ? (T >= a ? 1 : 0) : ease(clamp((T - a) / (b - a), 0, 1)));
  return { enter: f(Easing.easeOutCubic), exit: f(Easing.easeInCubic), pop: f(Easing.easeOutBack) };
}

function Piece({ cornerLogo }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const A = CUES.OpenHouse, B = CUES.Lost, C = CUES.Tap, D = CUES.Leads, P = CUES.Price;

  const wipes = [{ at: -1, c: '#2D6BFF' }, { at: B - 0.2, c: '#2B3440' }, { at: C - 0.2, c: '#16A36A' }, { at: D - 0.2, c: '#D9480F' }, { at: P - 0.2, c: '#FFC933' }];
  const captions = [
    { at: A + 0.15, until: A + 1.55, text: 'Sunday open house. 40 visitors.' },
    { at: A + 1.6, until: B - 0.05, text: '40 paper cards handed out.' },
    { at: B + 0.15, until: B + 1.5, text: 'Monday. Zero calls.' },
    { at: B + 1.55, until: C - 0.05, text: 'Your cards got lost in their pockets.' },
    { at: C + 0.1, until: C + 1.55, text: 'This time, they tap your card.' },
    { at: C + 1.6, until: D - 0.05, text: 'You open on their phone.' },
    { at: D + 0.1, until: D + 1.6, text: 'They save you.' },
    { at: D + 1.65, until: P - 0.05, text: 'And they call you back.' },
  ];
  const cap = captions.find(c => T >= c.at && T < c.until);
  const capK = cap ? Math.min(M.enter(cap.at, cap.at + 0.4), 1 - M.exit(cap.until - 0.25, cap.until)) : 0;

  const portK = M.pop(A + 0.15, A + 0.6) * (1 - M.exit(B, B + 0.35));
  const chipK = M.pop(A + 0.9, A + 1.25) * (1 - M.exit(B, B + 0.3));
  const fallK = M.exit(B, B + 1.2);

  const phoneK = M.enter(B + 0.2, B + 0.9), phoneOut = M.exit(P, P + 0.5);
  const phoneY = lerp(1400, 0, phoneK) + 1700 * phoneOut;
  const cardUp = M.enter(C + 0.9, C + 1.4);
  const pan = PAN * M.enter(C + 1.7, C + 2.3);
  const tapT = C + 2.6, tapK = M.enter(tapT - 0.35, tapT - 0.15) * (1 - M.exit(tapT + 0.2, tapT + 0.4)), rp = clamp((T - tapT) / 0.4, 0, 1);
  const nfcK = M.enter(C + 0.1, C + 0.6) * (1 - M.exit(C + 1.2, C + 1.6));
  const ring = d => { const k = clamp((T - (C + d)) / 0.9, 0, 1); return T > C + d && k < 1 ? k : null; };
  const dim = M.enter(D, D + 0.3) * (1 - M.enter(P - 0.1, P + 0.2));
  const noteOut = M.exit(P - 0.15, P + 0.25);
  const leadsK = M.pop(D + 2.4, D + 2.75) * (1 - noteOut);
  const leadN = NOTES.filter((_, i) => T >= D + 0.3 + 0.5 * i).length;

  const logoK = M.pop(P + 0.1, P + 0.5), bigK = M.pop(P + 0.4, P + 0.8), yearK = M.enter(P + 0.7, P + 1.05), fracK = M.enter(P + 1.1, P + 1.45);
  const offK = M.pop(P + 1.5, P + 1.8), strike = M.enter(P + 1.75, P + 2.0), btnK = M.pop(P + 2.1, P + 2.45), urlK = M.enter(P + 2.3, P + 2.6);
  const pulse = T > P + 2.5 ? 1 + 0.03 * Math.sin((T - P - 2.5) * 7) : 1;
  const burst = clamp((T - (P + 0.5)) / 0.8, 0, 1);
  const DOTS = ['#2D6BFF', '#FF5C7A', '#7C4DFF', '#16A36A', '#0B7C86', '#FF8A3D', '#2D6BFF', '#FF5C7A', '#7C4DFF', '#16A36A', '#0B7C86', '#FF8A3D', '#2D6BFF', '#FF5C7A'];

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: SANS, color: '#FFFFFF' }}>
      {wipes.map((w, i) => {
        const k = i === 0 ? 1 : M.enter(w.at, w.at + 0.55);
        return k > 0 ? <div key={i} style={{ position: 'absolute', left: 540 - 1200, top: 960 - 1200, width: 2400, height: 2400, borderRadius: '50%', background: w.c, transform: `scale(${k})` }}></div> : null;
      })}

      {cornerLogo && (
        <div style={{ position: 'absolute', left: 60, top: 60, zIndex: 60, height: 84, padding: '0 26px 0 14px', borderRadius: 42, background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, opacity: 1 - M.exit(P - 0.2, P + 0.1) }}>
          <img src="assets/nexbizrise-logo.png" style={{ height: 58 }} />
          <span style={{ fontSize: 30, fontWeight: 800, color: INK, letterSpacing: '-0.02em' }}>NexBizRise</span>
        </div>
      )}
      {cap && <div style={{ position: 'absolute', left: 80, right: 80, top: 210, zIndex: 60, textAlign: 'center', fontSize: 76, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', textWrap: 'balance', opacity: capK, transform: `translateY(${(1 - capK) * 30}px)` }}>{cap.text}</div>}

      {/* Open house */}
      <div style={{ position: 'absolute', left: 540 - 150, top: 520, width: 300, height: 300, borderRadius: '50%', border: '10px solid #FFFFFF', boxSizing: 'border-box', overflow: 'hidden', boxShadow: '0 30px 60px -24px rgba(0,0,0,0.5)', opacity: clamp(portK, 0, 1), transform: `scale(${0.5 + 0.5 * portK})` }}>
        <img src="assets/realtor.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '68% 25%' }} />
      </div>
      <div style={{ position: 'absolute', left: 540 - 150, top: 840, width: 300, height: 60, borderRadius: 30, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, opacity: clamp(portK, 0, 1) }}>Arjun · Realtor</div>
      <div style={{ position: 'absolute', left: 540 - 170, top: 1010, width: 340, height: 84, borderRadius: 42, background: '#FFFFFF', color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 34, fontWeight: 800, boxShadow: '0 24px 50px -18px rgba(16,24,32,0.45)', opacity: clamp(chipK, 0, 1), transform: `scale(${0.5 + 0.5 * chipK})` }}>
        <span style={{ color: '#2D6BFF', display: 'flex' }}><Icon d={ICON.users} /></span>40 visitors
      </div>
      {PEOPLE.map(([ini, col], i) => {
        const [x, y] = SEATS[i];
        const k = M.pop(A + 0.35 + 0.07 * i, A + 0.75 + 0.07 * i);
        if (T < A + 0.35 + 0.07 * i || T > B + 0.6) return null;
        const o = 1 - M.exit(B, B + 0.5);
        return <div key={'p' + i} style={{ position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: '50%', background: col, border: '6px solid #FFFFFF', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 800, color: INK, opacity: o, transform: `scale(${clamp(k, 0, 1.2) * (1 - 0.3 * (1 - o))})` }}>{ini}</div>;
      })}
      {PEOPLE.map((_, i) => {
        const [x, y] = SEATS[i];
        const s = A + 1.7 + 0.12 * i;
        if (T < s || T > B + 1.3) return null;
        const k = M.enter(s, s + 0.45);
        const fx = lerp(540, x + 30, k), fy = lerp(690, y - 70, k) - Math.sin(k * Math.PI) * 120;
        const fr = (i % 2 ? 1 : -1) * (8 + i * 3);
        const dx = fx + (i % 2 ? 60 : -60) * fallK, dy = fy + 1300 * fallK * (0.8 + 0.05 * i), dr = fr * k + fallK * (i % 2 ? 160 : -160);
        return (
          <div key={'c' + i} style={{ position: 'absolute', left: dx - 80, top: dy - 46, width: 160, height: 92, borderRadius: 8, overflow: 'hidden', background: '#FFFDF8', boxShadow: '0 12px 24px -10px rgba(0,0,0,0.45)', transform: `rotate(${dr}deg) scale(${lerp(0.4, 1, k)})` }}>
            <div style={{ height: 8, background: '#2D6BFF' }}></div>
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ width: 90, height: 10, borderRadius: 5, background: INK }}></div>
              <div style={{ width: 110, height: 7, borderRadius: 4, background: '#B9BEC6' }}></div>
              <div style={{ width: 70, height: 7, borderRadius: 4, background: '#B9BEC6' }}></div>
            </div>
          </div>
        );
      })}

      {/* NFC card + rings */}
      {[0.75, 1.0].map(d => { const k = ring(d); return k != null ? <div key={d} style={{ position: 'absolute', left: 540 - 380, top: 480 - 380, width: 760, height: 760, borderRadius: '50%', border: '7px solid #FFFFFF', opacity: 0.7 * (1 - k), transform: `scale(${0.3 + 1.1 * k})` }}></div> : null; })}

      {/* Phone */}
      <div style={{ position: 'absolute', left: 540 - 278, top: 480, width: 556, height: 1076, borderRadius: 86, background: '#0B0F14', boxShadow: '0 60px 120px -40px rgba(0,0,0,0.6)', transform: `translateY(${phoneY}px)`, display: T >= B ? 'block' : 'none' }}>
        <div style={{ position: 'absolute', left: 18, top: 18, width: SW, height: SH, borderRadius: 70, overflow: 'hidden', background: '#FFFFFF', color: INK }}>
          <div style={{ position: 'absolute', left: 34, top: 96, fontSize: 56, fontWeight: 800, letterSpacing: '-0.02em' }}>Recents</div>
          <div style={{ position: 'absolute', left: 34, right: 34, top: 180, height: 60, borderRadius: 14, background: '#EEF0F3', display: 'flex', padding: 4, boxSizing: 'border-box', gap: 4, fontSize: 24, fontWeight: 700 }}>
            <div style={{ flex: 1, borderRadius: 10, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>All</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED }}>Missed</div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: '#9AA1AB' }}>
            <div style={{ width: 150, height: 150, borderRadius: '50%', background: '#EEF0F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={ICON.phone} size={70} w={1.8} /></div>
            <span style={{ fontSize: 36, fontWeight: 800, color: INK }}>No recent calls</span>
            <span style={{ fontSize: 26 }}>Monday</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - cardUp) * SH}px)`, display: T >= C + 0.9 ? 'block' : 'none' }}>
            <img src={IMG.dark} style={{ position: 'absolute', left: 0, top: -pan, width: SW, height: IH }} />
          </div>
          {tapK > 0 && (
            <div style={{ position: 'absolute', left: SW / 2 - 44, top: 0.887 * IH - PAN - 44, width: 88, height: 88, opacity: tapK }}>
              {T > tapT && <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '5px solid #FFFFFF', opacity: 1 - rp, transform: `scale(${1 + 1.5 * rp})` }}></div>}
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}></div>
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0.45 * dim }}></div>
          <div style={{ position: 'absolute', left: SW / 2 - 80, top: 20, width: 160, height: 46, borderRadius: 23, background: '#000' }}></div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 540 - 210, top: 150, width: 420, height: 250, borderRadius: 26, background: '#0E2240', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.55)', padding: 30, boxSizing: 'border-box', display: T >= C && T < C + 1.7 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between', transform: `translateY(${lerp(-500, 250, nfcK)}px) rotate(${lerp(-12, -4, nfcK)}deg)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="assets/nexbizrise-logo.png" style={{ height: 44 }} />
          <span style={{ fontSize: 24, fontWeight: 800, color: '#F2B544' }}>Arjun Mehta</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#FFFFFF' }}>Tap to connect</span>
          <span style={{ color: '#F2B544', display: 'flex' }}><Icon d={ICON.nfc} size={44} /></span>
        </div>
      </div>

      {/* Leads */}
      {NOTES.map((n, i) => {
        const s = D + 0.3 + 0.5 * i;
        if (T < s) return null;
        const k = M.pop(s, s + 0.4);
        return (
          <div key={i} style={{ position: 'absolute', left: 90, right: 90, top: 470 + 175 * i, height: 150, borderRadius: 38, background: 'rgba(255,255,255,0.97)', color: INK, boxShadow: '0 24px 50px -18px rgba(16,24,32,0.5)', display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px', boxSizing: 'border-box', opacity: clamp(k, 0, 1) * (1 - noteOut), transform: `translateY(${(1 - k) * -60}px) scale(${0.85 + 0.15 * k})` }}>
            <div style={{ width: 84, height: 84, flexShrink: 0, borderRadius: 22, background: n.c, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={ICON[n.icon]} size={42} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 32, fontWeight: 800 }}>{n.t}</span>
              <span style={{ fontSize: 28, color: MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.b}</span>
            </div>
            <span style={{ marginLeft: 'auto', alignSelf: 'flex-start', marginTop: 30, fontSize: 22, color: '#9AA1AB' }}>now</span>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 540 - 200, top: 1640, width: 400, height: 96, borderRadius: 48, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 38, fontWeight: 800, opacity: clamp(leadsK, 0, 1), transform: `scale(${0.5 + 0.5 * leadsK})` }}>
        <span style={{ color: '#FFC933' }}>{leadN}</span> new leads
      </div>

      {/* Price */}
      {[[IMG.dark, 380, -7], [IMG.light, 700, 7]].map(([src, cx, r], i) => {
        const k = M.pop(P + 0.3 + 0.12 * i, P + 0.9 + 0.12 * i);
        return T >= P + 0.3 ? <img key={src} src={src} style={{ position: 'absolute', left: cx - 125, top: 1430, width: 250, height: 610, borderRadius: 30, boxShadow: '0 30px 60px -24px rgba(16,24,32,0.5)', transform: `translateY(${(1 - k) * 640}px) rotate(${r}deg)` }} /> : null;
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
      <div style={{ position: 'absolute', left: 80, right: 80, top: 890, textAlign: 'center', fontSize: 42, fontWeight: 600, color: '#3A3320', opacity: fracK, transform: `translateY(${(1 - fracK) * 20}px)` }}>Less than one lost lead.</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1010, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: clamp(offK, 0, 1), transform: `scale(${0.6 + 0.4 * offK})` }}>
        <div style={{ height: 58, padding: '0 26px', borderRadius: 29, background: INK, color: '#FFC933', display: 'flex', alignItems: 'center', fontSize: 25, fontWeight: 800, letterSpacing: '0.14em' }}>LIMITED-TIME OFFER</div>
        <span style={{ position: 'relative', fontSize: 44, fontWeight: 700, color: INK, opacity: 0.65 }}>
          was ₹999
          <span style={{ position: 'absolute', left: 88, top: '54%', height: 6, borderRadius: 3, background: '#D42A3C', width: `calc(${strike} * (100% - 82px))` }}></span>
        </span>
      </div>
      <div style={{ position: 'absolute', left: 160, top: 1130, width: 760, height: 116, borderRadius: 58, background: INK, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 44, fontWeight: 800, opacity: clamp(btnK, 0, 1), transform: `scale(${(0.6 + 0.4 * btnK) * pulse})` }}>Get your realtor card <span>→</span></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1280, textAlign: 'center', fontSize: 40, fontWeight: 800, color: INK, opacity: urlK }}>nexbizrise.com</div>
    </div>
  );
}

function NBRRealtor() {
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
window.NBRRealtor = NBRRealtor;
