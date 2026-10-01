const { useComposition, CompositionStage, Easing, clamp, useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;
const SANS = 'Figtree, system-ui, sans-serif';
const INK = '#101820', MUTED = '#5B6270';
const SW = 520, SH = 1040;
const lerp = (a, b, t) => a + (b - a) * t;
const ICON = {
  wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  missed: 'M3 8l5 5 4-4 6 6M18 11v4h-4',
  star: 'M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.3L12 17.5 6.5 20.4l1-6.3L3 9.7l6.2-.9z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  msg: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
};
const Icon = ({ d, size = 30, w = 2.3, fill = 'none' }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d={d}></path></svg>;
const money = n => '$' + Math.round(n).toLocaleString('en-US');

function useMotion(T) {
  const f = ease => (a, b) => (b <= a ? (T >= a ? 1 : 0) : ease(clamp((T - a) / (b - a), 0, 1)));
  return { enter: f(Easing.easeOutCubic), exit: f(Easing.easeInCubic), pop: f(Easing.easeOutBack) };
}

function Piece({ cornerLogo, sources }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const A = CUES.OnJob, B = CUES.Lost, C = CUES.Cost, D = CUES.TextBack, E = CUES.Recovered, F = CUES.End;

  const wipes = [{ at: -1, c: '#1E2A44' }, { at: B - 0.2, c: '#C8283A' }, { at: C - 0.2, c: INK }, { at: D - 0.2, c: '#16A36A' }, { at: E - 0.2, c: '#2D6BFF' }, { at: F - 0.2, c: '#FFC933' }];
  const captions = [
    { at: A + 0.15, until: A + 1.65, text: 'You’re on a job. Your phone rings.' },
    { at: A + 1.7, until: B - 0.05, text: 'You miss it.' },
    { at: B + 0.15, until: B + 1.55, text: 'Sarah doesn’t leave a voicemail.' },
    { at: B + 1.6, until: C - 0.05, text: 'She calls the next plumber.' },
    { at: C + 0.1, until: D - 0.05, text: 'What do missed calls cost you?' },
    { at: D + 0.1, until: D + 1.75, text: 'Now every missed call gets a text back.' },
    { at: D + 1.8, until: E - 0.05, text: 'She replies. You book the job.' },
    { at: E + 0.1, until: F - 0.05, text: 'Win those jobs back.' },
  ];
  const cap = captions.find(c => T >= c.at && T < c.until);
  const capK = cap ? Math.min(M.enter(cap.at, cap.at + 0.4), 1 - M.exit(cap.until - 0.25, cap.until)) : 0;

  // Phone: in for OnJob+Lost, out for Cost, back for TextBack, out at Recovered
  const inA = M.enter(A + 0.05, A + 0.7), outC = M.exit(C, C + 0.45), inD = M.enter(D - 0.1, D + 0.5), outE = M.exit(E, E + 0.45);
  const phoneY = T < C + 0.5 ? lerp(1400, 0, inA) + 1600 * outC : lerp(1600, 0, inD) + 1600 * outE;
  const buzz = T > A + 0.5 && T < A + 1.9 ? Math.sin(T * 90) * 6 * (Math.floor(T * 2.5) % 2) : 0;
  const ringing = T < A + 1.9, missedK = M.pop(A + 1.95, A + 2.3);
  const jobChip = M.pop(A + 0.4, A + 0.75) * (1 - M.exit(B, B + 0.3));

  const res = [
    { n: 'Mike’s Plumbing', r: '4.8', s: 'No answer', c: '#C8283A', at: 0.3 },
    { n: 'QuickFlow Plumbing', r: '4.6', s: 'Calling…', c: '#16A36A', at: 0.6 },
    { n: 'Metro Pipe & Drain', r: '4.5', s: '', c: '', at: 0.9 },
  ];
  const callNext = M.pop(B + 1.7, B + 2.0);
  const statK = M.pop(B + 1.9, B + 2.3) * (1 - M.exit(C, C + 0.3));

  const rows = [
    { t: '5 missed calls a week', at: 0.35 },
    { t: '× 85% never call back', at: 0.8 },
    { t: '× $285 average job', at: 1.25 },
    { t: '× 52 weeks', at: 1.7 },
  ];
  const totK = M.pop(C + 2.1, C + 2.4), tot = 63000 * M.enter(C + 2.1, C + 3.0);
  const costOut = 1 - M.exit(D - 0.2, D + 0.1);

  const msgs = [
    { at: 0.7, me: true, t: 'Hi Sarah, it’s Mike’s Plumbing. Sorry we missed your call! How can we help?', note: 'Sent automatically · 5 sec' },
    { at: 1.7, me: false, t: 'Water heater is leaking. Can you come today?' },
    { at: 2.5, me: true, t: 'Yes! You’re booked for today at 3:00 PM.' },
  ];
  const bookedK = M.pop(D + 2.9, D + 3.25) * (1 - M.exit(E, E + 0.3));

  const dashK = M.pop(E + 0.3, E + 0.7) * (1 - M.exit(F - 0.2, F + 0.15));
  const cnt = M.enter(E + 0.5, E + 1.8);
  const stats = [['Missed calls texted back', Math.round(22 * cnt)], ['Jobs booked', Math.round(18 * cnt)]];

  const logoK = M.pop(F + 0.1, F + 0.5), l1 = M.enter(F + 0.4, F + 0.8), l2 = M.enter(F + 0.8, F + 1.15), btnK = M.pop(F + 1.2, F + 1.55), urlK = M.enter(F + 1.4, F + 1.7);
  const pulse = T > F + 1.6 ? 1 + 0.03 * Math.sin((T - F - 1.6) * 7) : 1;

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: SANS, color: '#FFFFFF' }}>
      {wipes.map((w, i) => {
        const k = i === 0 ? 1 : M.enter(w.at, w.at + 0.55);
        return k > 0 ? <div key={i} style={{ position: 'absolute', left: 540 - 1200, top: 960 - 1200, width: 2400, height: 2400, borderRadius: '50%', background: w.c, transform: `scale(${k})` }}></div> : null;
      })}

      {cornerLogo && (
        <div style={{ position: 'absolute', left: 60, top: 60, zIndex: 60, height: 84, padding: '0 26px 0 14px', borderRadius: 42, background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, opacity: 1 - M.exit(F - 0.2, F + 0.1) }}>
          <img src="assets/nexbizrise-logo.png" style={{ height: 58 }} />
          <span style={{ fontSize: 30, fontWeight: 800, color: INK, letterSpacing: '-0.02em' }}>NexBizRise</span>
        </div>
      )}
      {cap && <div style={{ position: 'absolute', left: 80, right: 80, top: 210, zIndex: 60, textAlign: 'center', fontSize: 76, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', textWrap: 'balance', opacity: capK, transform: `translateY(${(1 - capK) * 30}px)` }}>{cap.text}</div>}

      {/* Phone */}
      <div style={{ position: 'absolute', left: 540 - 278, top: 480, width: 556, height: 1076, borderRadius: 86, background: '#0B0F14', boxShadow: '0 60px 120px -40px rgba(0,0,0,0.6)', transform: `translate(${buzz}px, ${phoneY}px) rotate(${buzz * 0.3}deg)` }}>
        <div style={{ position: 'absolute', left: 18, top: 18, width: SW, height: SH, borderRadius: 70, overflow: 'hidden', background: '#111827' }}>
          {T < B && (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#2A3550,#111827)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 170, gap: 14 }}>
              <div style={{ width: 170, height: 170, borderRadius: '50%', background: '#FF8A3D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 66, fontWeight: 800, color: INK }}>SK</div>
              <span style={{ fontSize: 54, fontWeight: 700 }}>Sarah Kim</span>
              <span style={{ fontSize: 28, opacity: 0.7 }}>{ringing ? 'mobile · calling…' : 'mobile'}</span>
              {ringing && (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 120, display: 'flex', justifyContent: 'space-around' }}>
                  {['#E5484D', '#30A46C'].map((c, i) => <div key={c} style={{ width: 130, height: 130, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${i === 1 ? 1 + 0.06 * Math.sin(T * 10) : 1}) rotate(${i === 0 ? 135 : 0}deg)` }}><Icon d={ICON.phone} size={56} w={2.2} /></div>)}
                </div>
              )}
              {!ringing && (
                <div style={{ position: 'absolute', left: 30, right: 30, top: 470, height: 130, borderRadius: 30, background: 'rgba(255,255,255,0.95)', color: INK, display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', boxSizing: 'border-box', opacity: clamp(missedK, 0, 1), transform: `scale(${0.7 + 0.3 * missedK})` }}>
                  <div style={{ width: 72, height: 72, borderRadius: 20, background: '#E5484D', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={ICON.phone} size={38} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 30, fontWeight: 800, color: '#C8283A' }}>Missed call</span><span style={{ fontSize: 26, color: MUTED }}>Sarah Kim · 2:14 PM</span></div>
                </div>
              )}
            </div>
          )}
          {T >= B && T < C + 0.6 && (
            <div style={{ position: 'absolute', inset: 0, background: '#F4F5F7', color: INK, paddingTop: 100, boxSizing: 'border-box' }}>
              <div style={{ margin: '0 30px', height: 76, borderRadius: 38, background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', padding: '0 28px', fontSize: 30, fontWeight: 600 }}>plumbers near me</div>
              <div style={{ margin: '28px 30px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
                {res.map((r, i) => {
                  const k = M.enter(B + r.at, B + r.at + 0.35);
                  const hi = i === 1 && callNext > 0;
                  return (
                    <div key={r.n} style={{ height: 170, borderRadius: 26, background: '#FFFFFF', border: hi ? '4px solid #16A36A' : '4px solid transparent', padding: '0 26px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${hi ? 1 + 0.03 * callNext : 1})` }}>
                      <span style={{ fontSize: 32, fontWeight: 800 }}>{r.n}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 26, color: MUTED }}><span style={{ color: '#F5A524', display: 'flex' }}><Icon d={ICON.star} size={24} w={1.5} fill="currentColor" /></span>{r.r} · Plumber · Open now</div>
                      {r.s && (i === 0 || callNext > 0) && <span style={{ alignSelf: 'flex-start', height: 40, padding: '0 16px', borderRadius: 20, background: r.c, color: '#FFFFFF', display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 800 }}>{r.s}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {T >= C + 0.6 && (
            <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', color: INK }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingBottom: 20, borderBottom: '1px solid #E6E8EB' }}>
                <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#FF8A3D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800 }}>SK</div>
                <span style={{ fontSize: 28, fontWeight: 700 }}>Sarah Kim</span>
              </div>
              <div style={{ position: 'absolute', left: 24, right: 24, top: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ alignSelf: 'center', fontSize: 22, color: '#9AA1AB', opacity: M.enter(D + 0.3, D + 0.6) }}>Missed call · 2:14 PM</span>
                {msgs.map((m, i) => {
                  if (T < D + m.at) return null;
                  const k = M.pop(D + m.at, D + m.at + 0.35);
                  return (
                    <div key={i} style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: 380, display: 'flex', flexDirection: 'column', alignItems: m.me ? 'flex-end' : 'flex-start', gap: 6, opacity: clamp(k, 0, 1), transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: m.me ? '100% 100%' : '0% 100%' }}>
                      <div style={{ padding: '18px 24px', borderRadius: m.me ? '30px 30px 8px 30px' : '30px 30px 30px 8px', background: m.me ? '#2D6BFF' : '#ECEEF1', color: m.me ? '#FFFFFF' : INK, fontSize: 27, lineHeight: 1.3 }}>{m.t}</div>
                      {m.note && <span style={{ fontSize: 20, fontWeight: 700, color: '#16A36A' }}>{m.note}</span>}
                    </div>
                  );
                })}
              </div>
              <div style={{ position: 'absolute', left: 40, right: 40, bottom: 70, height: 90, borderRadius: 45, background: '#E3F4EA', color: '#11703F', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 30, fontWeight: 800, opacity: clamp(bookedK, 0, 1), transform: `scale(${0.6 + 0.4 * bookedK})` }}><Icon d={ICON.check} size={32} w={3} />Job booked · $285</div>
            </div>
          )}
          <div style={{ position: 'absolute', left: SW / 2 - 80, top: 20, width: 160, height: 46, borderRadius: 23, background: '#000' }}></div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 50, top: 600, zIndex: 30, height: 92, padding: '0 30px 0 16px', borderRadius: 46, background: '#FFFFFF', color: INK, display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 800, boxShadow: '0 24px 50px -18px rgba(0,0,0,0.5)', opacity: clamp(jobChip, 0, 1), transform: `scale(${0.5 + 0.5 * jobChip})` }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: '#FF8A3D', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={ICON.wrench} size={32} /></div>Under a kitchen sink
      </div>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 1600, zIndex: 30, borderRadius: 36, background: '#FFFFFF', color: INK, padding: '26px 34px', display: 'flex', alignItems: 'center', gap: 22, boxShadow: '0 24px 50px -18px rgba(0,0,0,0.5)', opacity: clamp(statK, 0, 1), transform: `scale(${0.6 + 0.4 * statK})` }}>
        <span style={{ fontSize: 88, fontWeight: 800, color: '#C8283A', letterSpacing: '-0.04em', lineHeight: 1 }}>85%</span>
        <span style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>of callers who reach voicemail never call back</span>
      </div>

      {/* Cost */}
      <div style={{ position: 'absolute', left: 110, right: 110, top: 560, display: 'flex', flexDirection: 'column', gap: 26, opacity: costOut }}>
        {rows.map(r => { const k = M.enter(C + r.at, C + r.at + 0.35); return <div key={r.t} style={{ fontSize: 58, fontWeight: 700, opacity: k, transform: `translateX(${(1 - k) * -60}px)` }}>{r.t}</div>; })}
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.35)', transformOrigin: '0 50%', transform: `scaleX(${M.enter(C + 2.0, C + 2.3)})` }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, opacity: clamp(totK, 0, 1), transform: `scale(${0.7 + 0.3 * totK})`, transformOrigin: '0 50%' }}>
          <span style={{ fontSize: 150, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: '#FF5C6C' }}>{money(tot)}</span>
          <span style={{ fontSize: 50, fontWeight: 700 }}>lost every year.</span>
        </div>
      </div>

      {/* Recovered */}
      <div style={{ position: 'absolute', left: 110, right: 110, top: 520, borderRadius: 44, background: '#FFFFFF', color: INK, padding: '50px 54px', display: 'flex', flexDirection: 'column', gap: 30, boxShadow: '0 40px 80px -30px rgba(0,0,0,0.5)', opacity: clamp(dashK, 0, 1), transform: `translateY(${(1 - dashK) * 80}px)` }}>
        <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '0.14em', color: MUTED }}>THIS MONTH</span>
        {stats.map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, borderBottom: '2px solid #EEF0F3', paddingBottom: 22 }}>
            <span style={{ fontSize: 36, fontWeight: 600 }}>{l}</span><span style={{ fontSize: 60, fontWeight: 800 }}>{v}</span>
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 36, fontWeight: 600 }}>Revenue won back</span>
          <span style={{ fontSize: 140, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: '#16A36A' }}>{money(5130 * cnt)}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1520, textAlign: 'center', fontSize: 44, fontWeight: 700, opacity: dashK * M.enter(E + 1.6, E + 1.9) }}>≈ {money(63000)} a year</div>

      {/* End */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: clamp(logoK, 0, 1), transform: `scale(${0.7 + 0.3 * logoK})` }}>
        <img src="assets/nexbizrise-logo.png" style={{ height: 160 }} />
        <span style={{ fontSize: 66, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: INK }}>NexBizRise</span>
      </div>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 560, textAlign: 'center', fontSize: 92, fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.035em', color: INK, textWrap: 'balance', opacity: l1, transform: `translateY(${(1 - l1) * 30}px)` }}>Never lose a job to a missed call.</div>
      <div style={{ position: 'absolute', left: 110, right: 110, top: 900, textAlign: 'center', fontSize: 42, fontWeight: 600, lineHeight: 1.3, color: '#3A3320', opacity: l2 }}>Missed-call text-back for plumbers, HVAC and home services.</div>
      <div style={{ position: 'absolute', left: 190, top: 1120, width: 700, height: 116, borderRadius: 58, background: INK, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 44, fontWeight: 800, opacity: clamp(btnK, 0, 1), transform: `scale(${(0.6 + 0.4 * btnK) * pulse})` }}>Book a free demo <span>→</span></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1275, textAlign: 'center', fontSize: 40, fontWeight: 800, color: INK, opacity: urlK }}>nexbizrise.com</div>

      {sources && (
        <div style={{ position: 'absolute', left: 80, right: 80, bottom: 70, textAlign: 'center', fontSize: 22, lineHeight: 1.4, color: T >= F - 0.2 ? '#3A3320' : 'rgba(255,255,255,0.75)', opacity: T >= C + 0.3 && (T < D - 0.1 || T >= F + 0.5) ? 1 : 0 }}>
          Example: 5 missed calls a week × 85% who don’t call back (Forbes/BIA Kelsey) × $285 average home-service job (HomeAdvisor) × 52 weeks. Your numbers will vary.
        </div>
      )}
    </div>
  );
}

function NBRMissed() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#1E2A44">
        <Piece cornerLogo={t.cornerLogo} sources={t.sources} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Video" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
        <TweakToggle label="Corner logo" value={t.cornerLogo} onChange={v => setTweak('cornerLogo', v)} />
        <TweakToggle label="Source footnote" value={t.sources} onChange={v => setTweak('sources', v)} />
      </TweaksPanel>
    </>
  );
}
window.NBRMissed = NBRMissed;
