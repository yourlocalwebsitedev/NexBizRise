const { useComposition, clamp } = window;
const { C, SANS, IMG, SW, SH, PAN, lerp, useMotion, Phone, Lock, Screen, Sheet, Paper, Bg, CornerLogo, End, Rings, Tap, Text, headStyle, subStyle, makeAd } = window.NBK;

const REALTORS = [['Sanjay Patil', 'Realtor · HomeFirst'], ['Arjun Mehta', 'Property Consultant · Mehta Realty'], ['Rohit Jain', 'Real Estate Agent · PropKey'], ['Kiran Desai', 'Realtor · Desai Estates']];

const ContactsList = ({ hi }) => {
  const rows = [['AK', 'Aarti Kulkarni', ''], ['AJ', 'Ajay (Gym)', ''], ['PHOTO', 'Arjun Mehta', 'Property Consultant · Mehta Realty'], ['AS', 'Ashok Sharma', ''], ['BA', 'Bank Helpline', ''], ['DI', 'Didi', '']];
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', color: C.ink, padding: '110px 0 0', zIndex: 4 }}>
      <div style={{ padding: '0 30px 18px', fontSize: 54, fontWeight: 800, letterSpacing: '-0.02em' }}>Contacts</div>
      <div style={{ margin: '0 30px 18px', height: 64, borderRadius: 20, background: '#F1F2F4', display: 'flex', alignItems: 'center', padding: '0 22px', fontSize: 28, color: '#8A9099' }}>Search</div>
      {rows.map(([ini, n, sub], i) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 30px', background: i === 2 ? `rgba(11,124,134,${0.1 * hi})` : 'transparent', borderBottom: '1px solid #EEF0F2' }}>
          {ini === 'PHOTO'
            ? <img src="assets/realtor.jpg" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', objectPosition: '68% 25%' }} />
            : <span style={{ width: 76, height: 76, borderRadius: '50%', background: '#D9DDE2', color: '#5B6270', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700 }}>{ini}</span>}
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontSize: 32, fontWeight: 600 }}>{n}</span>{sub && <span style={{ fontSize: 22, color: C.muted }}>{sub}</span>}</span>
        </div>
      ))}
    </div>
  );
};

