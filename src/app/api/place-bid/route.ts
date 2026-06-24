import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { listingId, bidderId, bidUsd } = await req.json()
  if (!listingId || !bidderId || !bidUsd) return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })

  // Listing prüfen
  const { data: listing } = await supabase.from('mb_listings').select('*').eq('id', listingId).single()
  if (!listing || listing.status !== 'active') return NextResponse.json({ error: 'Listing nicht aktiv' }, { status: 400 })
  if (bidUsd < listing.ask_usd) return NextResponse.json({ error: `Gebot muss mindestens $${listing.ask_usd} sein` }, { status: 400 })
  if (listing.current_bid && bidUsd <= listing.current_bid) return NextResponse.json({ error: 'Gebot muss höher als aktuelles Höchstgebot sein' }, { status: 400 })

  // Altes Höchstgebot überboten markieren
  await supabase.from('mb_bids').update({ status: 'outbid' }).eq('listing_id', listingId).eq('status', 'active')

  // Neues Gebot
  const { data: bid, error } = await supabase.from('mb_bids').insert({ listing_id: listingId, bidder_id: bidderId, bid_usd: bidUsd }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Listing aktualisieren
  await supabase.from('mb_listings').update({ current_bid: bidUsd }).eq('id', listingId)

  // Kurs des Unternehmens aktualisieren wenn Gebot > aktueller Kurs
  await supabase.from('mb_companies').update({ current_price: bidUsd }).eq('id', listing.company_id)

  return NextResponse.json({ ok: true, bid })
}
