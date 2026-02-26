'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Lang, Translation } from './types'
import { es } from './es'
import { en } from './en'

const translations: Record<Lang, Translation> = {
  es: es as unknown as Translation,
  en: en as unknown as Translation,
}

interface LanguageContextValue {
  lang: Lang
  t: Translation
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  t: es as unknown as Translation,
  setLang: () => {},
})

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang
  children: ReactNode
}) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    // Persist in cookie so server components pick it up on next render
    document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useT = () => useContext(LanguageContext).t
export const useLang = () => useContext(LanguageContext)
