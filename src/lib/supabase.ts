import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Ausgabepreis berechnen basierend auf Nennwert (USD)
// nominal = Nennwert pro Aktie in USD
// quantity = Anzahl Aktien
// Gibt Ausgabepreis pro Aktie zurück (USD)
export function calcIssuePrice(nominalUsd: number, quantity: number): number {
  const totalNominal = nominalUsd * quantity
  if (totalNominal <= 100) return nominalUsd * 3.5      // 350% des Nennwerts
  if (totalNominal <= 1000) return nominalUsd * 2.2     // 220% des Nennwerts
  return nominalUsd * 2.0                                // 200% des Nennwerts
}

// Gesamtpreis für Kauf (EUR) — 1:1 USD/EUR vereinfacht, später FX-Rate integrierbar
export function calcTotalEur(nominalUsd: number, quantity: number): number {
  const pricePerShare = calcIssuePrice(nominalUsd, quantity)
  return Math.round(pricePerShare * quantity * 100) / 100
}

// Kurswert einer Aktie (gewichteter Durchschnitt aus Nennwert + Ausgabepreis + Geboten)
export function calcCurrentPrice(nominalUsd: number, lastBid?: number): number {
  const issuePrice = calcIssuePrice(nominalUsd, 1)
  if (lastBid && lastBid > issuePrice) return lastBid
  return issuePrice
}
