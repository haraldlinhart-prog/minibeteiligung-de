'use client'
import Link from 'next/link'
import { useState } from 'react'

const DEMO_COMPANIES = [
  { name: 'MUSTERMANN', fullName: 'Mustermann Trading Series', price: 17.50, change: +2.3, shares: 1200, nominal: 5 },
  { name: 'ALPHATECH',  fullName: 'AlphaTech Solutions Series', price: 11.00, change: -0.8, shares: 800,  nominal: 5 },
  { name: 'BERLINCAP',  fullName: 'Berlin Capital Series',      price: 22.00, change: +5.1, shares: 500,  nominal: 10},
  { name: 'RHEINGOLD',  fullName: 'Rheingold Ventures Series',  price: 4.40,  change: +0.0, shares: 3000, nominal: 2 },
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
          {[...DEMO_COMPANIES, ...DEMO_COMPANIES].map((c, i) => (
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
                  {DEMO_COMPANIES.map(c => (
                    <div key={c.name} className="flex items-center justify-between py-1.5 border-b border-white/4 last:border-0">
                      <div>
                        <span className="text-xs font-mono font-medium text-white">{c.name}</span>
                        <span className="text-xs text-slate/40 ml-2">{c.shares.toLocaleString()} Stk.</span>
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
                  {DEMO_COMPANIES.map(c => (
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
                      <td className="py-4 text-right font-mono text-slate/60">{c.shares.toLocaleString()}</td>
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
      </main>
    </>
  )
}
