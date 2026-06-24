import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabase.from('mb_companies').select('*').eq('status','active').order('listed_at', { ascending: false })
  return NextResponse.json({ data: data || [] })
}
