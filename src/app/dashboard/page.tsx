'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [depot, setDepot] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [tab, setTab] = useState('depot')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      fetch(`/api/depot?uid=${session.user.id}`)
        .then(r => r.json())
        .then(d => { setDepot(d.depot || []); setTransactions(d.transactions || []); setLoading(false) })
    })
  }, [router])

  const totalValue = depot.reduce((s, d) => s + (d.shares * (d.company?.current_price || d.company?.nominal_usd * 3.5 || 0)), 0)

  if (loading) return <div className="min-h-screen bg-void flex items-center justify-center text-slate/40">Laden…</div>

  return (
    <div className="min-h-screen bg-void">
      <header className="border-b border-white/6 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue rounded flex items-center justify-center text-xs font-bold text-white">M</div>
          <span className="font-display font-semibold text-white text-sm">Minibeteiligung<span className="text-slate/40">.de</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate/40">{user?.email}</span>
          <button onClick={() => sb.auth.signOut().then(() => router.push('/'))} className="text-xs text-slate/30 hover:text-white">Abmelden</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        {/* Depot-Übersicht */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card-blue">
            <div className="text-xs text-blue-glow uppercase tracking-widest mb-1">Depotwert</div>
            <div className="font-mono text-2xl text-white font-semibold">${totalValue.toFixed(2)}</div>
          </div>
          <div className="card">
            <div className="text-xs text-slate/40 uppercase tracking-widest mb-1">Positionen</div>
            <div className="font-mono text-2xl text-white">{depot.length}</div>
          </div>
          <div className="card">
            <div className="text-xs text-slate/40 uppercase tracking-widest mb-1">Transaktionen</div>
            <div className="font-mono text-2xl text-white">{transactions.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-white/6">
          {[['depot','Mein Depot'],['transactions','Transaktionen'],['buy','Aktien kaufen']].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === key ? 'border-blue text-blue-glow' : 'border-transparent text-slate/50 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'depot' && (
          depot.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-4xl mb-4">📊</div>
              <div className="text-white font-medium mb-2">Ihr Depot ist leer</div>
              <p className="text-sm text-slate/50 mb-6">Kaufen Sie Ihre ersten Aktien auf der Börse.</p>
              <button onClick={() => setTab('buy')} className="btn-primary">Aktien kaufen</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6 text-xs text-slate/40 uppercase tracking-widest">
                    <th className="text-left py-3 font-normal">Unternehmen</th>
                    <th className="text-right py-3 font-normal">Stück</th>
                    <th className="text-right py-3 font-normal">Nennwert/Stk.</th>
                    <th className="text-right py-3 font-normal">Kurs aktuell</th>
                    <th className="text-right py-3 font-normal">Depotwert</th>
                    <th className="text-right py-3 font-normal">Einstand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {depot.map((d: any) => {
                    const currentPrice = d.company?.current_price || d.company?.nominal_usd * 3.5 || 0
                    const value = d.shares * currentPrice
                    const gainLoss = value - (d.shares * d.avg_cost)
                    return (
                      <tr key={d.id} className="hover:bg-white/2">
                        <td className="py-4">
                          <div className="font-mono font-medium text-white">{d.company?.short_name}</div>
                          <div className="text-xs text-slate/40 truncate max-w-48">{d.company?.name}</div>
                        </td>
                        <td className="py-4 text-right font-mono text-white">{Number(d.shares).toLocaleString()}</td>
                        <td className="py-4 text-right font-mono text-slate">${Number(d.company?.nominal_usd || 0).toFixed(2)}</td>
                        <td className="py-4 text-right font-mono text-white">${currentPrice.toFixed(2)}</td>
                        <td className="py-4 text-right font-mono text-blue-glow font-medium">${value.toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <div className="font-mono text-xs text-slate">${Number(d.avg_cost).toFixed(2)}</div>
                          <div className={`font-mono text-xs ${gainLoss >= 0 ? 'text-green' : 'text-red-lt'}`}>
                            {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {tab === 'transactions' && (
          <div className="space-y-2">
            {transactions.length === 0 ? (
              <div className="card text-center py-12 text-slate/40">Noch keine Transaktionen</div>
            ) : transactions.map((t: any) => (
              <div key={t.id} className="card flex items-center justify-between">
                <div>
                  <span className={`tag text-xs mr-2 ${t.type === 'buy' ? 'tag-green' : 'tag-blue'}`}>{t.type === 'buy' ? 'KAUF' : 'VERKAUF'}</span>
                  <span className="text-sm text-white font-mono">{t.company?.short_name}</span>
                  <span className="text-xs text-slate/40 ml-2">{t.shares} Stk. × ${Number(t.price_usd).toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-white">${Number(t.total_eur).toFixed(2)}</div>
                  <div className="text-xs text-slate/30">{new Date(t.created_at).toLocaleDateString('de-DE')}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'buy' && (
          <BuyForm userId={user?.id} userEmail={user?.email} />
        )}
      </div>
    </div>
  )
}

function BuyForm({ userId, userEmail }: { userId: string, userEmail: string }) {
  const [companies, setCompanies] = useState<any[]>([])
  const [selected, setSelected] = useState('')
  const [qty, setQty] = useState(10)
  const [payMethod, setPayMethod] = useState<'stripe'|'noble'>('stripe')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/companies').then(r => r.json()).then(d => setCompanies(d.data || []))
  }, [])

  const company = companies.find(c => c.id === selected)
  const nominal = company ? Number(company.nominal_usd) : 5
  const totalNominal = nominal * qty
  const pct = totalNominal <= 100 ? 3.5 : totalNominal <= 1000 ? 2.2 : 2.0
  const pricePerShare = nominal * pct
  const total = pricePerShare * qty

  async function handleBuy() {
    if (!selected) { setError('Bitte Unternehmen wählen'); return }
    setLoading(true); setError('')
    const r = await fetch('/api/buy-shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: selected, qty, payMethod, uid: userId, email: userEmail, pricePerShare, total })
    })
    const d = await r.json()
    if (d.url) window.location.href = d.url
    else if (d.ok) window.location.href = '/dashboard?bought=1'
    else setError(d.error || 'Fehler')
    setLoading(false)
  }

  return (
    <div className="max-w-md space-y-5">
      <div>
        <label className="text-xs text-slate/50 block mb-1.5">Unternehmen wählen</label>
        <select className="form-input" value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">— Bitte wählen —</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.short_name} — {c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-slate/50 block mb-1.5">Anzahl Aktien: {qty}</label>
        <input type="range" min="1" max="1000" value={qty} onChange={e => setQty(Number(e.target.value))} className="w-full accent-blue" />
      </div>
      {company && (
        <div className="bg-void-3 rounded-lg p-4 font-mono text-xs space-y-2">
          <div className="flex justify-between"><span className="text-slate/50">Nennwert/Stk.</span><span className="text-white">${nominal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-slate/50">Nennwert gesamt</span><span className="text-white">${totalNominal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-slate/50">Aufschlag</span><span className="text-slate">{((pct-1)*100).toFixed(0)}%</span></div>
          <div className="flex justify-between border-t border-white/6 pt-2">
            <span className="text-white font-medium">Ausgabepreis gesamt</span>
            <span className="text-blue-glow font-semibold">${total.toFixed(2)}</span>
          </div>
        </div>
      )}
      <div>
        <label className="text-xs text-slate/50 block mb-1.5">Zahlungsart</label>
        <div className="grid grid-cols-2 gap-2">
          {(['stripe','noble'] as const).map(m => (
            <button key={m} onClick={() => setPayMethod(m)}
              className={`p-3 rounded border text-sm transition-colors ${payMethod === m ? 'border-blue bg-blue/10 text-white' : 'border-white/10 text-slate/60 hover:border-white/20'}`}>
              {m === 'stripe' ? '💳 Kreditkarte' : '🪙 Noble'}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-xs text-red-lt">{error}</p>}
      <button onClick={handleBuy} disabled={loading || !selected} className="btn-primary w-full justify-center disabled:opacity-40">
        {loading ? 'Weiterleitung…' : `Kaufen — $${total.toFixed(2)}`}
      </button>
    </div>
  )
}
