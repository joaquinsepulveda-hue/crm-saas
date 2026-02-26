import { cookies } from 'next/headers'
import type { Translation } from './types'

export async function getT(): Promise<Translation> {
  const lang = (await cookies()).get('lang')?.value ?? 'es'
  if (lang === 'en') {
    const { en } = await import('./en')
    return en as unknown as Translation
  }
  const { es } = await import('./es')
  return es
}
