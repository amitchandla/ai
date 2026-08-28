import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo, Button } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { supabase, supabaseConfigured } from '../lib/supabase'
import StepBasics from './onboarding/StepBasics'
import StepProducts from './onboarding/StepProducts'
import StepCustomers from './onboarding/StepCustomers'
import StepMarketing from './onboarding/StepMarketing'
import StepFinish from './onboarding/StepFinish'

const STEPS = ['basics', 'products', 'customers', 'marketing', 'finish']

const emptyForm = {
  // Step 1 — Basics
  businessName: '', category: '', ownerName: '', phone: '', whatsapp: '', businessEmail: '',
  country: 'India', state: '', city: '', area: '', address: '', website: '', instagram: '', facebook: '',
  // Step 2 — Products & Services
  products: '', services: '', prices: '',
  // Step 3 — Customers
  targetCustomers: '', usp: '',
  // Step 4 — Marketing
  offers: '', openingHours: '', brandInfo: '',
}

export default function Onboarding() {
  const { user, refreshBusiness } = useAuth()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }))
  }

  function goNext(stepErrors) {
    if (stepErrors && Object.values(stepErrors).some(Boolean)) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  async function finishOnboarding() {
    if (submitting) return
    setServerError(null)
    setSubmitting(true)
    try {
      if (!supabaseConfigured) throw new Error('Supabase is not configured yet.')

      const toList = (v) => v.split(',').map((s) => s.trim()).filter(Boolean)

      const { error } = await supabase.from('businesses').insert({
        owner_id: user.id,
        name: form.businessName.trim(),
        category: form.category.trim(),
        owner_name: form.ownerName.trim() || null,
        phone: form.phone.trim() || null,
        whatsapp: form.whatsapp.trim() || form.phone.trim() || null,
        contact_email: form.businessEmail.trim() || null,
        country: form.country.trim() || null,
        state: form.state.trim() || null,
        city: form.city.trim(),
        area: form.area.trim() || null,
        address: form.address.trim() || null,
        website: form.website.trim() || null,
        instagram: form.instagram.trim() || null,
        facebook: form.facebook.trim() || null,
        products: toList(form.products),
        services: toList(form.services),
        prices: form.prices.trim() || null,
        target_customers: form.targetCustomers.trim() || null,
        usp: form.usp.trim() || null,
        offers: form.offers.trim() || null,
        opening_hours: form.openingHours.trim() || null,
        brand_info: form.brandInfo.trim() || null,
        language: lang,
      })
      if (error) throw error

      await refreshBusiness()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(err.message || 'We could not save your business. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const stepProps = { form, update, goNext, goBack, errors }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Logo />
          <span className="font-mono text-xs text-ink-soft">Step {stepIndex + 1} of {STEPS.length}</span>
        </div>
      </header>

      <div className="mx-auto h-1 max-w-2xl bg-sage">
        <div
          className="h-1 bg-brand transition-all duration-300"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-display text-2xl font-semibold text-ink">{t('onboarding_title')}</h1>

        <div className="mt-8">
          {stepIndex === 0 && <StepBasics {...stepProps} />}
          {stepIndex === 1 && <StepProducts {...stepProps} />}
          {stepIndex === 2 && <StepCustomers {...stepProps} />}
          {stepIndex === 3 && <StepMarketing {...stepProps} />}
          {stepIndex === 4 && (
            <StepFinish form={form} onBack={goBack} onFinish={finishOnboarding} submitting={submitting} serverError={serverError} />
          )}
        </div>
      </main>
    </div>
  )
}
