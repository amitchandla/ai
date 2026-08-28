import { Sparkles } from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { useLanguage } from '../../context/LanguageContext'

export default function StepFinish({ form, onBack, onFinish, submitting, serverError }) {
  const { t } = useLanguage()

  const summaryRows = [
    ['Business', form.businessName],
    ['Category', form.category],
    ['Location', [form.area, form.city, form.state].filter(Boolean).join(', ')],
    ['Contact', form.whatsapp || form.phone],
  ].filter(([, v]) => v)

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2.5 text-brand">
          <Sparkles size={18} />
          <span className="font-display font-medium">Your Business Brain</span>
        </div>
        <p className="mt-1.5 text-sm text-ink-soft">
          This is what BizGrow AI will remember about your business — you can edit it anytime from Settings.
        </p>
        <dl className="mt-5 space-y-3">
          {summaryRows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-t border-line pt-3 text-sm first:border-0 first:pt-0">
              <dt className="text-ink-soft">{label}</dt>
              <dd className="text-right font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {serverError && <p className="rounded-[10px] bg-danger/10 px-3.5 py-2.5 text-sm text-danger">{serverError}</p>}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>{t('onboarding_back')}</Button>
        <Button onClick={onFinish} disabled={submitting}>
          {submitting ? '…' : t('onboarding_finish')}
        </Button>
      </div>
    </div>
  )
}
