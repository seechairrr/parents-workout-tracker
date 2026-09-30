// Turns programme data into the short plain-English lines shown on screen.
import { getActivity, getExercise, getSession, sessionExercises } from './programme'
import type { Prescription, Range, Session } from './types'

export function formatRange({ min, max }: Range): string {
  return min === max ? `${min}` : `${min}–${max}`
}

/** "8–10 reps", "30–40 sec" */
export function describeWork(p: Prescription): string {
  if (p.reps) return `${formatRange(p.reps)} reps`
  if (p.durationSec) return `${formatRange(p.durationSec)} sec`
  return ''
}

/** "3 sets × 8–10 reps, each side" (sets) or "8 reps, each side" (circuits) */
export function describePrescription(p: Prescription): string {
  const work = describeWork(p)
  const main = p.sets ? `${p.sets} sets × ${work}` : work
  return p.perSide ? `${main}, each side` : main
}

export function exerciseName(p: Prescription): string {
  return getExercise(p.exercise).name
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

/** "~35 min · 5 exercises" or "~12 min · 3 exercises, in a loop" */
export function describeSession(session: Session): string {
  const count = new Set(sessionExercises(session).map((p) => p.exercise)).size
  const base = `~${session.estMinutes} min · ${plural(count, 'exercise')}`
  if (session.format === 'sets') return base
  return session.circuits.length === 1
    ? `${base}, in a loop`
    : `${base}, in ${session.circuits.length} loops`
}

/** "2–3 rounds" */
export function describeRounds(rounds: Range): string {
  return `${formatRange(rounds)} rounds`
}

export function describeWarmup(session: Session): string {
  return session.warmup.base ? '5-min warm-up first' : 'Short warm-up first'
}

export function sessionTitle(id: string): string {
  return getSession(id).title
}

export function activityName(id: string): string {
  return getActivity(id).name
}
