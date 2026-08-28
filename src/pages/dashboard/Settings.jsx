import { useEffect, useState } from 'react'
import { Card, Field, TextInput, Button } from '../../components/ui'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { useAuth } from '../../context/AuthContext'
import { supabase, supabaseConfigured } from '../../lib/supabase'

const editableFields = [
  ['name', 'Business name'],
  ['category', 'Category'],
  ['owner_name', 'Owner name'],
  ['phone', 'Phone'],
  ['whatsapp', 'WhatsApp'],
  ['city', 'City'],
  ['state', 'State'],
  ['website', 'Website'],
  ['instagram', 'Instagram'],
]

export default function Settings() {
  const { business, refreshBusiness } = useAuth()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (business) setForm(business)
  }, [business])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      if (!supabaseConfigured) throw new Error('Supabase is not configured yet.')
      const patch = Object.fromEntries(editableFields.map(([key]) => [key, form[key] ?? null]))
      const { error: updateError } = await supabase.from('businesses').update(patch).eq('id', business.id)
      if (updateError) throw updateError
      await refreshBusiness()
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>

      <Card className="p-6">
        <p className="font-display text-sm font-semibold text-ink">Language</p>
        <p className="mt-1 text-sm text-ink-soft">Changes dashboard text, AI suggestions and AI Help.</p>
        <LanguageSwitcher className="mt-4" />
      </Card>

      <Card className="p-6">
        <p className="font-display text-sm font-semibold text-ink">Business details</p>
        <form className="mt-4 space-y-4" onSubmit={handleSave}>
          {editableFields.map(([key, label]) => (
            <Field key={key} label={label} htmlFor={key}>
              <TextInput id={key} value={form[key] ?? ''} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
            </Field>
          ))}
          {error && <p className="rounded-[10px] bg-danger/10 px-3.5 py-2.5 text-sm text-danger">{error}</p>}
          {saved && <p className="rounded-[10px] bg-sage px-3.5 py-2.5 text-sm text-brand-dark">Saved.</p>}
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
        </form>
      </Card>
    </div>
  )
}
