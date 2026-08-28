import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Check, ChevronDown, Sparkles, Users, MessageSquareText, Clapperboard,
  Megaphone, RefreshCcw, FileBarChart, LifeBuoy, PlayCircle, Camera,
} from 'lucide-react'
import { Logo, Button, Badge, Card } from '../components/ui'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'
import { fetchPlans, fetchFaqs } from '../lib/remoteConfig'
import { growthPlanExample } from '../config/fallbackConfig'

const features = [
  { icon: Sparkles, name: 'Daily Growth Advisor', desc: 'A fresh, prioritized plan every morning — built from your leads, customers and calendar, not generic tips.' },
  { icon: Users, name: 'Lead Management', desc: 'Track every enquiry from first contact to won, with AI flagging your hottest leads.' },
  { icon: MessageSquareText, name: 'AI Follow-up', desc: 'AI drafts the right follow-up message, in your language — you approve before anything sends.' },
  { icon: Camera, name: 'Social Media Suggestions', desc: 'Reels, posts and stories suggested for today, using your real products and offers.' },
  { icon: Clapperboard, name: 'AI Video Studio', desc: 'Realistic, commercial-style marketing videos — not cartoons — built from your own photos.' },
  { icon: Megaphone, name: 'Meta Ads', desc: 'Campaign ideas, copy and creative direction — nothing launches without your approval.' },
  { icon: RefreshCcw, name: 'Customer Reactivation', desc: 'Finds customers who have drifted away and helps you win them back.' },
  { icon: FileBarChart, name: 'Business Reports', desc: 'An honest weekly summary of what happened and what to focus on next.' },
  { icon: LifeBuoy, name: 'AI Help', desc: 'Ask anything about using BizGrow AI, answered in plain language, in your language.' },
]

