import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { Button, Field, TextInput } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { validateEmail, normalizeEmail } from '../lib/validation'

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    const emailError = validateEmail(email)
    setError(emailError)
    if (emailError) return

    setSubmitting(true)
    try {
      // Supabase intentionally doesn't reveal whether the email exists, to
      // avoid leaking which addresses are registered — so we always show
      // the same success state.
      await sendPasswordReset(normalizeEmail(email))
    } catch {
      // swallow — same reasoning as above
    } finally {
      setSubmitting(false)
      setSent(true)
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-semibold text-ink">{t('reset_title')}</h1>

      {sent ? (
        <div className="mt-7 flex items-start gap-3 rounded-[12px] bg-sage px-4 py-4 text-sm text-brand-dark">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>{t('reset_email_sent')}</p>
        </div>
      ) : (
        <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
          <Field label={t('signup_email')} error={error} htmlFor="email">
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
          </Field>
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? '…' : t('reset_submit')}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link to="/login" className="font-medium text-brand hover:text-brand-dark">{t('login_link')}</Link>
      </p>
    </AuthLayout>
  )
}
