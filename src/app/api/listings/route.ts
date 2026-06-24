import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabase
    .from('mb_listings')
    .select('*, company:mb_companies(id,name,short_name,nominal_usd)')
    .eq('status','active')
    .order('created_at', { ascending: false })
  return NextResponse.json({ data: data || [] })
}

export async function POST(req: NextRequest) {
  const { companyId, sellerId, shares, askUsd, expiresAt } = await req.json()
  const { data, error } = await supabase.from('mb_listings').insert({
    company_id: companyId, seller_id: sellerId, shares, ask_usd: askUsd,
    expires_at: expiresAt || null
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
