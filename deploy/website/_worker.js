// One Cloudflare Pages project serves both domains (same Supabase database):
//   nexbizrise.com / www.nexbizrise.com  -> website (index.html)
//   card.nexbizrise.com/order            -> card builder (order.html)
//   card.nexbizrise.com/<slug>           -> client card (card.html); the address bar keeps the slug
// Health check: /__health returns "ok" when this file is running.

async function asset(env, origin, path) {
  let res = await env.ASSETS.fetch(new Request(origin + path));
  for (let i = 0; i < 3 && res.status >= 300 && res.status < 400 && res.headers.get('location'); i++) {
    res = await env.ASSETS.fetch(new Request(new URL(res.headers.get('location'), origin).toString()));
  }
  return res;
}
async function html(env, origin, candidates) {
  for (const p of candidates) {
    const res = await asset(env, origin, p);
    if (res.ok) {
      const body = await res.arrayBuffer();
      return new Response(body, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' } });
    }
  }
  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (path === '/__health') return new Response('ok', { headers: { 'content-type': 'text/plain' } });
      if (path === '/__debug') {
        const out = {};
        for (const p of ['/', '/index.html', '/index', '/card.html', '/card', '/support.js']) {
          try { const r = await env.ASSETS.fetch(new Request(url.origin + p)); const t = await r.text(); out[p] = { status: r.status, type: r.headers.get('content-type'), location: r.headers.get('location'), length: t.length, start: t.slice(0, 40) }; }
          catch (e) { out[p] = { error: String(e) }; }
        }
        return new Response(JSON.stringify(out, null, 2), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
      }
      const isCard = url.hostname.startsWith('card.');
      let r = null;
      if (isCard && (path === '/order' || path === '/order/')) r = await html(env, url.origin, ['/order.html', '/order']);
      else if (isCard && (path === '/' || /^\/[a-z0-9]+(-[a-z0-9]+)*\/?$/.test(path))) r = await html(env, url.origin, ['/card.html', '/card']);
      else if (path === '/') r = await html(env, url.origin, ['/index.html', '/']);
      else if (/\.html$/.test(path)) r = await html(env, url.origin, [path, path.replace(/\.html$/, '')]);
      if (r) return r;
    } catch (e) {}
    return env.ASSETS.fetch(request);
  },
};
