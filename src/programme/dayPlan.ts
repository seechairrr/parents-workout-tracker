// Works out which cards to show for one person on one day, in order.
import { getActivity, getDayItems, getSession, getUser, type UserId } from './programme'
import type { Activity, DayKey, ScheduleItem, Session } from './types'

export type PlanCard =
  | { kind: 'session'; item: ScheduleItem; session: Session }
  | { kind: 'activity'; item: ScheduleItem; activity: Activity }
  | { kind: 'rest'; item: ScheduleItem }
  | { kind: 'routine'; routineId: string }

function toCard(item: ScheduleItem): PlanCard {
  if (item.type === 'session') return { kind: 'session', item, session: getSession(item.id) }
  if (item.id === 'rest') return { kind: 'rest', item }
  return { kind: 'activity', item, activity: getActivity(item.id) }
}

/**
 * Morning and untimed items come first, then daily routines (e.g. Dad's neck
 * routine), then evening items. This matches the Friday design:
 * cycle (morning) → neck routine → core circuit (evening).
 */
export function buildDayPlan(userId: UserId, day: DayKey): PlanCard[] {
  const items = getDayItems(userId, day)
  const early = items.filter((i) => i.time !== 'evening').map(toCard)
  const late = items.filter((i) => i.time === 'evening').map(toCard)
  const routines = getUser(userId).dailyRoutines.map(
    (routineId): PlanCard => ({ kind: 'routine', routineId }),
  )
  return [...early, ...routines, ...late]
}
