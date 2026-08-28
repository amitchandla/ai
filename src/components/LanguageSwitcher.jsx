import { Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../config/translations'

export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang, supportedLanguages } = useLanguage()

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Globe size={15} className="pointer-events-none absolute left-2.5 text-ink-soft" />
      <select
        aria-label="Choose your preferred language"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="cursor-pointer appearance-none rounded-full border border-line bg-transparent py-1.5 pl-7 pr-3 text-sm font-medium text-ink-soft hover:border-brand focus:border-brand"
      >
        {supportedLanguages.map((code) => (
          <option key={code} value={code}>
            {translations[code].langName}
          </option>
        ))}
      </select>
    </div>
  )
}
