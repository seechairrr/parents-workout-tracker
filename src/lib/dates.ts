import type { DayKey } from '../programme/types'

export const dayKeys: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const dayShort: Record<DayKey, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

export const dayLong: Record<DayKey, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
}

export function dayKeyOf(date: Date): DayKey {
  // getDay() is 0 for Sunday; our week starts on Monday.
  return dayKeys[(date.getDay() + 6) % 7]
}

/** Local date as "2026-09-30", used as the key for logs. */
export function isoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** The seven dates (Mon–Sun) of the week containing `date`. */
export function weekOf(date: Date): { key: DayKey; date: Date; iso: string }[] {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  monday.setDate(monday.getDate() - dayKeys.indexOf(dayKeyOf(date)))
  return dayKeys.map((key, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { key, date: d, iso: isoDate(d) }
  })
}

export type PartOfDay = 'Morning' | 'Afternoon' | 'Evening'

export function partOfDay(date: Date): PartOfDay {
  const h = date.getHours()
  if (h < 12) return 'Morning'
  if (h < 17) return 'Afternoon'
  return 'Evening'
}
