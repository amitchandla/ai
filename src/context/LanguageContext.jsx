import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations, supportedLanguages } from '../config/translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'bizgrow_lang'

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    return supportedLanguages.includes(saved) ? saved : 'en'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en'
  }, [lang])

  const setLang = useCallback((next) => {
    if (supportedLanguages.includes(next)) setLangState(next)
  }, [])

  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, t, supportedLanguages }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
