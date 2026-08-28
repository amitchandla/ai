import { Button, Field, TextInput, Select } from '../../components/ui'
import { useLanguage } from '../../context/LanguageContext'

const categories = [
  'Restaurant / Food', 'Retail / Store', 'Hardware / Electrical / Paint', 'Salon / Beauty',
  'Clinic / Healthcare', 'Education / Coaching', 'Fashion / Apparel', 'Real Estate',
  'Professional Services', 'Other',
]

export default function StepBasics({ form, update, goNext, errors }) {
  const { t } = useLanguage()

  function handleNext() {
    const stepErrors = {
      businessName: form.businessName.trim() ? null : 'Business name is required.',
      category: form.category ? null : 'Choose a category.',
      phone: form.phone.trim() || form.whatsapp.trim() ? null : 'Add a phone or WhatsApp number.',
      city: form.city.trim() ? null : 'City is required.',
    }
    goNext(stepErrors)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Business name" error={errors.businessName} htmlFor="businessName">
          <TextInput id="businessName" value={form.businessName} onChange={(e) => update({ businessName: e.target.value })} error={errors.businessName} />
        </Field>
        <Field label="Category" error={errors.category} htmlFor="category">
          <Select id="category" value={form.category} onChange={(e) => update({ category: e.target.value })} error={errors.category}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Owner name" htmlFor="ownerName">
        <TextInput id="ownerName" value={form.ownerName} onChange={(e) => update({ ownerName: e.target.value })} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone} htmlFor="phone">
          <TextInput id="phone" type="tel" value={form.phone} onChange={(e) => update({ phone: e.target.value })} error={errors.phone} />
        </Field>
        <Field label="WhatsApp" htmlFor="whatsapp">
          <TextInput id="whatsapp" type="tel" placeholder="Same as phone if blank" value={form.whatsapp} onChange={(e) => update({ whatsapp: e.target.value })} />
        </Field>
      </div>

      <Field label="Business email" htmlFor="businessEmail">
        <TextInput id="businessEmail" type="email" value={form.businessEmail} onChange={(e) => update({ businessEmail: e.target.value })} />
      </Field>

      <p className="pt-2 text-sm font-medium text-ink-soft">Business location</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Country" htmlFor="country">
          <TextInput id="country" value={form.country} onChange={(e) => update({ country: e.target.value })} />
        </Field>
        <Field label="State" htmlFor="state">
          <TextInput id="state" placeholder="e.g. Haryana" value={form.state} onChange={(e) => update({ state: e.target.value })} />
        </Field>
        <Field label="City" error={errors.city} htmlFor="city">
          <TextInput id="city" placeholder="e.g. Bhiwani" value={form.city} onChange={(e) => update({ city: e.target.value })} error={errors.city} />
        </Field>
        <Field label="Area / locality (optional)" htmlFor="area">
          <TextInput id="area" value={form.area} onChange={(e) => update({ area: e.target.value })} />
        </Field>
      </div>
      <Field label="Full address (optional)" htmlFor="address">
        <TextInput id="address" value={form.address} onChange={(e) => update({ address: e.target.value })} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Website (optional)" htmlFor="website">
          <TextInput id="website" value={form.website} onChange={(e) => update({ website: e.target.value })} />
        </Field>
        <Field label="Instagram (optional)" htmlFor="instagram">
          <TextInput id="instagram" placeholder="@handle" value={form.instagram} onChange={(e) => update({ instagram: e.target.value })} />
        </Field>
        <Field label="Facebook (optional)" htmlFor="facebook">
          <TextInput id="facebook" value={form.facebook} onChange={(e) => update({ facebook: e.target.value })} />
        </Field>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleNext}>{t('onboarding_next')}</Button>
      </div>
    </div>
  )
}
