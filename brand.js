/* NexBizRise brand: the ONE place for the logo, wordmark and brand colours.
   Change a value here and every page that uses <nbr-logo> updates.
   Pages load it with <x-import component-from-global-scope="nbr-logo" from="./brand.js" ...>. */
(function () {
  var BRAND = {
    name: ['NexBiz', 'Rise'],          // wordmark: first part in ink, second part in accent
    logo: 'assets/nexbizrise-logo.png',
    logoRatio: 58 / 44,                // width / height of the logo image
    colors: { ink: '#101820', accent: '#0B7C86', gold: '#B7893E', cream: '#F7F3EC', mint: '#EEF6F4', sand: '#F3E9D8' }
  };
  window.NBR_BRAND = BRAND;
  function root() {
    try { var s = document.currentScript && document.currentScript.src; if (s) return s.replace(/brand\.js(\?.*)?$/, ''); } catch (e) {}
    return '';
  }
  var BASE = root();
  if (window.customElements && !customElements.get('nbr-logo')) {
    customElements.define('nbr-logo', class extends HTMLElement {
      static get observedAttributes() { return ['height', 'font', 'mark-only']; }
      connectedCallback() { this.render(); }
      attributeChangedCallback() { this.render(); }
      render() {
        var h = parseFloat(this.getAttribute('height')) || 36, f = parseFloat(this.getAttribute('font')) || Math.round(h * 0.55);
        var src = /^(https?:)?\//.test(BRAND.logo) ? BRAND.logo : BASE + BRAND.logo;
        this.style.display = 'inline-flex'; this.style.alignItems = 'center'; this.style.gap = '6px'; this.style.color = 'var(--ink, ' + BRAND.colors.ink + ')';
        this.innerHTML = '<img src="' + src + '" alt="" width="' + Math.round(h * BRAND.logoRatio) + '" height="' + h + '" style="height:' + h + 'px;width:auto;flex:none;display:block;">' +
          (this.hasAttribute('mark-only') ? '' : '<span style="font-size:' + f + 'px;font-weight:800;letter-spacing:-0.02em;line-height:1;white-space:nowrap;">' + BRAND.name[0] + '<span style="color:var(--accent, ' + BRAND.colors.accent + ');">' + BRAND.name[1] + '</span></span>');
      }
    });
  }
})();
