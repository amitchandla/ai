import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Clock } from 'lucide-react'
import { Card, Badge, Button } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { supabase, supabaseConfigured } from '../../lib/supabase'

function firstName(profile, user) {
  const full = profile?.full_name || user?.user_metadata?.full_name
  return full ? full.split(' ')[0] : 'there'
}

function daysLeft(trialEnd) {
  if (!trialEnd) return null
  const diff = Math.ceil((new Date(trialEnd).getTime() - Date.now()) / 86400000)
  return diff
}

export default function Overview() {
  const { user, profile, business } = useAuth()
  const { t } = useLanguage()
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    if (!supabaseConfigured || !user?.id) return
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setSubscription(data ?? null))
  }, [user])

  const trialDaysLeft = daysLeft(subscription?.trial_end)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {t('dash_good_morning')}, {firstName(profile, user)}
        </h1>
        <p className="mt-1 text-ink-soft">{t('dash_focus')}</p>
      </div>

      {subscription?.status === 'trial' && trialDaysLeft !== null && (
        <Card className="flex items-center gap-3 border-gold/40 bg-gold/10 px-5 py-3.5">
          <Clock size={17} className="text-gold-dark" />
          <p className="text-sm text-ink">
            {trialDaysLeft > 0
              ? `${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'} left in your free trial.`
              : 'Your free trial has ended.'}
          </p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line bg-sage px-5 py-3.5">
            <span className="flex items-center gap-2 font-display text-sm font-semibold text-brand-dark">
              <Sparkles size={15} /> Today's Growth Plan
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
            <p className="max-w-sm text-sm text-ink-soft">
              The Growth Advisor builds today's plan from your leads, customers and calendar. It
              turns on once that data starts coming in — this part is being connected next.
            </p>
            <Badge tone="sage">Coming online in the next build phase</Badge>
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-display text-sm font-semibold text-ink">Business Brain</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-soft">Business</dt>
              <dd className="text-right font-medium text-ink">{business?.name ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-soft">Category</dt>
              <dd className="text-right font-medium text-ink">{business?.category ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-soft">City</dt>
              <dd className="text-right font-medium text-ink">{business?.city ?? '—'}</dd>
            </div>
          </dl>
          <Button as={Link} to="/dashboard/settings" variant="outline" size="sm" className="mt-5 w-full">
            Edit business details
          </Button>
        </Card>
      </div>
    </div>
  )
}
