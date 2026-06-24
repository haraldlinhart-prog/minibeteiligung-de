'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function BoerseContent() {
  const params = useSearchParams()
  const [companies, setCompanies] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | listings | companies
  const tab = params.get('tab') || 'companies'

  useEffect(() => {
    Promise.all([
      fetch('/api/companies').then(r => r.json()),
      fetch('/api/listings').then(r => r.json()),
    ]).then(([c, l]) => {
      setCompanies(c.data || [])
      setListings(l.data || [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Börse</h1>
          <p className="text-sm text-slate/50">Öffentliche Aktien und Angebote — Bieten nur für registrierte Nutzer</p>
        </div>
        <Link href="/auth" className="btn-primary text-sm">Anmelden zum Bieten</Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/6">
        {[['companies', 'Unternehmen'], ['listings', 'Angebote']].map(([key, label]) => (
          <Link key={key} href={`/boerse?tab=${key}`}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === key ? 'border-blue text-blue-glow' : 'border-transparent text-slate/50 hover:text-white'}`}>
            {label}
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="text-slate/40 text-sm py-12 text-center">Laden…</div>
      ) : tab === 'companies' ? (
        <div>
          {companies.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-4xl mb-4">📋</div>
              <div className="text-white font-medium mb-2">Noch keine Unternehmen gelistet</div>
              <p className="text-sm text-slate/50 mb-6">Gründen Sie eine Series LLC bei firmenaktie.de und listen Sie Aktien hier.</p>
              <a href="https://firmenaktie.de" className="btn-primary">Zu Firmenaktie.de →</a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6 text-xs text-slate/40 uppercase tracking-widest">
                    <th className="text-left py-3 font-normal">Unternehmen</th>
                    <th className="text-right py-3 font-normal">Nennwert</th>
                    <th className="text-right py-3 font-normal">Ausgabepreis</th>
                    <th className="text-right py-3 font-normal">Kurs aktuell</th>
                    <th className="text-right py-3 font-normal">Aktien verfügbar</th>
                    <th className="text-right py-3 font-normal"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {companies.map((c: any) => (
                    <tr key={c.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-4">
                        <div className="font-mono font-medium text-white">{c.short_name}</div>
                        <div className="text-xs text-slate/40">{c.name}</div>
                      </td>
                      <td className="py-4 text-right font-mono text-slate">${Number(c.nominal_usd).toFixed(2)}</td>
                      <td className="py-4 text-right font-mono text-blue-glow">${(Number(c.nominal_usd) * 3.5).toFixed(2)}</td>
                      <td className="py-4 text-right font-mono text-white">${(c.current_price || Number(c.nominal_usd) * 3.5).toFixed(2)}</td>
                      <td className="py-4 text-right font-mono text-slate/60">{Number(c.total_shares).toLocaleString()}</td>
                      <td className="py-4 text-right">
                        <Link href="/auth" className="btn-primary text-xs px-3 py-1.5">Kaufen</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          {listings.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-4xl mb-4">🏷️</div>
              <div className="text-white font-medium mb-2">Keine aktiven Angebote</div>
              <p className="text-sm text-slate/50">Noch keine Aktionäre bieten Aktien zum Kauf an.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((l: any) => (
                <div key={l.id} className="card flex items-center justify-between">
                  <div>
                    <div className="font-mono font-medium text-white text-sm">{l.company?.short_name}</div>
                    <div className="text-xs text-slate/40 mt-0.5">{l.shares} Aktien · Mindestpreis ${Number(l.ask_usd).toFixed(2)}/Stk.</div>
                  </div>
                  <div className="text-right">
                    {l.current_bid && <div className="text-xs text-green font-mono mb-1">Höchstgebot: ${Number(l.current_bid).toFixed(2)}</div>}
                    <Link href="/auth" className="btn-green text-xs px-3 py-1.5">Gebot abgeben</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function BoersePage() {
  return (
    <div className="min-h-screen bg-void">
      <nav className="border-b border-white/6 px-4 sm:px-8 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue rounded flex items-center justify-center text-xs font-bold text-white">M</div>
          <span className="font-display font-semibold text-white text-sm">Minibeteiligung<span className="text-slate/40">.de</span></span>
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-sm text-slate/50">Börse</span>
      </nav>
      <Suspense fallback={<div className="p-12 text-center text-slate/40">Laden…</div>}>
        <BoerseContent />
      </Suspense>
    </div>
  )
}