function Piece({ V, W, H }) {
  const { T, CUES } = useComposition();
  const M = useMotion(T);
  const Pi = CUES.Pile, Me = CUES.Meet, L = CUES.Later, R = CUES.Refer, O = CUES.Offer;
  const VC = V ? { x: 540, y: 1080 } : { x: 1320, y: 600 };
  const s = V ? 0.8 : 0.66;

  const heads = [
    { at: 0.2, until: Pi - 0.05, text: 'Priya met 4 realtors this week.' },
    { at: Pi + 0.1, until: Pi + 2.4, text: 'A week later, she wants to call one back.' },
    { at: Pi + 2.5, until: Me - 0.05, text: 'Which one had the flat in Baner?' },
    { at: Me + 0.1, until: L - 0.05, text: 'Now replay it. Arjun taps his NexBizRise card.' },
    { at: L + 0.1, until: R - 0.05, text: 'A week later, his photo is right there.' },
    { at: R + 0.1, until: O, text: 'And she sends him her friend.' },
  ];
  const subs = [
    { at: 0.8, until: Pi - 0.05, text: 'All of them gave her a paper card.' },
    { at: Me + 3.8, until: L - 0.05, text: 'Saved with his photo, listings and WhatsApp.' },
  ];

  // paper phase
  const paperK = 1 - M.exit(Me - 0.3, Me + 0.05);
  const fan = M.enter(0.3, 1.1), pile = M.move(Pi + 0.2, Pi + 1.4);
  const blur = 7 * M.enter(Pi + 1.2, Pi + 2.4);
  const qK = M.pop(Pi + 2.5, Pi + 2.85);

  // phone phase
  const pk = M.enter(Me, Me + 0.7) * (1 - M.exit(O - 0.1, O + 0.2));
  const phoneY = lerp(1400, 0, M.enter(Me, Me + 0.7));
  const nfc = M.move(Me + 0.6, Me + 1.1) * (1 - M.move(Me + 1.4, Me + 1.9));
  const cardUp = M.enter(Me + 1.2, Me + 1.6);
  const pan = PAN * (M.move(Me + 1.9, Me + 2.9) - M.move(Me + 3.1, Me + 3.6));
  const sheet = M.enter(Me + 4.1, Me + 4.5) * (1 - M.exit(L + 0.1, L + 0.4));
  const saved = M.pop(Me + 4.6, Me + 4.9);
  const list = M.enter(L + 0.3, L + 0.7);
  const hi = M.enter(L + 1.6, L + 2.0);
  const chat = M.enter(L + 2.6, L + 3.0);
  const b1 = M.pop(L + 3.2, L + 3.5), typing = T > L + 3.7 && T < L + 4.7, b2 = M.pop(L + 4.7, L + 5.0);
  const fwd = M.enter(R + 0.2, R + 0.6), sent = M.pop(R + 1.8, R + 2.1);
  const PC = V ? { x: 540, y: 1060, s: 0.92 } : { x: 1320, y: 560, s: 0.72 };

  const bubble = (k, mine, text) => (
    <div style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '82%', padding: '18px 22px', borderRadius: mine ? '26px 26px 6px 26px' : '26px 26px 26px 6px', background: mine ? '#D9FDD3' : '#FFFFFF', color: C.ink, fontSize: 30, lineHeight: 1.35, boxShadow: '0 2px 4px rgba(0,0,0,0.08)', opacity: clamp(k, 0, 1), transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: mine ? '100% 100%' : '0 100%' }}>{text}</div>
  );

  return (
    <div data-screen-label={'t=' + Math.floor(T) + 's'} style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: SANS, color: C.ink, overflow: 'hidden' }}>
      <Bg T={T} W={W} H={H} />
      <CornerLogo V={V} k={1 - M.exit(O, O + 0.3)} />
      <Text T={T} M={M} items={heads} style={headStyle(V)} />
      <Text T={T} M={M} items={subs} style={subStyle(V)} />

      {paperK > 0 && REALTORS.map(([n, r], i) => {
        const fx = VC.x + (i - 1.5) * (V ? 150 : 170) * fan, fy = VC.y - 40 + Math.abs(i - 1.5) * 40 * fan;
        const px = VC.x + (i - 1.5) * 18, py = VC.y + (i - 1.5) * 14;
        return <Paper key={n} name={n} role={r} phone={'+91 9' + (7012345 + i * 32101)} x={lerp(fx, px, pile)} y={lerp(fy, py, pile)} rot={lerp((i - 1.5) * 12 * fan, (i - 1.5) * 5, pile)} s={s} z={3 + i} style={{ opacity: paperK, filter: `blur(${blur}px)` }} />;
      })}
      {paperK > 0 && qK > 0 && <div style={{ position: 'absolute', zIndex: 30, left: VC.x - 60, top: VC.y - (V ? 330 : 300), width: 120, height: 120, borderRadius: '50%', background: C.ink, color: '#FFFFFF', fontSize: 80, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: paperK * clamp(qK, 0, 1), transform: `scale(${qK})` }}>?</div>}

      {pk > 0 && <Rings T={T} t={Me + 1.05} cx={PC.x} cy={PC.y - 380 * PC.s} r={V ? 340 : 260} />}
      {pk > 0 && nfc > 0 && (
        <div style={{ position: 'absolute', zIndex: 12, left: lerp(V ? 1100 : 1920, PC.x - 160, nfc), top: PC.y - 520 * PC.s - 100, width: 320, height: 200, borderRadius: 20, background: 'linear-gradient(135deg,#101820,#1F3A3E)', boxShadow: '0 30px 60px rgba(16,24,32,0.4)', transform: 'rotate(-8deg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 22, boxSizing: 'border-box', color: '#F5F2EC' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 800 }}><img src="assets/nexbizrise-logo.png" style={{ height: 34 }} />NexBizRise</span>
          <span style={{ alignSelf: 'flex-end', fontSize: 20, fontWeight: 700, letterSpacing: '0.1em' }}>ARJUN MEHTA</span>
        </div>
      )}
      {pk > 0 && (
        <Phone cx={PC.x} cy={PC.y} s={PC.s} y={phoneY}>
          <Lock />
          <Screen src={IMG.re} y={lerp(SH, 0, cardUp)} pan={pan} z={2} />
          <Tap T={T} M={M} t={Me + 3.9} x={SW * 0.873} y={60} />
          <Sheet k={sheet} saved={saved} />
          {list > 0 && <div style={{ position: 'absolute', inset: 0, zIndex: 35, transform: `translateY(${lerp(SH, 0, list)}px)` }}><ContactsList hi={hi} /></div>}
          <Tap T={T} M={M} t={L + 2.3} x={SW * 0.4} y={545} />
          {chat > 0 && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: '#EFE7DE', display: 'flex', flexDirection: 'column', transform: `translateX(${lerp(SW, 0, chat)}px)` }}>
              <div style={{ height: 180, background: '#075E54', color: '#FFFFFF', display: 'flex', alignItems: 'flex-end', gap: 18, padding: '0 28px 24px' }}>
                <img src="assets/realtor.jpg" style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', objectPosition: '68% 25%' }} />
                <span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 32, fontWeight: 700 }}>Arjun Mehta</span><span style={{ fontSize: 22, opacity: 0.8 }}>online</span></span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 16, padding: '0 24px 60px' }}>
                {bubble(b1, true, 'Hi Arjun! Is the 3BHK in Baner still available?')}
                {typing && <div style={{ alignSelf: 'flex-start', padding: '18px 24px', borderRadius: 26, background: '#FFFFFF', display: 'flex', gap: 8 }}>{[0, 1, 2].map(d => <span key={d} style={{ width: 12, height: 12, borderRadius: '50%', background: '#9AA0A6', transform: `translateY(${Math.sin(T * 12 + d) * 4}px)` }}></span>)}</div>}
                {bubble(b2, false, 'Yes! Can you visit on Saturday at 11?')}
              </div>
              {fwd > 0 && (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 560, background: '#FFFFFF', borderRadius: '40px 40px 0 0', transform: `translateY(${(1 - fwd) * 600}px)`, padding: '30px 30px 0', display: 'flex', flexDirection: 'column', gap: 18, color: C.ink, boxShadow: '0 -20px 40px rgba(0,0,0,0.15)' }}>
                  <span style={{ fontSize: 34, fontWeight: 800 }}>Share Arjun's card</span>
                  {[['SN', 'Sneha (Office)', true], ['MA', 'Mom', false], ['RK', 'Rahul K', false]].map(([ini, n, on]) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 0' }}>
                      <span style={{ width: 70, height: 70, borderRadius: '50%', background: on ? '#25D366' : '#D9DDE2', color: on ? '#FFF' : C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>{on && T > R + 1.2 ? '✓' : ini}</span>
                      <span style={{ fontSize: 32, fontWeight: 600 }}>{n}</span>
                    </div>
                  ))}
                  <div style={{ height: 80, borderRadius: 40, background: sent > 0 ? '#E3F4EA' : '#25D366', color: sent > 0 ? C.green : '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, transform: `scale(${sent > 0 ? 0.9 + 0.1 * sent : 1})` }}>{sent > 0 ? 'Sent to Sneha ✓' : 'Send'}</div>
                </div>
              )}
              <Tap T={T} M={M} t={R + 1.1} x={80} y={SH - 560 + 125} />
              <Tap T={T} M={M} t={R + 1.7} x={SW / 2} y={SH - 80} />
            </div>
          )}
        </Phone>
      )}
      {T > R + 2.1 && T < O + 0.2 && (
        <div style={{ position: 'absolute', zIndex: 30, display: 'flex', alignItems: 'center', gap: 14, padding: '18px 26px', borderRadius: 40, background: '#FFFFFF', boxShadow: '0 18px 40px -16px rgba(16,24,32,0.35)', fontSize: 32, fontWeight: 700, opacity: M.pop(R + 2.1, R + 2.4), ...(V ? { left: 80, top: 1560 } : { left: 120, top: 640 }) }}>
          <span style={{ width: 44, height: 44, borderRadius: '50%', background: C.teal, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+1</span>
          New lead from Sneha
        </div>
      )}

      <End T={T} M={M} at={O} V={V} W={W} H={H} tagline="Be the one they remember." />
    </div>
  );
}
window.NBRAdD = makeAd(Piece);
