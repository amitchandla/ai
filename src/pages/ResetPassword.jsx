import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { Button, Field, TextInput } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { validatePassword, validateConfirmPassword } from '../lib/validation'

// Reached via the link Supabase emails from resetPasswordForEmail().
// Supabase's detectSessionInUrl handles exchanging the recovery token for a
// session automatically before this page mounts.
export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setServerError(null)
    const next = {
      password: validatePassword(password),
      confirm: validateConfirmPassword(password, confirm),
    }
    setErrors(next)
    if (next.password || next.confirm) return

    setSubmitting(true)
    try {
      await updatePassword(password)
      setDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 1800)
    } catch (err) {
      setServerError(err.message || 'The reset link may have expired. Please request a new one.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-semibold text-ink">Set a new password</h1>

      {done ? (
        <p className="mt-7 rounded-[12px] bg-sage px-4 py-4 text-sm text-brand-dark">
          Password updated. Taking you to login…
        </p>
      ) : (
        <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
          <Field label="New password" error={errors.password} htmlFor="password" hint="8+ characters, with an uppercase letter and a number">
            <TextInput id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
          </Field>
          <Field label="Confirm new password" error={errors.confirm} htmlFor="confirm">
            <TextInput id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
          </Field>
          {serverError && <p className="rounded-[10px] bg-danger/10 px-3.5 py-2.5 text-sm text-danger">{serverError}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
