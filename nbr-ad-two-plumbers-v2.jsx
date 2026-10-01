const { useComposition, CompositionStage, Easing, clamp, useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;
const SANS = 'Figtree, system-ui, sans-serif';
const INK = '#101820', MUTED = '#5B6270', RED = '#E5484D', GREEN = '#16A36A', BLUE = '#2D6BFF';
const lerp = (a, b, t) => a + (b - a) * t;
const ICON = {
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  x: 'M6 6l12 12M18 6L6 18',
  mic: 'M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  check: 'M5 12.5l4.5 4.5L19 7.5',
};
const Icon = ({ d, size = 30, w = 2.4 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d={d}></path></svg>;

function useMotion(T) {
  const f = ease => (a, b) => (b <= a ? (T >= a ? 1 : 0) : ease(clamp((T - a) / (b - a), 0, 1)));
  return { enter: f(Easing.easeOutCubic), exit: f(Easing.easeInCubic), pop: f(Easing.easeOutBack) };
}

function Strip({ x, w, z, slotId, placeholder, name, tag, tagLight, gray, zoom, nameK }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 0, width: w, height: 1920, overflow: 'hidden', zIndex: z, background: '#1B2230', boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, filter: `grayscale(${gray}) brightness(${1 - 0.3 * gray})` }}>
        <image-slot id={slotId} shape="rect" placeholder={placeholder} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
      </div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(10,14,22,0.7) 0%, rgba(10,14,22,0) 28%, rgba(10,14,22,0) 55%, rgba(10,14,22,0.85) 100%)' }}></div>
      <div style={{ position: 'absolute', left: 50, bottom: 80, display: 'flex', flexDirection: 'column', gap: 14, pointerEvents: 'none', opacity: nameK }}>
        <span style={{ fontSize: 110, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>{name}</span>
        <span style={{ alignSelf: 'flex-start', height: 52, padding: '0 20px', borderRadius: 26, background: tagLight ? '#FFFFFF' : 'rgba(255,255,255,0.18)', color: tagLight ? INK : '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, fontSize: 26, fontWeight: 800, whiteSpace: 'nowrap' }}>
          {tagLight && <img src="assets/nexbizrise-logo.png" style={{ height: 36 }} />}{tag}
        </span>
      </div>
    </div>
  );
}

function CallCard({ cx, y, T, ringUntil, k }) {
  const ringing = T < ringUntil;
  const buzz = ringing ? Math.sin(T * 90) * 5 * (Math.floor(T * 2.5) % 2) : 0;
  return (
    <div style={{ position: 'absolute', left: cx - 220, top: y, width: 440, height: 130, zIndex: 20, borderRadius: 34, background: '#FFFFFF', color: INK, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', boxSizing: 'border-box', boxShadow: '0 24px 50px -16px rgba(0,0,0,0.6)', opacity: clamp(k, 0, 1), transform: `translateX(${buzz}px) scale(${0.6 + 0.4 * k})` }}>
      <div style={{ width: 78, height: 78, borderRadius: 24, background: ringing ? GREEN : RED, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ringing ? 1 + 0.08 * Math.sin(T * 12) : 1})` }}><Icon d={ICON.phone} size={40} /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: ringing ? INK : RED }}>{ringing ? 'Jenna Lopez' : 'Missed call'}</span>
        <span style={{ fontSize: 24, color: MUTED }}>{ringing ? 'calling…' : 'Jenna · 11:40 AM'}</span>
      </div>
    </div>
  );
}

function Piece({ footnote }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const H = CUES.Hook, R = CUES.Ring, MK = CUES.Mike, DV = CUES.Dave, W = CUES.Week, E = CUES.End;

  const h1 = M.enter(H + 0.15, H + 0.5), h2 = M.enter(H + 0.7, H + 1.05), hOut = M.exit(H + 1.5, H + 1.9);
  const splitIn = M.enter(H + 1.4, H + 2.2);
  const toMike = M.enter(MK - 0.1, MK + 0.5);
  const mikeX = lerp(-540, 0, splitIn), mikeW = lerp(540, 1080, toMike);
  const daveSplitX = lerp(1080, 540, splitIn) + 540 * toMike;
  const toDave = M.enter(DV - 0.15, DV + 0.45);
  const daveX = T < DV - 0.15 ? daveSplitX : lerp(1080, 0, toDave), daveW = T < DV - 0.15 ? 540 : 1080;
  const nameSplit = M.enter(H + 1.9, H + 2.3) * (1 - M.exit(MK - 0.2, MK));
  const mikeName = Math.max(nameSplit, M.enter(MK + 0.3, MK + 0.7));
  const daveName = Math.max(nameSplit, M.enter(DV + 0.4, DV + 0.8)) * (1 - M.exit(W - 0.2, W));
  const mikeGray = M.enter(MK + 1.7, MK + 2.4);
  const mikeZoom = 1.04 + 0.1 * M.enter(MK, W);
  const daveZoom = 1.04 + 0.08 * M.enter(DV, W);

  const cardK = M.pop(R + 0.3, R + 0.7) * (1 - M.exit(MK - 0.1, MK + 0.2));
  const ringUntil = R + 1.6;

  const lines = [
    { at: 0.5, c: RED, icon: ICON.phone, t: 'Missed call · Jenna Lopez', s: '11:40 AM' },
    { at: 1.1, c: '#8A9099', icon: ICON.mic, t: 'No voicemail', s: 'Most callers don’t leave one' },
    { at: 1.7, c: '#8A9099', icon: ICON.x, t: 'Jenna booked another plumber', s: '11:52 AM', strike: true },
  ];
  const listOut = 1 - M.exit(DV - 0.2, DV + 0.1);
  const lossK = M.pop(MK + 2.3, MK + 2.65) * listOut;

  const phoneK = M.enter(DV + 0.3, DV + 0.9) * (1 - M.exit(W - 0.2, W + 0.2));
  const b1 = M.pop(DV + 0.9, DV + 1.25), b2 = M.pop(DV + 1.7, DV + 2.05), b3 = M.pop(DV + 2.3, DV + 2.65);
  const winK = M.pop(DV + 2.9, DV + 3.25) * (1 - M.exit(W - 0.2, W + 0.1));

  const captions = [
    { at: R + 0.15, until: R + 1.6, text: '11:40 AM. Both are on a job.' },
    { at: R + 1.65, until: MK - 0.05, text: 'Both miss the call.' },
    { at: MK + 0.2, until: MK + 1.65, text: 'Mike can’t call back till 5 PM.' },
    { at: MK + 1.7, until: DV - 0.1, text: 'Jenna has already hired someone else.' },
    { at: DV + 0.2, until: DV + 2.0, text: 'Dave’s phone texts Jenna back in 5 seconds.' },
    { at: DV + 2.05, until: W - 0.1, text: 'Jenna books Dave.' },
  ];
  const cap = captions.find(c => T >= c.at && T < c.until);
  const capK = cap ? Math.min(M.enter(cap.at, cap.at + 0.35), 1 - M.exit(cap.until - 0.25, cap.until)) : 0;

  const wk = M.enter(W - 0.25, W + 0.3);
  const w1 = M.enter(W + 0.05, W + 0.4), w2 = M.pop(W + 0.9, W + 1.3), w3 = M.enter(W + 1.4, W + 1.75), w4 = M.enter(W + 1.8, W + 2.1);
  const endK = M.enter(E - 0.25, E + 0.3);
  const logoK = M.pop(E + 0.2, E + 0.6), beK = M.pop(E + 0.5, E + 0.95), subK = M.enter(E + 0.9, E + 1.25), btnK = M.pop(E + 1.2, E + 1.55), urlK = M.enter(E + 1.4, E + 1.7);
  const pulse = T > E + 1.6 ? 1 + 0.03 * Math.sin((T - E - 1.6) * 7) : 1;

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: SANS, color: '#FFFFFF', background: INK }}>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center', opacity: 1 - hOut }}>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, opacity: h1, transform: `translateY(${(1 - h1) * 40}px)` }}>Two plumbers.</span>
        <span style={{ fontSize: 64, fontWeight: 700, color: '#FFC933', opacity: h2, transform: `translateY(${(1 - h2) * 30}px)` }}>Same town. Same Tuesday.</span>
      </div>

      {T >= H + 1.4 && T < W + 0.4 && <Strip x={mikeX} w={mikeW} z={2} slotId="missed-mike" placeholder="Photo: plumber at work (Mike)" name="Mike" tag="No text-back" tagLight={false} gray={mikeGray} zoom={mikeZoom} nameK={mikeName} />}
      {T >= H + 1.4 && T < W + 0.4 && <Strip x={daveX} w={daveW} z={3} slotId="missed-dave" placeholder="Photo: HVAC / plumber at work (Dave)" name="Dave" tag="NexBizRise text-back" tagLight={true} gray={0} zoom={daveZoom} nameK={daveName} />}

      {T >= R && T < MK + 0.3 && <><CallCard cx={270} y={860} T={T} ringUntil={ringUntil} k={cardK} /><CallCard cx={810} y={860} T={T - 0.12} ringUntil={ringUntil - 0.12} k={cardK} /></>}

      {cap && <div style={{ position: 'absolute', left: 70, right: 70, top: 170, zIndex: 40, textAlign: 'center', fontSize: 74, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', textWrap: 'balance', textShadow: '0 4px 30px rgba(0,0,0,0.5)', opacity: capK, transform: `translateY(${(1 - capK) * 30}px)` }}>{cap.text}</div>}

      {/* Mike */}
      <div style={{ position: 'absolute', left: 90, right: 90, top: 700, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 18, opacity: listOut, display: T >= MK && T < DV + 0.2 ? 'flex' : 'none' }}>
        {lines.map(l => {
          const k = M.pop(MK + l.at, MK + l.at + 0.4);
          return (
            <div key={l.t} style={{ height: 124, borderRadius: 34, background: '#FFFFFF', color: INK, display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', boxShadow: '0 24px 50px -16px rgba(0,0,0,0.6)', opacity: clamp(k, 0, 1), transform: `translateY(${(1 - clamp(k, 0, 1)) * 40}px) scale(${0.8 + 0.2 * k})` }}>
              <div style={{ width: 72, height: 72, flexShrink: 0, borderRadius: 22, background: l.c, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={l.icon} size={38} /></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 34, fontWeight: 800, textDecoration: l.strike ? 'line-through' : 'none' }}>{l.t}</span>
                <span style={{ fontSize: 26, color: MUTED }}>{l.s}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1170, zIndex: 21, textAlign: 'center', opacity: clamp(lossK, 0, 1), transform: `scale(${2 - clamp(lossK, 0, 1)}) rotate(-6deg)` }}>
        <span style={{ display: 'inline-block', padding: '10px 40px', border: '10px solid ' + RED, borderRadius: 24, color: RED, background: 'rgba(255,255,255,0.92)', fontSize: 130, fontWeight: 800, letterSpacing: '-0.04em' }}>−$285</span>
      </div>

      {/* Dave */}
      <div style={{ position: 'absolute', left: 540 - 250, top: 470, width: 500, height: 968, zIndex: 20, borderRadius: 78, background: '#0B0F14', boxShadow: '0 60px 120px -30px rgba(0,0,0,0.7)', transform: `translateY(${(1 - phoneK) * 1500}px) rotate(${(1 - phoneK) * 8}deg)` }}>
        <div style={{ position: 'absolute', left: 16, top: 16, width: 468, height: 936, borderRadius: 64, overflow: 'hidden', background: '#FFFFFF', color: INK }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingBottom: 18, borderBottom: '1px solid #E6E8EB' }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#FF8A3D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800 }}>JL</div>
            <span style={{ fontSize: 26, fontWeight: 700 }}>Jenna Lopez</span>
          </div>
          <div style={{ position: 'absolute', left: 22, right: 22, top: 260, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span style={{ alignSelf: 'center', fontSize: 21, color: '#9AA1AB' }}>Missed call · 11:40 AM</span>
            {[[b1, true, 'Hi Jenna, it’s Dave’s Plumbing & HVAC. Sorry we missed you! What can we help with?', 'Sent automatically · 5 sec'], [b2, false, 'AC stopped cooling. Any chance today?'], [b3, true, 'Yes! Tech booked for 3:00 PM today.']].map(([k, me, t, note], i) => (
              <div key={i} style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: me ? 'flex-end' : 'flex-start', gap: 6, opacity: clamp(k, 0, 1), transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: me ? '100% 100%' : '0% 100%' }}>
                <div style={{ padding: '16px 22px', borderRadius: me ? '28px 28px 8px 28px' : '28px 28px 28px 8px', background: me ? BLUE : '#ECEEF1', color: me ? '#FFFFFF' : INK, fontSize: 25, lineHeight: 1.3 }}>{t}</div>
                {note && <span style={{ fontSize: 19, fontWeight: 700, color: GREEN }}>{note}</span>}
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', left: 234 - 72, top: 18, width: 144, height: 42, borderRadius: 21, background: '#000' }}></div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1300, zIndex: 22, textAlign: 'center', opacity: clamp(winK, 0, 1), transform: `scale(${2 - clamp(winK, 0, 1)}) rotate(-6deg)` }}>
        <span style={{ display: 'inline-block', padding: '10px 40px', border: '10px solid ' + GREEN, borderRadius: 24, color: GREEN, background: 'rgba(255,255,255,0.95)', fontSize: 130, fontWeight: 800, letterSpacing: '-0.04em' }}>+$285</span>
      </div>

      {/* Week */}
      <div style={{ position: 'absolute', left: 540 - 1200, top: 960 - 1200, width: 2400, height: 2400, borderRadius: '50%', background: INK, zIndex: 28, transform: `scale(${wk})` }}></div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 29, display: T >= W ? 'block' : 'none' }}>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 560, textAlign: 'center', fontSize: 66, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', opacity: w1, transform: `translateY(${(1 - w1) * 30}px)` }}>That happens about 5 times a week.</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontSize: 260, fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1, color: '#5BE39B', opacity: clamp(w2, 0, 1), transform: `scale(${0.5 + 0.5 * w2})` }}>$1,425</div>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 1090, textAlign: 'center', fontSize: 56, fontWeight: 800, lineHeight: 1.15, opacity: w3 }}>a week. Dave keeps it.<br />Mike loses it.</div>
        <div style={{ position: 'absolute', left: 80, right: 80, top: 1270, textAlign: 'center', fontSize: 30, fontWeight: 600, color: 'rgba(255,255,255,0.7)', opacity: w4 }}>5 missed calls × $285 average job</div>
      </div>

      {/* End */}
      <div style={{ position: 'absolute', left: 540 - 1200, top: 960 - 1200, width: 2400, height: 2400, borderRadius: '50%', background: '#FFC933', zIndex: 30, transform: `scale(${endK})` }}></div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 31, color: INK, pointerEvents: 'none', display: T >= E - 0.25 ? 'block' : 'none' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: clamp(logoK, 0, 1), transform: `scale(${0.7 + 0.3 * logoK})` }}>
          <img src="assets/nexbizrise-logo.png" style={{ height: 160 }} />
          <span style={{ fontSize: 66, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>NexBizRise</span>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontSize: 260, fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1, opacity: clamp(beK, 0, 1), transform: `scale(${0.4 + 0.6 * beK}) rotate(${(1 - clamp(beK, 0, 1)) * -6}deg)` }}>Be Dave.</div>
        <div style={{ position: 'absolute', left: 110, right: 110, top: 880, textAlign: 'center', fontSize: 46, fontWeight: 700, lineHeight: 1.3, color: '#3A3320', opacity: subK }}>Missed-call text-back for plumbers, HVAC and home services.</div>
        <div style={{ position: 'absolute', left: 190, top: 1110, width: 700, height: 116, borderRadius: 58, background: INK, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 44, fontWeight: 800, opacity: clamp(btnK, 0, 1), transform: `scale(${(0.6 + 0.4 * btnK) * pulse})` }}>Book a free demo <span>→</span></div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1265, textAlign: 'center', fontSize: 40, fontWeight: 800, opacity: urlK }}>nexbizrise.com</div>
        {footnote && <div style={{ position: 'absolute', left: 90, right: 90, bottom: 70, textAlign: 'center', fontSize: 22, lineHeight: 1.4, color: '#3A3320', opacity: urlK }}>Illustration. Job value uses the $285 average home-service job (HomeAdvisor). Results vary.</div>}
      </div>
    </div>
  );
}

function NBRTwoPlumbers2() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={INK}>
        <Piece footnote={t.footnote} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Video" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
        <TweakToggle label="Footnote" value={t.footnote} onChange={v => setTweak('footnote', v)} />
      </TweaksPanel>
    </>
  );
}
window.NBRTwoPlumbers2 = NBRTwoPlumbers2;