const steps = [
  { n: '01', title: 'Tell us about your business', desc: 'Business name, products, customers, offers — entered once.' },
  { n: '02', title: 'BizGrow AI understands your business', desc: 'Your "Business Brain" is built and used across every feature.' },
  { n: '03', title: 'Get daily growth recommendations', desc: 'A prioritized plan appears every morning, explained in plain language.' },
  { n: '04', title: 'Create and execute marketing tasks', desc: 'Turn a suggestion into a Reel, a follow-up, or a campaign in one click.' },
  { n: '05', title: 'Track your progress', desc: 'See what worked in an honest weekly report — no invented numbers.' },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="ledger-row py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-[1.05rem] font-medium text-ink">{q}</span>
        <ChevronDown size={18} className={`shrink-0 text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft">{a}</p>}
    </div>
  )
}

export default function Landing() {
  const { t } = useLanguage()
  const [plans, setPlans] = useState([])
  const [faqs, setFaqs] = useState([])

  useEffect(() => {
    fetchPlans().then(setPlans)
    fetchFaqs().then(setFaqs)
  }, [])

  return (
    <div className="min-h-screen bg-paper">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-ink-soft hover:text-ink">{t('nav_features')}</a>
            <a href="#how-it-works" className="text-sm font-medium text-ink-soft hover:text-ink">{t('nav_how')}</a>
            <a href="#pricing" className="text-sm font-medium text-ink-soft hover:text-ink">{t('nav_pricing')}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <Link to="/login" className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline">
              {t('nav_login')}
            </Link>
            <Button as={Link} to="/signup" size="sm">{t('nav_start')}</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:pt-20">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <Badge tone="sage">{t('hero_eyebrow')}</Badge>
            <h1 className="mt-5 font-display text-[2.5rem] font-semibold leading-[1.08] text-ink md:text-[3.1rem]">
              {t('hero_title')}
            </h1>
            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
              {t('hero_sub')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button as={Link} to="/signup" size="lg">
                {t('hero_cta_primary')} <ArrowRight size={18} />
              </Button>
              <Button as="a" href="#how-it-works" variant="ghost" size="lg">
                <PlayCircle size={18} /> {t('hero_cta_secondary')}
              </Button>
            </div>
            <p className="mt-4 text-xs text-ink-soft">{t('hero_note')}</p>
          </div>

          {/* Signature element: the Growth Ledger — a realistic dashboard preview
              styled like a shopkeeper's daily register, not a cartoon illustration. */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-sage px-5 py-3.5">
              <span className="font-display text-sm font-semibold text-brand-dark">Today's Growth Plan</span>
              <span className="font-mono text-xs text-ink-soft">28 Aug</span>
            </div>
            <div className="px-5">
              {growthPlanExample.map((item) => (
                <div key={item.tag} className="ledger-row flex items-start gap-4 py-4">
                  <span className="ledger-tab mt-0.5">{item.tag}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.93rem] font-medium text-ink">{item.text}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">{item.reason}</p>
                  </div>
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-line" aria-hidden="true" />
                </div>
              ))}
            </div>
            <div className="border-t border-line bg-paper-soft px-5 py-3 text-center text-xs text-ink-soft">
              Built from your leads, customers and calendar — not generic tips
            </div>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-line bg-sage/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-[1.9rem] font-semibold text-ink">How it works</h2>
          <p className="mt-2 max-w-lg text-ink-soft">Five steps, and BizGrow AI already knows your business from step two onward.</p>
          <div className="mt-10 grid gap-8 md:grid-cols-5">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="font-mono text-xs text-brand">{s.n}</span>
                <h3 className="mt-2 font-display text-[1.05rem] font-medium text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-[1.9rem] font-semibold text-ink">Everything your business needs to grow</h2>
        <p className="mt-2 max-w-lg text-ink-soft">Nine tools, one business profile, and AI that already knows the context.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.name} className="p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-sage text-brand">
                <f.icon size={19} />
              </span>
              <h3 className="mt-4 font-display text-[1.05rem] font-medium text-ink">{f.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* AI Video section */}
      <section className="border-t border-line bg-ink py-20 text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <Badge tone="gold">AI Video Studio</Badge>
            <h2 className="mt-5 font-display text-[1.9rem] font-semibold leading-tight">
              Create professional marketing videos for your business
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-paper/75">
              Realistic, commercial-looking and business-specific — built from your own product
              photos, logo and brand assets whenever possible. Not cartoon-style by default.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-paper/85">
              {['Instagram Reel & Story', 'Meta Ad formats', 'WhatsApp Status', 'YouTube Short'].map((i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check size={15} className="text-gold" /> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Reel · 9:16', 'Story · 9:16', 'Meta Ad', 'YouTube Short'].map((label) => (
              <div key={label} className="flex aspect-[9/12] items-center justify-center rounded-[14px] border border-paper/15 bg-paper/5 text-xs text-paper/50">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-[1.9rem] font-semibold text-ink">Simple, honest pricing</h2>
        <p className="mt-2 max-w-lg text-ink-soft">Start with 7 days free. No card required.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id ?? plan.name}
              className={`flex flex-col p-7 ${plan.highlighted ? 'border-brand ring-1 ring-brand' : ''}`}
            >
              {plan.highlighted && <Badge tone="gold" className="mb-3 w-fit">Most popular</Badge>}
              <h3 className="font-display text-lg font-semibold text-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-ink-soft">{plan.description}</p>
              <p className="mt-5 font-display text-3xl font-semibold text-ink">
                {plan.price}
                <span className="text-sm font-normal text-ink-soft">{plan.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {(plan.features ?? []).map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Check size={15} className="mt-0.5 shrink-0 text-brand" /> {f}
                  </li>
                ))}
              </ul>
              <Button as={Link} to="/signup" variant={plan.highlighted ? 'primary' : 'outline'} className="mt-7 w-full">
                {t('hero_cta_primary')}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-sage/60 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-[1.9rem] font-semibold text-ink">Frequently asked questions</h2>
          <div className="mt-6">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="font-display text-[2.1rem] font-semibold text-ink">Start Growing Your Business</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">7 days free. No card required. Cancel anytime.</p>
        <Button as={Link} to="/signup" size="lg" className="mt-7">
          {t('hero_cta_primary')} <ArrowRight size={18} />
        </Button>
      </section>

      <footer className="border-t border-line py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-ink-soft sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} BizGrow AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
