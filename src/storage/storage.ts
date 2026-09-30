// All on-device storage lives here, so it can be swapped for a backend later
// (e.g. Supabase) without touching the screens.
//
// Slice 1 stores:
// - optional/daily activities marked done (walk, cycle, hike…) per user per day
// - daily routines (Dad's neck routine) marked done per user per day

import type { UserId } from '../programme/programme'

const KEY = 'pwt:v1:log'

interface Log {
  /** activities[userId][isoDate][activityId] = 'done' */
  activities: Record<string, Record<string, Record<string, 'done' | 'skipped'>>>
  /** routines[userId][isoDate][routineId] = true */
  routines: Record<string, Record<string, Record<string, boolean>>>
}

const empty = (): Log => ({ activities: {}, routines: {} })

function read(): Log {
  try {
    const text = localStorage.getItem(KEY)
    return text ? { ...empty(), ...(JSON.parse(text) as Partial<Log>) } : empty()
  } catch {
    return empty()
  }
}

function write(log: Log): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(log))
  } catch {
    // Storage full or blocked (e.g. private browsing). The app still works for this visit.
  }
  listeners.forEach((fn) => fn())
}

const listeners = new Set<() => void>()

/** Call `fn` whenever anything is saved. Returns an unsubscribe function. */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function isActivityDone(user: UserId, date: string, activityId: string): boolean {
  return read().activities[user]?.[date]?.[activityId] === 'done'
}

export function setActivityDone(user: UserId, date: string, activityId: string, done: boolean): void {
  const log = read()
  const day = ((log.activities[user] ??= {})[date] ??= {})
  if (done) day[activityId] = 'done'
  else delete day[activityId]
  write(log)
}

export function isRoutineDone(user: UserId, date: string, routineId: string): boolean {
  return read().routines[user]?.[date]?.[routineId] === true
}

export function setRoutineDone(user: UserId, date: string, routineId: string, done: boolean): void {
  const log = read()
  const day = ((log.routines[user] ??= {})[date] ??= {})
  if (done) day[routineId] = true
  else delete day[routineId]
  write(log)
}

/** True if anything at all was ticked off for this user on this date. */
export function anythingDone(user: UserId, date: string): boolean {
  const log = read()
  const acts = log.activities[user]?.[date] ?? {}
  const routines = log.routines[user]?.[date] ?? {}
  return Object.values(acts).includes('done') || Object.values(routines).includes(true)
}
