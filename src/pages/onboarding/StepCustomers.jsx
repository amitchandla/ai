import { Button, Field, TextInput } from '../../components/ui'
import { useLanguage } from '../../context/LanguageContext'

export default function StepCustomers({ form, update, goNext, goBack }) {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <Field label="Who are your target customers?" hint="e.g. Local families and students" htmlFor="targetCustomers">
        <TextInput id="targetCustomers" value={form.targetCustomers} onChange={(e) => update({ targetCustomers: e.target.value })} />
      </Field>
      <Field label="What makes your business different?" hint="Your USP — optional" htmlFor="usp">
        <TextInput id="usp" value={form.usp} onChange={(e) => update({ usp: e.target.value })} />
      </Field>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={goBack}>{t('onboarding_back')}</Button>
        <Button onClick={() => goNext()}>{t('onboarding_next')}</Button>
      </div>
    </div>
  )
}
