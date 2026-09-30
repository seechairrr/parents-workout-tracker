import { getDayItems, isRestOnlyDay, type UserId } from '../programme/programme'
import type { DayKey } from '../programme/types'
import { anythingDone } from '../storage/storage'

export type DayStatus = 'done' | 'open' | 'upcoming'

/**
 * A day shows a tick if something was ticked off, or if it was a rest day
 * that has already passed. Missed days just stay as an empty ring: no guilt.
 */
export function dayStatus(user: UserId, day: DayKey, iso: string, todayIso: string): DayStatus {
  if (anythingDone(user, iso)) return 'done'
  if (iso > todayIso) return 'upcoming'
  if (iso < todayIso && isRestOnlyDay(getDayItems(user, day))) return 'done'
  return 'open'
}
