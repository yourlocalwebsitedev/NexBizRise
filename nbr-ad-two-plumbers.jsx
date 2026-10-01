const { useComposition, CompositionStage, Easing, clamp, useTweaks, TweaksPanel, TweakSection, TweakToggle } = window;
const SANS = 'Figtree, system-ui, sans-serif';
const INK = '#101820', MUTED = '#5B6270', RED = '#E5484D', GREEN = '#16A36A', BLUE = '#2D6BFF';
const lerp = (a, b, t) => a + (b - a) * t;
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const ICON = {
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  x: 'M6 6l12 12M18 6L6 18',
  msg: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
};
const Icon = ({ d, size = 30, w = 2.4 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d={d}></path></svg>;
const PLAN = ['ans', 'miss', 'miss', 'ans', 'miss', 'miss', 'ans', 'miss'];
const JOB = 285;

function useMotion(T) {
  const f = ease => (a, b) => (b <= a ? (T >= a ? 1 : 0) : ease(clamp((T - a) / (b - a), 0, 1)));
  return { enter: f(Easing.easeOutCubic), exit: f(Easing.easeInCubic), pop: f(Easing.easeOutBack) };
}
const clockAt = (T, start, dur) => { const m = 8 * 60 + clamp((T - start) / dur, 0, 1) * 600; const h = Math.floor(m / 60), mm = Math.floor(m % 60); return ((h - 1) % 12 + 1) + ':' + String(mm).padStart(2, '0') + (h < 12 ? ' AM' : ' PM'); };

function Toast({ ev, T, M, y, k }) {
  const { kind, t } = ev;
  let bg = '#FFFFFF', ic = RED, icon = ICON.phone, title = 'Missed call', sub = ev.time, strike = false;
  if (kind === 'ans') { ic = GREEN; icon = ICON.check; title = 'Answered · booked'; sub = '+' + money(JOB); }
  if (kind === 'lost' && T > t + 0.55) { ic = '#8A9099'; icon = ICON.x; title = 'Lost'; sub = 'Called another plumber'; strike = true; }
  if (kind === 'saved') {
    if (T > t + 0.35) { ic = BLUE; icon = ICON.msg; title = 'Auto-text sent'; sub = '5 sec after the missed call'; }
    if (T > t + 0.85) { ic = GREEN; icon = ICON.check; title = 'Replied · booked'; sub = '+' + money(JOB); }
  }
  const flip = kind !== 'ans' ? [0.35, 0.55, 0.85].reduce((a, s) => a + (T > t + s && T < t + s + 0.15 ? 1 : 0), 0) : 0;
  return (
    <div style={{ position: 'absolute', left: 470, width: 560, height: 104, top: y, borderRadius: 30, background: bg, color: INK, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', boxSizing: 'border-box', boxShadow: '0 20px 40px -16px rgba(0,0,0,0.55)', opacity: k, transform: `translateX(${(1 - M.pop(t, t + 0.4)) * 620}px) scale(${1 + 0.04 * flip})` }}>
      <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 18, background: ic, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={icon} size={34} /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 30, fontWeight: 800, textDecoration: strike ? 'line-through' : 'none', color: strike ? '#6B7280' : INK }}>{title}</span>
        <span style={{ fontSize: 24, fontWeight: 600, color: sub[0] === '+' ? GREEN : MUTED, whiteSpace: 'nowrap' }}>{sub}</span>
      </div>
    </div>
  );
}

function Half({ who, top, h, T, M, events, booked, missedN, gray, label, tag, tagBg, slotId, placeholder, shake, toastK = 1, labK = 1 }) {
  const kb = 1.06 + 0.08 * clamp(T / 20, 0, 1);
  const visible = events.filter(e => T >= e.t);
  return (
    <div style={{ position: 'absolute', left: 0, top, width: 1080, height: h, overflow: 'hidden', background: '#1B2230', transform: `translateX(${shake}px)` }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${kb})`, filter: `grayscale(${gray}) brightness(${1 - 0.35 * gray})` }}>
        <image-slot id={slotId} shape="rect" placeholder={placeholder} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
      </div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(10,14,22,0.78) 0%, rgba(10,14,22,0.25) 45%, rgba(10,14,22,0.55) 100%)' }}></div>
      <div style={{ position: 'absolute', left: 50, top: 70, display: 'flex', flexDirection: 'column', gap: 12, pointerEvents: 'none', opacity: labK }}>
        <span style={{ fontSize: 96, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>{label}</span>
        <span style={{ alignSelf: 'flex-start', height: 50, padding: '0 20px', borderRadius: 25, background: tagBg, color: tagBg === '#FFFFFF' ? INK : '#FFFFFF', display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 800 }}>
          {tagBg === '#FFFFFF' && <img src="assets/nexbizrise-logo.png" style={{ height: 34 }} />}{tag}
        </span>
      </div>
      <div style={{ position: 'absolute', left: 50, bottom: 70, display: 'flex', flexDirection: 'column', gap: 6, pointerEvents: 'none', opacity: labK }}>
        <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '0.14em', opacity: 0.8 }}>BOOKED TODAY</span>
        <span style={{ fontSize: 120, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: who === 'dave' ? '#5BE39B' : '#FFFFFF' }}>{money(booked)}</span>
        <span style={{ fontSize: 28, fontWeight: 700, color: missedN ? '#FF8A8E' : '#FFFFFF', opacity: 0.95 }}>{missedN} {who === 'dave' ? 'missed · all texted back' : 'missed calls lost'}</span>
      </div>
      {visible.map(e => {
        const rank = events.filter(o => o.t > e.t).reduce((a, o) => a + M.enter(o.t, o.t + 0.35), 0);
        if (rank > 3.2 || toastK <= 0) return null;
        return <Toast key={e.i} ev={e} T={T} M={M} y={120 + rank * 124} k={clamp(3.2 - rank, 0, 1) * toastK} />;
      })}
    </div>
  );
}

function Piece({ footnote }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const H = CUES.Hook, D = CUES.Day, R = CUES.Result, V = CUES.Secret, E = CUES.End;

  const times = PLAN.map((_, i) => D + 0.5 + 1.0 * i);
  const mk = (who) => PLAN.map((p, i) => ({ i, t: times[i], time: clockAt(times[i], D, 8.6), kind: p === 'ans' ? 'ans' : who === 'mike' ? 'lost' : 'saved' }));
  const mikeEv = mk('mike'), daveEv = mk('dave');
  const bookedAt = e => (e.kind === 'ans' ? e.t + 0.2 : e.kind === 'saved' ? e.t + 0.85 : Infinity);
  const sumBooked = evs => evs.reduce((a, e) => a + JOB * M.enter(bookedAt(e), bookedAt(e) + 0.45), 0);
  const mikeB = sumBooked(mikeEv), daveB = sumBooked(daveEv);
  const mikeMiss = mikeEv.filter(e => e.kind === 'lost' && T > e.t).length, daveMiss = daveEv.filter(e => e.kind === 'saved' && T > e.t).length;
  const shake = mikeEv.reduce((a, e) => a + (e.kind === 'lost' && T > e.t + 0.55 && T < e.t + 0.85 ? Math.sin((T - e.t) * 80) * 10 * (1 - (T - e.t - 0.55) / 0.3) : 0), 0);
  const coins = daveEv.filter(e => e.kind === 'saved').map(e => ({ at: bookedAt(e) }));

  // Hook
  const h1 = M.enter(H + 0.15, H + 0.5), h2 = M.enter(H + 0.8, H + 1.15);
  const split = M.enter(H + 1.9, H + 2.6);
  const topY = lerp(-960, 0, split), botY = lerp(1920, 960, split);

  // Result + secret
  const res = M.enter(R + 1.4, R + 2.1);
  const mikeH = lerp(960, 520, res);
  const takeover = M.enter(V, V + 0.6);
  const mikeTop = lerp(0, -mikeH, takeover);
  const daveTop = lerp(T < R ? botY : lerp(960, mikeH, res), 0, takeover);
  const daveH = 1920 - (T < V ? (T < R ? 960 : mikeH) : lerp(mikeH, 0, takeover));
  const gray = M.enter(R + 1.3, R + 2.0);
  const toastK = 1 - M.exit(R + 1.1, R + 1.4), daveLab = 1 - M.exit(V, V + 0.3);
  const diffK = M.pop(R + 2.0, R + 2.4) * (1 - M.exit(V, V + 0.3));
  const totK = M.pop(R + 0.2, R + 0.6) * (1 - M.exit(R + 1.3, R + 1.6));

  const phoneK = M.enter(V + 0.4, V + 1.1) * (1 - M.exit(E, E + 0.4));
  const b1 = M.pop(V + 1.1, V + 1.45), b2 = M.pop(V + 1.9, V + 2.25), b3 = M.pop(V + 2.5, V + 2.85);
  const endK = M.enter(E - 0.25, E + 0.3);
  const logoK = M.pop(E + 0.2, E + 0.6), beK = M.pop(E + 0.5, E + 0.95), subK = M.enter(E + 0.9, E + 1.25), btnK = M.pop(E + 1.2, E + 1.55), urlK = M.enter(E + 1.4, E + 1.7);
  const pulse = T > E + 1.6 ? 1 + 0.03 * Math.sin((T - E - 1.6) * 7) : 1;

  const clockK = M.pop(D, D + 0.4) * (1 - M.exit(R, R + 0.3));
  const cap = T >= V + 0.1 && T < E - 0.1 ? 'Dave’s secret? Every missed call gets a text back.' : T >= R + 2.0 && T < V ? null : null;
  const capK = M.enter(V + 0.1, V + 0.5) * (1 - M.exit(E - 0.35, E - 0.1));

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: SANS, color: '#FFFFFF', background: INK }}>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
        <span style={{ fontSize: 130, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, opacity: h1, transform: `translateY(${(1 - h1) * 40}px)` }}>Two plumbers.</span>
        <span style={{ fontSize: 64, fontWeight: 700, color: '#FFC933', opacity: h2, transform: `translateY(${(1 - h2) * 30}px)` }}>Same town. Same Tuesday.</span>
      </div>

      {T >= H + 1.9 && T < V + 0.7 && <Half who="mike" top={T < V ? topY : mikeTop} h={T < R ? 960 : mikeH} T={T} M={M} events={mikeEv} booked={mikeB} missedN={mikeMiss} gray={gray} label="Mike" tag="No text-back" tagBg="#3A4250" slotId="missed-mike" placeholder="Photo: plumber at work (Mike)" shake={shake} toastK={toastK} />}
      {T >= H + 1.9 && <Half who="dave" top={daveTop} h={daveH} T={T} M={M} events={daveEv} booked={daveB} missedN={daveMiss} gray={0} label="Dave" tag="NexBizRise text-back" tagBg="#FFFFFF" slotId="missed-dave" placeholder="Photo: HVAC / plumber at work (Dave)" shake={0} toastK={toastK} labK={daveLab} />}

      {coins.map((c, i) => { const k = clamp((T - c.at) / 0.8, 0, 1); return k > 0 && k < 1 ? <div key={i} style={{ position: 'absolute', left: 60 + 20 * i, top: 1640 - 140 * Easing.easeOutCubic(k), fontSize: 46, fontWeight: 800, color: '#5BE39B', opacity: 1 - k }}>+{money(JOB)}</div> : null; })}

      <div style={{ position: 'absolute', left: 540 - 150, top: 960 - 40, width: 300, height: 80, borderRadius: 40, background: '#FFFFFF', color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 36, fontWeight: 800, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', opacity: clamp(clockK, 0, 1), transform: `scale(${0.5 + 0.5 * clockK})`, zIndex: 20 }}>
        <span style={{ display: 'flex', color: BLUE }}><Icon d={ICON.clock} size={36} /></span>{clockAt(T, D, 8.6)}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 960 - 90, textAlign: 'center', zIndex: 20, opacity: clamp(totK, 0, 1), transform: `scale(${0.6 + 0.4 * totK})` }}>
        <span style={{ height: 150, padding: '0 50px', borderRadius: 75, background: '#FFC933', color: INK, display: 'inline-flex', alignItems: 'center', fontSize: 64, fontWeight: 800 }}>6:00 PM. Day’s done.</span>
      </div>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1010, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center', opacity: clamp(diffK, 0, 1), transform: `scale(${0.6 + 0.4 * diffK})` }}>
        <span style={{ fontSize: 200, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: '#5BE39B' }}>+{money(daveB - mikeB)}</span>
        <span style={{ fontSize: 58, fontWeight: 800 }}>more for Dave. Same day.</span>
      </div>

      {/* Secret */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: 190, zIndex: 25, textAlign: 'center', fontSize: 72, fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', textWrap: 'balance', opacity: capK, transform: `translateY(${(1 - capK) * 30}px)` }}>{cap || ''}</div>
      <div style={{ position: 'absolute', left: 540 - 278, top: 500, width: 556, height: 1076, zIndex: 24, borderRadius: 86, background: '#0B0F14', boxShadow: '0 60px 120px -30px rgba(0,0,0,0.7)', transform: `translateY(${(1 - phoneK) * 1500}px) rotate(${(1 - phoneK) * 8}deg)` }}>
        <div style={{ position: 'absolute', left: 18, top: 18, width: 520, height: 1040, borderRadius: 70, overflow: 'hidden', background: '#FFFFFF', color: INK }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingBottom: 20, borderBottom: '1px solid #E6E8EB' }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#FF8A3D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800 }}>JL</div>
            <span style={{ fontSize: 28, fontWeight: 700 }}>Jenna Lopez</span>
          </div>
          <div style={{ position: 'absolute', left: 24, right: 24, top: 280, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span style={{ alignSelf: 'center', fontSize: 22, color: '#9AA1AB' }}>Missed call · 11:40 AM</span>
            {[[b1, true, 'Hi Jenna, it’s Dave’s Plumbing & HVAC. Sorry we missed you! What can we help with?', 'Sent automatically · 5 sec'], [b2, false, 'AC stopped cooling. Any chance today?'], [b3, true, 'Yes! Tech booked for 3:00 PM today.']].map(([k, me, t, note], i) => (
              <div key={i} style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: 390, display: 'flex', flexDirection: 'column', alignItems: me ? 'flex-end' : 'flex-start', gap: 6, opacity: clamp(k, 0, 1), transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: me ? '100% 100%' : '0% 100%' }}>
                <div style={{ padding: '18px 24px', borderRadius: me ? '30px 30px 8px 30px' : '30px 30px 30px 8px', background: me ? BLUE : '#ECEEF1', color: me ? '#FFFFFF' : INK, fontSize: 27, lineHeight: 1.3 }}>{t}</div>
                {note && <span style={{ fontSize: 20, fontWeight: 700, color: GREEN }}>{note}</span>}
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', left: SW2 - 80, top: 20, width: 160, height: 46, borderRadius: 23, background: '#000' }}></div>
        </div>
      </div>

      {/* End */}
      <div style={{ position: 'absolute', left: 540 - 1200, top: 960 - 1200, width: 2400, height: 2400, borderRadius: '50%', background: '#FFC933', zIndex: 30, transform: `scale(${endK})` }}></div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 31, color: INK, pointerEvents: 'none' }}>
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
const SW2 = 260;

function NBRTwoPlumbers() {
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
window.NBRTwoPlumbers = NBRTwoPlumbers;
