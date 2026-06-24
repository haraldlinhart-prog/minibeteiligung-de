import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid')
  if (!uid) return NextResponse.json({ depot: [], transactions: [] })

  const [{ data: depot }, { data: transactions }] = await Promise.all([
    supabase.from('mb_depot').select('*, company:mb_companies(id,name,short_name,nominal_usd,current_price)')
      .eq('user_id', uid).order('created_at', { ascending: false }),
    supabase.from('mb_transactions').select('*, company:mb_companies(id,name,short_name)')
      .eq('user_id', uid).order('created_at', { ascending: false }).limit(50)
  ])

  return NextResponse.json({ depot: depot || [], transactions: transactions || [] })
}
