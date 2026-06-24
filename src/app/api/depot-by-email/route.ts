import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (apiKey !== process.env.NOBLE_INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  // User via Auth suchen
  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users?.users?.find(u => u.email === email)
  if (!user) return NextResponse.json({ depot: [], total_value_usd: 0 })

  const { data: depot } = await supabase
    .from('mb_depot')
    .select('*, company:mb_companies(id, name, short_name, nominal_usd, current_price)')
    .eq('user_id', user.id)
    .gt('shares', 0)

  const items = (depot || []).map((d: any) => {
    const currentPrice = d.company?.current_price || (Number(d.company?.nominal_usd || 5) * 3.5)
    return {
      company_name: d.company?.name || 'Unbekannt',
      short_name: d.company?.short_name || '—',
      shares: Number(d.shares),
      nominal_usd: Number(d.company?.nominal_usd || 5),
      current_price_usd: currentPrice,
      value_usd: Number(d.shares) * currentPrice,
      avg_cost_usd: Number(d.avg_cost),
    }
  })

  const total = items.reduce((s: number, i: any) => s + i.value_usd, 0)
  return NextResponse.json({ depot: items, total_value_usd: total })
}
