import { supabase, supabaseConfigured } from './supabase'
import { fallbackPlans, fallbackFaqs } from '../config/fallbackConfig'

// Admin-configurable content is meant to live in Supabase (`plans`, `faqs`
// tables — see supabase/schema.sql) so pricing/FAQ copy can change without a
// redeploy. These helpers fetch from Supabase and fall back to local
// defaults only if the table is empty or unreachable (e.g. schema not
// applied yet), so the landing page never renders blank.

export async function fetchPlans() {
  if (!supabaseConfigured) return fallbackPlans
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error || !data || data.length === 0) return fallbackPlans
  return data
}

export async function fetchFaqs() {
  if (!supabaseConfigured) return fallbackFaqs
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error || !data || data.length === 0) return fallbackFaqs
  return data.map((row) => ({ q: row.question, a: row.answer }))
}

export async function fetchActiveAnnouncements() {
  if (!supabaseConfigured) return []
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', nowIso)
    .gte('end_date', nowIso)
  if (error || !data) return []
  return data
}
