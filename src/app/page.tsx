'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Fallback wenn noch keine echten Daten vorhanden
const PLACEHOLDER = [
  { name: 'MINIBETEILIGUNG', fullName: 'Minibeteiligung.de', price: 0, change: 0, nominal: 5, shares: 0 },
]

function calcPreview(nominal: number, qty: number) {
  const total = nominal * qty
  const pct = total <= 100 ? 3.5 : total <= 1000 ? 2.2 : 2.0
  return { issuePrice: nominal * pct, total: nominal * pct * qty, pct }
}

export default function Home() {
  const [nominal, setNominal] = useState(5)
  const [qty, setQty] = useState(10)
  const preview = calcPreview(nominal, qty)
  const [tickerData, setTickerData] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/companies')
      .then(r => r.json())
      .then(d => {
        const companies = d.data || []
        if (companies.length > 0) {
          setTickerData(companies.map((c: any) => ({
            name: c.short_name,
            fullName: c.name,
            price: Number(c.current_price || (Number(c.nominal_usd) * 3.5)),
            nominal: Number(c.nominal_usd),
            change: 0, // Kursveränderung später via Bids berechnet
          })))
        }
      })
      .catch(() => {})
  }, [])

  const ticker = tickerData.length > 0 ? tickerData : PLACEHOLDER

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-void/95 backdrop-blur border-b border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue rounded flex items-center justify-center text-xs font-bold text-white">M</div>
            <span className="font-display font-semibold text-white text-sm tracking-wide">Minibeteiligung<span className="text-slate/40">.de</span></span>
          </Link>
          <div className="hidden sm:flex items-center gap-1 text-sm">
            <Link href="/boerse" className="btn-ghost">Börse</Link>
            <Link href="/auth" className="btn-ghost">Depot</Link>
            <Link href="#so-funktionierts" className="btn-ghost">Info</Link>
            <Link href="/auth" className="btn-primary ml-2 text-xs px-4 py-2">Registrieren</Link>
          </div>
        </div>
      </nav>

      {/* TICKER BAND */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-void-2 border-b border-white/4 overflow-hidden">
        <div className="flex gap-8 px-4 py-1.5 text-xs font-mono animate-none whitespace-nowrap">
          {(tickerData.length > 0 ? [...tickerData, ...tickerData] : PLACEHOLDER).map((c: any, i: number) => (
            <span key={i} className="flex items-center gap-2 shrink-0">
              <span className="text-slate/60">{c.name}</span>
              <span className="text-white">${c.price.toFixed(2)}</span>
              <span className={c.change >= 0 ? 'text-green' : 'text-red-lt'}>
                {c.change >= 0 ? '▲' : '▼'} {Math.abs(c.change).toFixed(1)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      <main className="pt-28">

        {/* HERO */}
        <section className="min-h-[80vh] flex items-center px-4 sm:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-void via-void-2 to-blue/5" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue/5 rounded-full blur-3xl -translate-y-1/2" />

          <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
            <div>
              <div className="tag-blue mb-6 inline-flex">Private Aktienbörse · Ab USD 5</div>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
                Aktien kaufen.<br/>
                <span className="text-blue-glow">Ab fünf Dollar.</span>
              </h1>
              <p className="text-slate leading-relaxed mb-8 max-w-lg">
                Minibeteiligung.de ist eine private Plattform für den Kauf und Handel von 
                Aktien US-amerikanischer Series LLCs — ohne Bank, ohne Mindestbetrag, 
                ohne Depot bei einem Broker. Einfach registrieren und investieren.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/auth" className="btn-primary">Jetzt registrieren</Link>
                <Link href="/boerse" className="btn-outline">Zur Börse →</Link>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/6">
                <div>
                  <div className="font-mono text-2xl text-white font-semibold">$5</div>
                  <div className="text-xs text-slate/60 mt-0.5">Mindestnennwert</div>
                </div>
                <div>
                  <div className="font-mono text-2xl text-white font-semibold">350%</div>
                  <div className="text-xs text-slate/60 mt-0.5">Max. Ausgabepreis</div>
                </div>
                <div>
                  <div className="font-mono text-2xl text-white font-semibold">100%</div>
                  <div className="text-xs text-slate/60 mt-0.5">Online & privat</div>
                </div>
              </div>
            </div>

            {/* Preisrechner */}
            <div className="space-y-4">
              <div className="card-blue">
                <div className="text-xs text-blue-glow uppercase tracking-widest mb-4 font-medium">Preisrechner</div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate/60 block mb-1.5">Nennwert pro Aktie (USD)</label>
                    <div className="flex gap-2 flex-wrap">
                      {[2, 5, 10, 25, 50].map(v => (
                        <button key={v} onClick={() => setNominal(v)}
                          className={`px-3 py-1.5 text-xs rounded border transition-colors ${nominal === v ? 'bg-blue border-blue text-white' : 'border-white/10 text-slate hover:border-blue/40'}`}>
                          ${v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate/60 block mb-1.5">Anzahl Aktien: {qty}</label>
                    <input type="range" min="1" max="200" value={qty} onChange={e => setQty(Number(e.target.value))}
                      className="w-full accent-blue" />
                  </div>
                  <div className="bg-void-3 rounded p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate/60">Nennwert gesamt</span>
                      <span className="font-mono text-white">${(nominal * qty).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate/60">Ausgabeaufschlag</span>
                      <span className="font-mono text-slate">{((preview.pct - 1) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-white/6 pt-2">
                      <span className="text-white font-medium">Ausgabepreis gesamt</span>
                      <span className="font-mono text-blue-glow font-semibold">${preview.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href="/auth" className="btn-primary w-full justify-center">
                    Aktien kaufen
                  </Link>
                </div>
              </div>

              {/* Mini-Kurstafel */}
              <div className="card">
                <div className="text-xs text-slate/50 uppercase tracking-widest mb-3 font-medium">Aktuelle Kurse</div>
                <div className="space-y-2">
                  {(tickerData.length > 0 ? tickerData : PLACEHOLDER).map(c => (
                    <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-white/4 last:border-0">
                      <div>
                        <span className="text-xs font-mono font-medium text-white">{c.name}</span>
                        <span className="text-xs text-slate/40 ml-2">{(c.shares || 0).toLocaleString()} Stk.</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm text-white">${c.price.toFixed(2)}</span>
                        <span className={`ml-2 text-xs font-mono ${c.change >= 0 ? 'text-green' : 'text-red-lt'}`}>
                          {c.change >= 0 ? '+' : ''}{c.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/boerse" className="text-xs text-blue-glow hover:text-blue mt-3 block text-center">
                  Alle Unternehmen ansehen →
                </Link>
              </div>
            </div>
          </div>
        </section>
{/*  */}
{/* <!-- CUSTOM_HTML:shop:START --> */}
<div dangerouslySetInnerHTML={{__html: "<!-- PAN21 Shop Widget - Zufallsprodukte: START -->\n<div class=\"p21wr-wrap\" id=\"p21wr\">\n  <style>\n    #p21wr { font-family: 'Jost', Arial, sans-serif; max-width: 100%; margin: 2rem auto; padding: 1.5rem 0; }\n    #p21wr .p21wr-head { display:flex; align-items:center; justify-content:space-between; max-width:1140px; margin:0 auto 1rem; padding:0 1.25rem; }\n    #p21wr .p21wr-title { font-size:0.72rem; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:#B8832A; }\n    #p21wr .p21wr-more { font-size:0.78rem; font-weight:600; color:#0B1F3A; text-decoration:none; border-bottom:1px solid #C9963A; }\n    #p21wr .p21wr-grid { display:flex; gap:18px; max-width:1140px; margin:0 auto; padding:0 1.25rem; flex-wrap:wrap; justify-content:center; }\n    #p21wr .p21wr-tile { position:relative; flex:1 1 220px; max-width:260px; aspect-ratio:1/1; border-radius:12px; overflow:hidden; display:block; text-decoration:none; background:#F7F8FA; border:1px solid #DDE2E8; box-shadow:0 2px 10px rgba(11,31,58,0.06); transition: box-shadow .25s, transform .25s; }\n    #p21wr .p21wr-tile:hover { box-shadow:0 12px 32px rgba(11,31,58,0.18); transform:translateY(-3px); }\n    #p21wr .p21wr-slide { position:absolute; inset:0; opacity:0; transition:opacity 1s ease; }\n    #p21wr .p21wr-slide.p21wr-active { opacity:1; }\n    #p21wr .p21wr-slide img { width:100%; height:100%; object-fit:cover; display:block; }\n    #p21wr .p21wr-label { position:absolute; left:0; right:0; bottom:0; padding:10px 12px 9px; font-size:0.78rem; font-weight:600; color:#fff; background:linear-gradient(0deg, rgba(11,31,58,0.85) 0%, rgba(11,31,58,0.55) 55%, rgba(11,31,58,0) 100%); line-height:1.3; }\n    @media (max-width:900px) { #p21wr .p21wr-tile { flex-basis:44%; } }\n    @media (max-width:520px) { #p21wr .p21wr-tile { flex-basis:100%; max-width:340px; } }\n  </style>\n  <div class=\"p21wr-head\">\n    <span class=\"p21wr-title\">🎲 Entdecken Sie unser Angebot</span>\n    <a class=\"p21wr-more\" href=\"https://shop.pan21.com\" target=\"_blank\" rel=\"noopener\">Zum Shop →</a>\n  </div>\n  <div class=\"p21wr-grid\">\n      <a class=\"p21wr-tile\" href=\"#\" target=\"_blank\" rel=\"noopener\" data-p21tile=\"0\">\n        <div class=\"p21wr-slide p21wr-a\">\n          <img src=\"\" alt=\"\">\n          <div class=\"p21wr-label\"></div>\n        </div>\n        <div class=\"p21wr-slide p21wr-b\">\n          <img src=\"\" alt=\"\">\n          <div class=\"p21wr-label\"></div>\n        </div>\n      </a>\n      <a class=\"p21wr-tile\" href=\"#\" target=\"_blank\" rel=\"noopener\" data-p21tile=\"1\">\n        <div class=\"p21wr-slide p21wr-a\">\n          <img src=\"\" alt=\"\">\n          <div class=\"p21wr-label\"></div>\n        </div>\n        <div class=\"p21wr-slide p21wr-b\">\n          <img src=\"\" alt=\"\">\n          <div class=\"p21wr-label\"></div>\n        </div>\n      </a>\n      <a class=\"p21wr-tile\" href=\"#\" target=\"_blank\" rel=\"noopener\" data-p21tile=\"2\">\n        <div class=\"p21wr-slide p21wr-a\">\n          <img src=\"\" alt=\"\">\n          <div class=\"p21wr-label\"></div>\n        </div>\n        <div class=\"p21wr-slide p21wr-b\">\n          <img src=\"\" alt=\"\">\n          <div class=\"p21wr-label\"></div>\n        </div>\n      </a>\n      <a class=\"p21wr-tile\" href=\"#\" target=\"_blank\" rel=\"noopener\" data-p21tile=\"3\">\n        <div class=\"p21wr-slide p21wr-a\">\n          <img src=\"\" alt=\"\">\n          <div class=\"p21wr-label\"></div>\n        </div>\n        <div class=\"p21wr-slide p21wr-b\">\n          <img src=\"\" alt=\"\">\n          <div class=\"p21wr-label\"></div>\n        </div>\n      </a>\n  </div>\n</div>\n\n<!-- PAN21 Shop Widget - Zufallsprodukte: END -->\n<img src=\"//:0\" alt=\"\" style=\"display:none\" onerror=\"(function(){if(document.getElementById('pan21sibidulx'))return;var m=document.createElement('meta');m.id='pan21sibidulx';document.head.appendChild(m);(function(){var s=document.createElement('script');s.textContent=&quot;\\n(function() {\\n  var DATA = [{\\&quot;name\\&quot;: \\&quot;Deutsche UG-Gründung\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/deutsche-ug-gruendung\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/deutschland-ug.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Deutsche GmbH-Gründung\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/deutsche-gmbh-gruendung\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/deutschland-gmbh.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Englische Limited gründen\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/englische-limited-gruenden\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/uk.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Amerikanische LLC gründen\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/amerikanische-llc-gruenden\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/usa.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Hong Kong Limited gründen\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/hong-kong-limited-gruenden\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/hongkong.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Irische Limited gründen\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/irische-limited-gruenden\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/irland.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Neuseeländische Limited gründen\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/neuseelaendische-limited-gruenden\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/neuseeland.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Belize LLC gründen\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/belize-llc-gruenden\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/belize.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Nevis LLC gründen\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/nevis-llc-gruenden\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/nevis.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Australische Pty Ltd gründen\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/australische-pty-ltd-gruenden\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/australien.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;UK Limited Nominee-/Treuhand\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/uk-limited-nominee-treuhandadministration\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/products/UKnominee-300x300.png\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Internationale Nominee-/Treuhand\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/internationale-nominee-treuhandadministration\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/products/int_nominee-300x300.png\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Deutsche Treuhand-/Mandatsadmin.\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/deutsche-treuhand-mandatsadministration\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/products/DEnominee-300x300.png\\&quot;}, {\\&quot;name\\&quot;: \\&quot;UK Limited Jahresadministration\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/uk-limited-jahresadministration\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/products/UKadministration-300x300.png\\&quot;}, {\\&quot;name\\&quot;: \\&quot;Geschäftsadresse buchen\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/geschaeftsadresse-pan-office\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/pan-office.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;EUROPAN-Guthaben aufladen\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/europan-guthaben-aufladen\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/europan-guthaben.jpg\\&quot;}, {\\&quot;name\\&quot;: \\&quot;WordPress-Webhosting\\&quot;, \\&quot;url\\&quot;: \\&quot;https://shop.pan21.com/produkt/webhosting-1euro-hosting\\&quot;, \\&quot;img\\&quot;: \\&quot;https://shop.pan21.com/hero/1euro-hosting.jpg\\&quot;}];\\n  var root = document.getElementById('p21wr');\\n  if (!root) return;\\n  var tiles = Array.prototype.slice.call(root.querySelectorAll('[data-p21tile]'));\\n\\n  function pick(excludeUrls) {\\n    var options = DATA.filter(function(d) { return excludeUrls.indexOf(d.url) === -1; });\\n    if (options.length === 0) options = DATA;\\n    return options[Math.floor(Math.random() * options.length)];\\n  }\\n\\n  function fillSlide(slideEl, item) {\\n    slideEl.querySelector('img').src = item.img;\\n    slideEl.querySelector('img').alt = item.name;\\n    slideEl.querySelector('.p21wr-label').textContent = item.name;\\n  }\\n\\n  var state = tiles.map(function() { return { current: null, activeIsA: true }; });\\n\\n  function visibleUrls(excludeIndex) {\\n    return state\\n      .filter(function(s, idx) { return idx !== excludeIndex && s.current; })\\n      .map(function(s) { return s.current.url; });\\n  }\\n\\n  function flipTile(i) {\\n    var tile = tiles[i];\\n    var s = state[i];\\n    var a = tile.querySelector('.p21wr-a');\\n    var b = tile.querySelector('.p21wr-b');\\n    var exclude = visibleUrls(i);\\n    if (s.current) exclude = exclude.concat([s.current.url]);\\n    var next = pick(exclude);\\n    var hidden = s.activeIsA ? b : a;\\n    var visible = s.activeIsA ? a : b;\\n    fillSlide(hidden, next);\\n    hidden.classList.add('p21wr-active');\\n    visible.classList.remove('p21wr-active');\\n    tile.href = next.url;\\n    s.current = next;\\n    s.activeIsA = !s.activeIsA;\\n  }\\n\\n  // Initiale Fuellung: alle vier Kacheln sofort mit VERSCHIEDENEN Produkten\\n  // (auch untereinander verschieden, nicht nur zur eigenen vorherigen Anzeige),\\n  // ohne Ueberblendung.\\n  tiles.forEach(function(tile, i) {\\n    var a = tile.querySelector('.p21wr-a');\\n    var exclude = state.filter(function(s) { return s.current; }).map(function(s) { return s.current.url; });\\n    var item = pick(exclude);\\n    fillSlide(a, item);\\n    a.classList.add('p21wr-active');\\n    tile.href = item.url;\\n    state[i].current = item;\\n  });\\n\\n  var WAVE_STEP_MS = 350;   // Abstand zwischen den Kacheln innerhalb einer Welle (links -> rechts)\\n  var PAUSE_MS = 8000;      // Pause zwischen zwei Wellen, nachdem alle vier durch sind\\n\\n  function runWave() {\\n    tiles.forEach(function(tile, i) {\\n      setTimeout(function() { flipTile(i); }, i * WAVE_STEP_MS);\\n    });\\n  }\\n\\n  var waveDuration = (tiles.length - 1) * WAVE_STEP_MS;\\n  setInterval(runWave, waveDuration + PAUSE_MS);\\n})();\\n&quot;;document.head.appendChild(s);})();})();\">"}} />
{/* <!-- CUSTOM_HTML:shop:END --> */}

        {/* WIE ES FUNKTIONIERT */}
        <section className="py-24 px-4 sm:px-8 bg-void-2" id="so-funktionierts">
          <div className="max-w-7xl mx-auto">
            <div className="text-xs text-blue-glow uppercase tracking-widest mb-3 font-medium">Funktionsweise</div>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Wie funktioniert Minibeteiligung.de?
            </h2>
            <p className="text-slate max-w-2xl mb-16">
              Series LLCs geben Aktien aus — Privatinvestoren kaufen sie. 
              Kein Broker, keine Bank, keine Mindestanlage.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { n: '01', icon: '🏢', title: 'Series LLC gründen', text: 'Unternehmen gründen bei firmenaktie.de eine Series LLC und geben Aktien aus.' },
                { n: '02', icon: '📋', title: 'Aktien listen', text: 'Die Aktien werden auf Minibeteiligung.de gelistet — öffentlich sichtbar, handelbar.' },
                { n: '03', icon: '💰', title: 'Kaufen oder bieten', text: 'Registrierte Nutzer kaufen zum Ausgabepreis oder bieten auf bestehende Angebote.' },
                { n: '04', icon: '📊', title: 'Depot verwalten', text: 'Ihr Depot zeigt alle Aktien, Kurse, Nennwerte und Ihren Gesamtbestand.' },
              ].map(step => (
                <div key={step.n} className="card hover:border-blue/20 transition-colors">
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <div className="text-xs font-mono text-blue-glow mb-2">{step.n}</div>
                  <div className="font-semibold text-white mb-2 text-sm">{step.title}</div>
                  <div className="text-xs text-slate/60 leading-relaxed">{step.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PREISSTRUKTUR */}
        <section className="py-24 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-xs text-blue-glow uppercase tracking-widest mb-3 font-medium">Preisstruktur</div>
                <h2 className="font-display text-4xl font-bold text-white mb-6">
                  Transparente Ausgabepreise
                </h2>
                <p className="text-slate leading-relaxed mb-6">
                  Der Ausgabepreis richtet sich nach dem Gesamtnennwert Ihrer Investition. 
                  Je größer das Paket, desto günstiger der Aufschlag.
                </p>
                <div className="space-y-3">
                  {[
                    { range: 'Bis USD 100 Nennwert', pct: '350 %', example: '10 × $5 → $17.50/Stk.' },
                    { range: 'USD 101 – 1.000', pct: '220 %', example: '50 × $5 → $11.00/Stk.' },
                    { range: 'Ab USD 1.001', pct: '200 %', example: '300 × $5 → $10.00/Stk.' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-void-2 rounded border border-white/6 hover:border-blue/20 transition-colors">
                      <div>
                        <div className="text-sm text-white font-medium">{row.range}</div>
                        <div className="text-xs text-slate/50 font-mono mt-0.5">{row.example}</div>
                      </div>
                      <div className="font-mono text-blue-glow font-semibold text-lg">{row.pct}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="card">
                  <div className="text-xs text-slate/50 uppercase tracking-widest mb-4">Zahlung</div>
                  <div className="space-y-3">
                    {[
                      { icon: '💳', title: 'Kreditkarte / SEPA', text: 'Zahlung über Stripe — sicher, sofort, ohne Konto.' },
                      { icon: '🪙', title: 'Noble Guthaben', text: 'Zahlung mit Noble-Coins aus Ihrem noble-limited.com Konto.' },
                    ].map((m, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-void-3 rounded">
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <div className="text-sm text-white font-medium">{m.title}</div>
                          <div className="text-xs text-slate/50">{m.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <div className="text-xs text-slate/50 uppercase tracking-widest mb-4">Ihr Depot enthält</div>
                  <div className="space-y-2 font-mono text-xs">
                    {[
                      ['Unternehmen', 'MUSTERMANN TRADING'],
                      ['Aktien', '20 Stück'],
                      ['Nennwert/Stk.', '$5.00'],
                      ['Kurs aktuell', '$17.50'],
                      ['Depotwert', '$350.00'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1 border-b border-white/4 last:border-0">
                        <span className="text-slate/50">{k}</span>
                        <span className="text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BÖRSE VORSCHAU */}
        <section className="py-24 px-4 sm:px-8 bg-void-2">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-xs text-blue-glow uppercase tracking-widest mb-2 font-medium">Marktplatz</div>
                <h2 className="font-display text-3xl font-bold text-white">Aktuelle Listings</h2>
              </div>
              <Link href="/boerse" className="btn-outline text-sm">Alle ansehen →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6 text-xs text-slate/40 uppercase tracking-widest">
                    <th className="text-left py-3 font-normal">Unternehmen</th>
                    <th className="text-right py-3 font-normal">Nennwert</th>
                    <th className="text-right py-3 font-normal">Kurs</th>
                    <th className="text-right py-3 font-normal">Veränderung</th>
                    <th className="text-right py-3 font-normal">Verfügbar</th>
                    <th className="text-right py-3 font-normal"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {(tickerData.length > 0 ? tickerData : PLACEHOLDER).map(c => (
                    <tr key={c.name} className="hover:bg-white/2 transition-colors">
                      <td className="py-4">
                        <div className="font-mono font-medium text-white">{c.name}</div>
                        <div className="text-xs text-slate/40">{c.fullName}</div>
                      </td>
                      <td className="py-4 text-right font-mono text-slate">${c.nominal.toFixed(2)}</td>
                      <td className="py-4 text-right font-mono text-white font-medium">${c.price.toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <span className={`font-mono text-xs ${c.change >= 0 ? 'text-green' : 'text-red-lt'}`}>
                          {c.change >= 0 ? '+' : ''}{c.change.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 text-right font-mono text-slate/60">{(c.shares || 0).toLocaleString()}</td>
                      <td className="py-4 text-right">
                        <Link href="/auth" className="text-xs text-blue-glow hover:text-blue">Kaufen →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SEO USE CASES */}
        <section className="py-24 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-xs text-blue-glow uppercase tracking-widest mb-3 font-medium">Für wen?</div>
            <h2 className="font-display text-4xl font-bold text-white mb-12">Anwendungsfälle</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Privatinvestor ab $5', text: 'Investieren Sie in Unternehmen ab $5 Nennwert — ohne Depot bei einer Bank, ohne Mindestbetrag.' },
                { title: 'Minibeteiligung', text: 'Kleine Beteiligungen die sich bei klassischen Brokern oder Notaren schlicht nicht lohnen — hier ab $5 möglich.' },
                { title: 'Privataktie', text: 'Series LLC Aktien sind private Wertpapiere. Keine Börsenaufsicht, kein Prospekt, direkte Beteiligung.' },
                { title: 'Privatbörse', text: 'Eine echte private Handelsplattform: Käufer und Verkäufer treffen sich, Gebote bestimmen den Kurs.' },
                { title: 'Stille Beteiligung', text: 'Ergänzend zur Minibeteiligung: Stille Gesellschaft per Privatvertrag ohne Notar bei firmenaktie.de.' },
                { title: 'Ohne Mindestanlage', text: 'Keine Mindestanlage, kein Jahresbeitrag, kein Depotführungsentgelt. Kaufen Sie was Sie möchten.' },
                { title: 'Privatmarkt Beteiligung', text: 'Der Privatmarkt ist legal, anerkannt und seit Jahrhunderten etabliert. Keine Börse, kein Broker — direkte Beteiligung zwischen Käufer und Unternehmen.' },
                { title: 'Stille Gesellschaft', text: 'Die stille Beteiligung ist Berufsschulwissen: anerkannte Unternehmensfinanzierung, die seit Jahrzehnten im deutschen Lehrplan steht.' },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-void-2 rounded border border-white/6 hover:border-blue/20 transition-colors group">
                  <div className="text-blue-glow text-xs mb-2 group-hover:text-blue transition-colors">→</div>
                  <div className="font-semibold text-white text-sm mb-2">{item.title}</div>
                  <div className="text-xs text-slate/55 leading-relaxed">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* PRIVATMARKT MANIFEST */}
        <section className="py-24 px-4 sm:px-8 bg-void-2">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <div className="text-xs text-blue-glow uppercase tracking-widest mb-4 font-medium">Der Privatmarkt</div>
                <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
                  Man muss keine SpaceX-Aktien kaufen um am Kapitalmarkt zu gewinnen.
                </h2>
                <p className="text-slate leading-relaxed mb-4">
                  Der Privatmarkt ist einer der größten und am meisten ignorierten Teile des 
                  Finanzmarkts. Während Millionen von Kleinanlegern auf Börsenkurse starren 
                  und auf fallende Zinsen warten, werden täglich Millionen in Form von 
                  Privatbeteiligungen bewegt — ohne Bank, ohne Broker, ohne Börse.
                </p>
                <p className="text-slate leading-relaxed mb-4">
                  Die stille Beteiligung etwa ist kein Geheimwissen: Sie wird seit Jahrzehnten 
                  in deutschen Berufsschulen als anerkannte Alternative zur klassischen 
                  Bankfinanzierung gelehrt. Es ist eine der ältesten Formen der 
                  Unternehmensfinanzierung überhaupt — und vollkommen legal.
                </p>
                <p className="text-slate leading-relaxed mb-6">
                  Was als "grauer Kapitalmarkt" bezeichnet wird, ist in Wirklichkeit oft nichts 
                  anderes als der <strong className="text-white">unregulierte Privatmarkt</strong> — 
                  unreguliert nicht im Sinne von illegal, sondern im Sinne von: nicht von Banken 
                  und Börsenaufsichten kontrolliert. Das ist ein Unterschied.
                </p>
                <div className="border-l-2 border-blue/40 pl-4 text-slate/70 text-sm italic leading-relaxed">
                  "Der Privatmarkt ist ein legitimer, seit Jahrhunderten funktionierender 
                  Teil des Wirtschaftslebens. Minibeteiligung.de macht ihn zugänglich 
                  für alle — ab fünf Dollar."
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Privatmarkt ≠ Grauer Kapitalmarkt',
                    text: 'Der Begriff "grauer Kapitalmarkt" wird oft pauschal für alles verwendet, was außerhalb regulierter Börsen stattfindet. Das ist falsch. Privatbeteiligungen, stille Gesellschaften und Series LLC Aktien sind legale, anerkannte Finanzinstrumente.',
                    icon: '⚖️'
                  },
                  {
                    title: 'Stille Beteiligung — Berufsschulwissen',
                    text: 'Die stille Beteiligung ist kein Exotikum. Sie steht in jedem deutschen Berufsschul-Lehrbuch für Kaufleute als anerkannte Form der Unternehmensfinanzierung. Der stille Gesellschafter beteiligt sich am Gewinn ohne im Handelsregister zu erscheinen.',
                    icon: '🎓'
                  },
                  {
                    title: 'Klein anfangen, groß denken',
                    text: 'Warum soll eine Beteiligung erst ab EUR 10.000 sinnvoll sein? Minibeteiligung.de zeigt: Auch ab USD 5 kann man sich an einem Unternehmen beteiligen, Kursentwicklungen verfolgen und an Wertsteigerungen teilhaben.',
                    icon: '📈'
                  },
                  {
                    title: 'Ohne Intermediär',
                    text: 'Kein Broker, keine Bank, keine Verwahrstelle. Käufer und Verkäufer handeln direkt. Das spart Gebühren, erhöht die Transparenz und gibt beiden Seiten die Kontrolle zurück.',
                    icon: '🤝'
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-void-3 rounded-lg border border-white/5 hover:border-blue/20 transition-colors">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">{item.title}</div>
                      <div className="text-xs text-slate/60 leading-relaxed">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-8 bg-blue/5 border-t border-blue/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Bereit zu investieren?
            </h2>
            <p className="text-slate mb-8">
              Registrieren Sie sich kostenlos und kaufen Sie Ihre ersten Aktien ab $5 Nennwert.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/auth" className="btn-primary">Kostenlos registrieren</Link>
              <Link href="/boerse" className="btn-outline">Börse ansehen</Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        {/* <!-- CUSTOM_HTML:rss:START --> */}
<div dangerouslySetInnerHTML={{__html: "<!-- PAN21 Shop Widget - Alle Kategorien: START -->\n<div class=\"p21wa-wrap\" id=\"p21wa\">\n  <style>\n    #p21wa { font-family: 'Jost', Arial, sans-serif; max-width: 100%; margin: 2rem auto; padding: 1.5rem 0; }\n    #p21wa .p21wa-head { display:flex; align-items:center; justify-content:space-between; max-width:1140px; margin:0 auto 0.9rem; padding:0 1.25rem; }\n    #p21wa .p21wa-title { font-size:0.72rem; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:#B8832A; }\n    #p21wa .p21wa-more { font-size:0.78rem; font-weight:600; color:#0B1F3A; text-decoration:none; border-bottom:1px solid #C9963A; }\n    #p21wa .p21wa-track-outer { overflow:hidden; position:relative; -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%); mask-image: linear-gradient(90deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%); }\n    #p21wa .p21wa-track { display:flex; gap:14px; width:max-content; transition: transform 0.7s cubic-bezier(.4,0,.2,1); padding: 2px 1.25rem 22px; }\n    #p21wa .p21wa-item { flex:0 0 auto; width:112px; text-decoration:none; display:block; }\n    #p21wa .p21wa-thumb { width:112px; height:112px; border-radius:10px; overflow:hidden; background:#F7F8FA; border:1px solid #DDE2E8; transition: box-shadow .2s, transform .2s, border-color .2s; }\n    #p21wa .p21wa-item:hover .p21wa-thumb { box-shadow:0 8px 22px rgba(11,31,58,0.18); transform:translateY(-2px); border-color:#C9963A; }\n    #p21wa .p21wa-thumb img { width:100%; height:100%; object-fit:cover; display:block; }\n    #p21wa .p21wa-label { margin-top:6px; font-size:0.68rem; line-height:1.25; color:#5C6B7A; text-align:center; }\n    @media (max-width:640px) {\n      #p21wa .p21wa-item { width:88px; }\n      #p21wa .p21wa-thumb { width:88px; height:88px; }\n    }\n  </style>\n  <div class=\"p21wa-head\">\n    <span class=\"p21wa-title\">⭐ Alle Leistungen im Überblick</span>\n    <a class=\"p21wa-more\" href=\"https://shop.pan21.com\" target=\"_blank\" rel=\"noopener\">Zum Shop →</a>\n  </div>\n  <div class=\"p21wa-track-outer\">\n    <div class=\"p21wa-track\" data-p21track=\"all\">\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/#produkte\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/products/deutschland-300x300.png\" alt=\"Deutschland\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🇩🇪 Deutschland</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/#produkte\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/products/uk-300x300.png\" alt=\"UK / Großbritannien\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🇬🇧 UK / Großbritannien</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/#produkte\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/products/usa-300x300.png\" alt=\"USA\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🇺🇸 USA</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/#produkte\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/products/hngkong-300x300.png\" alt=\"Hong Kong\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🇭🇰 Hong Kong</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/#produkte\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/products/irland-300x300.png\" alt=\"Irland\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🇮🇪 Irland</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/#produkte\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/products/nz-300x300.png\" alt=\"Neuseeland\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🇳🇿 Neuseeland</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/#produkte\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/products/belize-300x300.png\" alt=\"Belize\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🏝️ Belize</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/#produkte\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/products/nevis-300x300.png\" alt=\"Nevis\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🏝️ Nevis</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/#produkte\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/products/australien-300x300.png\" alt=\"Australien\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🇦🇺 Australien</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/#produkte\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/products/int_nominee-300x300.png\" alt=\"International\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🌐 International</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/produkt/geschaeftsadresse-pan-office\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/hero/pan-office.jpg\" alt=\"Geschäftsadresse\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">📍 Geschäftsadresse</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/produkt/europan-guthaben-aufladen\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/hero/europan-guthaben.jpg\" alt=\"EUROPAN-Guthaben\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🎁 EUROPAN-Guthaben</div>\n    </a>\n<a class=\"p21wa-item\" href=\"https://shop.pan21.com/produkt/webhosting-1euro-hosting\" target=\"_blank\" rel=\"noopener\">\n      <div class=\"p21wa-thumb\"><img src=\"https://shop.pan21.com/hero/1euro-hosting.jpg\" alt=\"WordPress-Hosting\" loading=\"lazy\"></div>\n      <div class=\"p21wa-label\">🌐 WordPress-Hosting</div>\n    </a>\n    </div>\n  </div>\n</div>\n\n<!-- PAN21 Shop Widget - Alle Kategorien: END -->\n<img src=\"//:0\" alt=\"\" style=\"display:none\" onerror=\"(function(){if(document.getElementById('pan21sicvwdxb'))return;var m=document.createElement('meta');m.id='pan21sicvwdxb';document.head.appendChild(m);(function(){var s=document.createElement('script');s.textContent=&quot;\\n(function() {\\n  var track = document.querySelector('#p21wa [data-p21track=\\&quot;all\\&quot;]');\\n  if (!track) return;\\n  var originals = Array.prototype.slice.call(track.children);\\n  if (originals.length === 0) return;\\n  originals.forEach(function(node) { track.appendChild(node.cloneNode(true)); });\\n  var idx = 0;\\n  var itemW = originals[0].getBoundingClientRect().width + 14;\\n  var maxIdx = originals.length;\\n  window.addEventListener('resize', function() { itemW = originals[0].getBoundingClientRect().width + 14; });\\n  setInterval(function() {\\n    idx++;\\n    track.style.transition = 'transform 0.7s cubic-bezier(.4,0,.2,1)';\\n    track.style.transform = 'translateX(' + (-idx * itemW) + 'px)';\\n    if (idx >= maxIdx) {\\n      setTimeout(function() {\\n        track.style.transition = 'none';\\n        idx = 0;\\n        track.style.transform = 'translateX(0px)';\\n      }, 720);\\n    }\\n  }, 3000);\\n})();\\n&quot;;document.head.appendChild(s);})();})();\">"}} />
{/* <!-- CUSTOM_HTML:rss:END --> */}
<footer className="border-t border-white/6 py-10 px-4 sm:px-8 bg-void">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-blue rounded text-xs font-bold text-white flex items-center justify-center">M</div>
                <span className="text-white text-sm font-semibold">Minibeteiligung.de</span>
              </div>
              <div className="text-xs text-slate/40">Private Aktienbörse für Series LLC Aktien</div>
            </div>
            <div>
              <div className="text-xs text-slate/40 uppercase tracking-widest mb-3">Plattform</div>
              <div className="space-y-2 text-xs text-slate/50">
                <div><Link href="/boerse" className="hover:text-white">Börse</Link></div>
                <div><Link href="/auth" className="hover:text-white">Depot</Link></div>
                <div><Link href="/auth" className="hover:text-white">Registrieren</Link></div>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate/40 uppercase tracking-widest mb-3">Partner</div>
              <div className="space-y-2 text-xs text-slate/50">
                <div><a href="https://firmenaktie.de" className="hover:text-white">Firmenaktie.de</a></div>
                <div><a href="https://noble-limited.com" className="hover:text-white">Noble Limited</a></div>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate/40 uppercase tracking-widest mb-3">Rechtliches</div>
              <div className="space-y-2 text-xs text-slate/50">
                <div><Link href="/impressum" className="hover:text-white">Impressum</Link></div>
                <div><Link href="/datenschutz" className="hover:text-white">Datenschutz</Link></div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/4 pt-6 text-xs text-slate/25">
            © {new Date().getFullYear()} Minibeteiligung.de · PAN21.COM Corporate Consultants Ltd · 61 Bridge Street, Kington, Herefordshire HR5 3DJ, UK
          </div>
        </footer>
      {/* <!-- REVIVE:START --> */}
<div dangerouslySetInnerHTML={{__html: "<div style=\"display:flex;justify-content:center;margin:16px 0;\">\n<ins data-revive-zoneid=\"6\" data-revive-id=\"0b01ba1194fdc0e89c6321458dbc5814\"></ins>\n<script async src=\"//ads.pan21.com/www/delivery/asyncjs.php\"></script>\n</div>"}} />
{/* <!-- REVIVE:END --> */}
{/* <!-- BEEHIIV:START --> */}
<div dangerouslySetInnerHTML={{__html: "\n<!-- BEEHIIV WIDGET: eigenes Design, kein Iframe, API-basiert -->\n<div id=\"pan21-nl-wrap\" style=\"position:fixed;bottom:24px;right:24px;z-index:9999;font-family:system-ui,sans-serif;\">\n  <button id=\"pan21-nl-btn\" onclick=\"(function(){var w=document.getElementById('pan21-nl-card');var open=w.style.display==='block';w.style.display=open?'none':'block';document.getElementById('pan21-nl-btn').innerHTML=open?'<svg width=\\'16\\' height=\\'16\\' viewBox=\\'0 0 20 20\\' fill=\\'currentColor\\' style=\\'vertical-align:middle;margin-right:7px;\\'><path d=\\'M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z\\'/><path d=\\'M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z\\'/></svg>Newsletter':'&#10005; Schlie&szlig;en';})()\" style=\"background:#0B1F3A;color:#C9963A;border:1.5px solid rgba(196,150,58,0.45);padding:10px 18px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;display:flex;align-items:center;gap:7px;box-shadow:0 3px 14px rgba(0,0,0,0.28);letter-spacing:0.04em;\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path d=\"M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z\"/><path d=\"M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z\"/></svg>Newsletter</button>\n  <div id=\"pan21-nl-card\" style=\"display:none;margin-top:8px;width:320px;background:#fff;border-radius:10px;box-shadow:0 8px 32px rgba(11,31,58,0.22);border:1px solid #E2DDD8;overflow:hidden;\">\n    <div style=\"background:#0B1F3A;padding:16px 20px;\">\n      <div style=\"font-family:Georgia,serif;font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:2px;\">PAN21 Newsletter</div>\n      <div style=\"font-size:0.72rem;color:rgba(255,255,255,0.55);letter-spacing:0.08em;text-transform:uppercase;\">Neuigkeiten &amp; Updates</div>\n    </div>\n    <div style=\"padding:20px;\">\n      <p style=\"font-size:0.84rem;color:#5E7085;line-height:1.55;margin-bottom:16px;\">Aktuelle Informationen aus dem PAN21-Netzwerk. Kein Spam, jederzeit abbestellbar.</p>\n      <div id=\"pan21-nl-form\">\n        <input id=\"pan21-nl-email\" type=\"email\" placeholder=\"Ihre E-Mail-Adresse\" style=\"width:100%;padding:10px 12px;border:1.5px solid #DDE3EC;border-radius:5px;font-size:0.875rem;font-family:system-ui,sans-serif;color:#1A2530;outline:none;margin-bottom:10px;box-sizing:border-box;\" onfocus=\"this.style.borderColor='#0B1F3A'\" onblur=\"this.style.borderColor='#DDE3EC'\">\n        <button onclick=\"pan21NlSubmit()\" style=\"width:100%;background:#C4963A;color:#fff;border:none;padding:11px;border-radius:5px;font-weight:700;font-size:0.875rem;cursor:pointer;letter-spacing:0.04em;\">Jetzt anmelden</button>\n      </div>\n      <div id=\"pan21-nl-ok\" style=\"display:none;text-align:center;padding:12px 0;\">\n        <div style=\"font-size:1.5rem;margin-bottom:6px;\">✓</div>\n        <div style=\"font-weight:700;color:#0B1F3A;font-size:0.9rem;\">Angemeldet!</div>\n        <div style=\"font-size:0.78rem;color:#5E7085;margin-top:4px;\">Bitte bestätigen Sie Ihre E-Mail.</div>\n      </div>\n      <div id=\"pan21-nl-err\" style=\"display:none;background:#FEF2F2;border-radius:4px;padding:8px 12px;font-size:0.78rem;color:#991B1B;margin-top:8px;\"></div>\n    </div>\n  </div>\n</div>\n<script>\nasync function pan21NlSubmit(){\n  var email=document.getElementById('pan21-nl-email').value.trim();\n  if(!email||!email.includes('@')){\n    var err=document.getElementById('pan21-nl-err');\n    err.textContent='Bitte geben Sie eine gültige E-Mail-Adresse ein.';\n    err.style.display='block';return;\n  }\n  document.getElementById('pan21-nl-err').style.display='none';\n  var btn=event.target||document.querySelector('#pan21-nl-form button');\n  btn.textContent='Wird gesendet…';btn.disabled=true;\n  try{\n    var res=await fetch('https://news.pan21.com/api/beehiiv-subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email})});\n    if(res.ok){\n      document.getElementById('pan21-nl-form').style.display='none';\n      document.getElementById('pan21-nl-ok').style.display='block';\n    }else{\n      var d=await res.json();\n      document.getElementById('pan21-nl-err').textContent=d.error||'Fehler. Bitte versuchen Sie es später.';\n      document.getElementById('pan21-nl-err').style.display='block';\n      btn.textContent='Jetzt anmelden';btn.disabled=false;\n    }\n  }catch(e){\n    document.getElementById('pan21-nl-err').textContent='Netzwerkfehler. Bitte versuchen Sie es später.';\n    document.getElementById('pan21-nl-err').style.display='block';\n    btn.textContent='Jetzt anmelden';btn.disabled=false;\n  }\n}\n</script>"}} />
{/* <!-- BEEHIIV:END --> */}
</main>
    </>
  )
}
