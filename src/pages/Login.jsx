import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { Button, Field, TextInput } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { validateEmail, normalizeEmail } from '../lib/validation'

export default function Login() {
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setServerError(null)

    const emailError = validateEmail(email)
    const passwordError = password ? null : 'Enter your password.'
    setErrors({ email: emailError, password: passwordError })
    if (emailError || passwordError) return

    setSubmitting(true)
    try {
      await signIn({ email: normalizeEmail(email), password })
      const redirectTo = location.state?.from ?? '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setServerError(
        err.message?.toLowerCase().includes('invalid')
          ? 'Incorrect email or password.'
          : err.message || 'We could not log you in. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-semibold text-ink">{t('login_title')}</h1>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
        <Field label={t('signup_email')} error={errors.email} htmlFor="email">
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
        </Field>

        <Field label={t('signup_password')} error={errors.password} htmlFor="password">
          <TextInput
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </Field>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-brand hover:text-brand-dark">
            {t('login_forgot')}
          </Link>
        </div>

        {serverError && (
          <p className="rounded-[10px] bg-danger/10 px-3.5 py-2.5 text-sm text-danger">{serverError}</p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? t('login_submitting') : t('login_submit')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        {t('login_no_account')}{' '}
        <Link to="/signup" className="font-medium text-brand hover:text-brand-dark">{t('signup_link')}</Link>
      </p>
    </AuthLayout>
  )
}
