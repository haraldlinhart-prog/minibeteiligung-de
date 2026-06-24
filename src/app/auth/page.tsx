'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/dashboard`, data: { display_name: name } }
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-7 h-7 bg-blue rounded flex items-center justify-center text-sm font-bold text-white">M</div>
        <span className="font-display font-semibold text-white">Minibeteiligung<span className="text-slate/40">.de</span></span>
      </Link>
      <div className="w-full max-w-sm">
        {sent ? (
          <div className="card text-center">
            <div className="text-4xl mb-4">✉️</div>
            <div className="font-semibold text-white text-lg mb-2">Link gesendet</div>
            <p className="text-sm text-slate/60">Wir haben einen Magic Link an <strong className="text-white">{email}</strong> gesendet.</p>
          </div>
        ) : (
          <div className="card">
            <div className="text-xs text-blue-glow uppercase tracking-widest mb-5 font-medium">Registrieren / Anmelden</div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate/50 block mb-1.5">Ihr Name</label>
                <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Max Mustermann" required />
              </div>
              <div>
                <label className="text-xs text-slate/50 block mb-1.5">E-Mail-Adresse</label>
                <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ihre@email.de" required />
              </div>
              {error && <p className="text-xs text-red-lt">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Sende…' : 'Magic Link senden'}
              </button>
            </form>
            <p className="text-xs text-slate/30 mt-4 text-center">Kein Passwort nötig. Registrierung und Anmeldung in einem Schritt.</p>
          </div>
        )}
      </div>
    </div>
  )
}
