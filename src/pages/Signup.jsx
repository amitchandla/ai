import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { Button, Field, TextInput } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import {
  validateFullName, validateEmail, normalizeEmail, validateMobile,
  validatePassword, validateConfirmPassword,
} from '../lib/validation'

const initialForm = { fullName: '', email: '', mobile: '', password: '', confirmPassword: '', terms: false }

export default function Signup() {
  const { signUp } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validateAll() {
    const next = {
      fullName: validateFullName(form.fullName),
      email: validateEmail(form.email),
      mobile: validateMobile(form.mobile),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
      terms: form.terms ? null : 'You must accept the Terms of Service to continue.',
    }
    setErrors(next)
    return Object.values(next).every((v) => v === null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setServerError(null)
    if (!validateAll()) return

    setSubmitting(true)
    try {
      await signUp({
        fullName: form.fullName.trim(),
        email: normalizeEmail(form.email),
        mobile: form.mobile.trim(),
        password: form.password,
      })
      navigate('/onboarding', { replace: true })
    } catch (err) {
      setServerError(err.message || 'We could not create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-semibold text-ink">{t('signup_title')}</h1>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
        <Field label={t('signup_full_name')} error={errors.fullName} htmlFor="fullName">
          <TextInput
            id="fullName"
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            error={errors.fullName}
          />
        </Field>

        <Field label={t('signup_email')} error={errors.email} htmlFor="email">
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
          />
        </Field>

        <Field label={t('signup_mobile')} error={errors.mobile} htmlFor="mobile">
          <TextInput
            id="mobile"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            placeholder="98XXXXXXXX"
            value={form.mobile}
            onChange={(e) => update('mobile', e.target.value.replace(/\D/g, ''))}
            error={errors.mobile}
          />
        </Field>

        <Field label={t('signup_password')} error={errors.password} htmlFor="password" hint="8+ characters, with an uppercase letter and a number">
          <TextInput
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            error={errors.password}
          />
        </Field>

        <Field label={t('signup_confirm_password')} error={errors.confirmPassword} htmlFor="confirmPassword">
          <TextInput
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
          />
        </Field>

        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-line text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            checked={form.terms}
            onChange={(e) => update('terms', e.target.checked)}
          />
          {t('signup_terms')}
        </label>
        {errors.terms && <p className="text-xs text-danger">{errors.terms}</p>}

        {serverError && (
          <p className="rounded-[10px] bg-danger/10 px-3.5 py-2.5 text-sm text-danger">{serverError}</p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? t('signup_submitting') : t('signup_submit')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        {t('signup_have_account')}{' '}
        <Link to="/login" className="font-medium text-brand hover:text-brand-dark">{t('login_link')}</Link>
      </p>
    </AuthLayout>
  )
}
