import { Button, Field, TextInput } from '../../components/ui'
import { useLanguage } from '../../context/LanguageContext'

export default function StepProducts({ form, update, goNext, goBack }) {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <Field label="Products" hint="Separate with commas — e.g. Pizza, Burger, Pasta" htmlFor="products">
        <TextInput id="products" value={form.products} onChange={(e) => update({ products: e.target.value })} />
      </Field>
      <Field label="Services" hint="Separate with commas — optional" htmlFor="services">
        <TextInput id="services" value={form.services} onChange={(e) => update({ services: e.target.value })} />
      </Field>
      <Field label="Prices" hint="Rough price range is fine — e.g. ₹150–₹400" htmlFor="prices">
        <TextInput id="prices" value={form.prices} onChange={(e) => update({ prices: e.target.value })} />
      </Field>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={goBack}>{t('onboarding_back')}</Button>
        <Button onClick={() => goNext()}>{t('onboarding_next')}</Button>
      </div>
    </div>
  )
}
