// All on-device storage lives here, so it can be swapped for a backend later
// (e.g. Supabase) without touching the screens.
//
// What's stored, per user:
// - activities marked done (walk, cycle, hike…) per day
// - daily routines (Dad's neck routine) marked done per day
// - every set logged in the workout player
// - sessions finished (or ended early) per day
// - the workout currently in progress, so it can be continued after closing the app
// - which exercise demos each person has seen

import type { UserId } from '../programme/programme'

const KEY = 'pwt:v1:log'

export interface SetLog {
  date: string
  user: UserId
  sessionId: string
  exerciseId: string
  /** Set number (straight sets) or round number (circuits). */
  setNumber: number
  weightKg: number | null
  reps: number | null
  seconds: number | null
  completed: boolean
  loggedAt: number
}

export type SessionResult = 'finished' | 'ended'

export interface ActiveWorkout {
  sessionId: string
  date: string
  startedAt: number
  warmupDone: boolean
  stepIndex: number
  /** Set while resting: when the rest ends (ms since 1970). */
  restEndsAt: number | null
  restTotalSec: number
}

interface Log {
  /** activities[userId][isoDate][activityId] = 'done' */
  activities: Record<string, Record<string, Record<string, 'done' | 'skipped'>>>
  /** routines[userId][isoDate][routineId] = true */
  routines: Record<string, Record<string, Record<string, boolean>>>
  sets: SetLog[]
  /** sessions[userId][isoDate][sessionId] = 'finished' | 'ended' */
  sessions: Record<string, Record<string, Record<string, SessionResult>>>
  active: Record<string, ActiveWorkout | undefined>
  /**
   * seen[userId][exerciseId]: 'video' once they've watched the demo video,
   * 'cues' if they only saw the written tips (no video existed yet).
   */
  seen: Record<string, Record<string, SeenLevel>>
}

export type SeenLevel = 'cues' | 'video'

const empty = (): Log => ({
  activities: {},
  routines: {},
  sets: [],
  sessions: {},
  active: {},
  seen: {},
})

// Keep a parsed copy in memory so we don't re-read the phone's storage on every screen update.
let cache: Log | null = null

function read(): Log {
  if (cache) return cache
  try {
    const text = localStorage.getItem(KEY)
    cache = text ? { ...empty(), ...(JSON.parse(text) as Partial<Log>) } : empty()
  } catch {
    cache = empty()
  }
  return cache
}

function write(log: Log): void {
  cache = log
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

// Activities and routines -----------------------------------------------------

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

// Workouts --------------------------------------------------------------------

export function logSet(entry: Omit<SetLog, 'loggedAt'>): void {
  const log = read()
  log.sets.push({ ...entry, loggedAt: Date.now() })
  write(log)
}

/** The most recent completed set of this exercise by this user, if any. */
export function lastSet(user: UserId, exerciseId: string): SetLog | undefined {
  const sets = read().sets
  for (let i = sets.length - 1; i >= 0; i--) {
    const s = sets[i]
    if (s.user === user && s.exerciseId === exerciseId && s.completed) return s
  }
  return undefined
}

export function setsFor(user: UserId, date: string, sessionId: string): SetLog[] {
  return read().sets.filter((s) => s.user === user && s.date === date && s.sessionId === sessionId)
}

export function sessionResult(user: UserId, date: string, sessionId: string): SessionResult | undefined {
  return read().sessions[user]?.[date]?.[sessionId]
}

export function setSessionResult(user: UserId, date: string, sessionId: string, result: SessionResult): void {
  const log = read()
  const day = ((log.sessions[user] ??= {})[date] ??= {})
  // Never downgrade a finished session to "ended" (e.g. when repeating it).
  if (day[sessionId] !== 'finished') day[sessionId] = result
  write(log)
}

export function getActiveWorkout(user: UserId): ActiveWorkout | undefined {
  return read().active[user]
}

export function saveActiveWorkout(user: UserId, workout: ActiveWorkout | undefined): void {
  const log = read()
  log.active[user] = workout
  write(log)
}

// Demos --------------------------------------------------------------------------

export function seenLevel(user: UserId, exerciseId: string): SeenLevel | undefined {
  return read().seen[user]?.[exerciseId]
}

export function markSeen(user: UserId, exerciseId: string, level: SeenLevel): void {
  const log = read()
  const mine = (log.seen[user] ??= {})
  if (mine[exerciseId] !== 'video') mine[exerciseId] = level
  write(log)
}

// Week ticks -------------------------------------------------------------------

/** True if anything at all was ticked off or logged for this user on this date. */
export function anythingDone(user: UserId, date: string): boolean {
  const log = read()
  const acts = log.activities[user]?.[date] ?? {}
  const routines = log.routines[user]?.[date] ?? {}
  const sessions = log.sessions[user]?.[date] ?? {}
  return (
    Object.values(acts).includes('done') ||
    Object.values(routines).includes(true) ||
    Object.keys(sessions).length > 0 ||
    log.sets.some((s) => s.user === user && s.date === date && s.completed)
  )
}
