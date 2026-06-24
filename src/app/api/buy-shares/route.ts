import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { companyId, qty, payMethod, uid, email, pricePerShare, total } = await req.json()

  // Unternehmen holen
  const { data: company } = await supabase.from('mb_companies').select('*').eq('id', companyId).single()
  if (!company) return NextResponse.json({ error: 'Unternehmen nicht gefunden' }, { status: 404 })

  // Transaktion anlegen
  const { data: tx, error: txErr } = await supabase.from('mb_transactions').insert({
    user_id: uid, company_id: companyId, type: 'buy',
    shares: qty, price_usd: pricePerShare, nominal_usd: company.nominal_usd,
    total_eur: total, payment_method: payMethod, status: 'pending'
  }).select().single()
  if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 })

  if (payMethod === 'noble') {
    // Noble debit
    const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://noble-limited.com'}/api/v1/debit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.NOBLE_INTERNAL_API_KEY! },
      body: JSON.stringify({ email, coin_id: 'europan', amount: total, description: `Kauf ${qty}× ${company.short_name}` })
    })
    const nd = await r.json()
    if (!nd.ok) return NextResponse.json({ error: nd.error || 'Noble-Zahlung fehlgeschlagen' }, { status: 402 })

    await completePurchase(uid, companyId, qty, pricePerShare, tx.id)
    return NextResponse.json({ ok: true })
  }

  // Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: email,
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(pricePerShare * 100),
        product_data: { name: `${qty}× ${company.short_name} Aktie`, description: `Nennwert $${company.nominal_usd}/Stk.` }
      },
      quantity: qty
    }],
    metadata: { tx_id: tx.id, uid, company_id: companyId, qty: String(qty), price_per_share: String(pricePerShare) },
    success_url: `${req.nextUrl.origin}/dashboard?bought=1`,
    cancel_url: `${req.nextUrl.origin}/dashboard`,
  })

  await supabase.from('mb_transactions').update({ stripe_session: session.id }).eq('id', tx.id)
  return NextResponse.json({ url: session.url })
}

export async function completePurchase(uid: string, companyId: string, qty: number, pricePerShare: number, txId: string) {
  // Depot updaten
  const { data: existing } = await supabase.from('mb_depot').select('*').eq('user_id', uid).eq('company_id', companyId).maybeSingle()
  if (existing) {
    const newShares = Number(existing.shares) + qty
    const newAvg = ((Number(existing.avg_cost) * Number(existing.shares)) + (pricePerShare * qty)) / newShares
    await supabase.from('mb_depot').update({ shares: newShares, avg_cost: newAvg, updated_at: new Date().toISOString() }).eq('id', existing.id)
  } else {
    await supabase.from('mb_depot').insert({ user_id: uid, company_id: companyId, shares: qty, avg_cost: pricePerShare })
  }
  await supabase.from('mb_transactions').update({ status: 'completed' }).eq('id', txId)
}
