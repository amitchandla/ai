import { Button, Field, TextInput } from '../../components/ui'
import { useLanguage } from '../../context/LanguageContext'

export default function StepMarketing({ form, update, goNext, goBack }) {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <Field label="Current offers" hint="e.g. Weekend Pizza Offer — optional" htmlFor="offers">
        <TextInput id="offers" value={form.offers} onChange={(e) => update({ offers: e.target.value })} />
      </Field>
      <Field label="Opening hours" hint="e.g. Mon–Sat, 10am–9pm — optional" htmlFor="openingHours">
        <TextInput id="openingHours" value={form.openingHours} onChange={(e) => update({ openingHours: e.target.value })} />
      </Field>
      <Field label="Brand voice / notes for AI" hint="e.g. Friendly and simple, avoid heavy English — optional" htmlFor="brandInfo">
        <TextInput id="brandInfo" value={form.brandInfo} onChange={(e) => update({ brandInfo: e.target.value })} />
      </Field>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={goBack}>{t('onboarding_back')}</Button>
        <Button onClick={() => goNext()}>{t('onboarding_next')}</Button>
      </div>
    </div>
  )
}
