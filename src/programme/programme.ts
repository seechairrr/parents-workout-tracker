// The only place that reads data/programme.json. Components ask this module for
// what they need instead of importing the JSON themselves.
import raw from '../../data/programme.json'
import type {
  Activity,
  DayKey,
  Exercise,
  Prescription,
  Programme,
  Routine,
  ScheduleItem,
  Session,
  User,
} from './types'

export const programme = raw as unknown as Programme

export type UserId = keyof typeof raw.users & string

export const userIds = Object.keys(programme.users) as UserId[]

export function getUser(id: UserId): User {
  return programme.users[id]
}

export function getExercise(id: string): Exercise {
  const exercise = programme.exercises[id]
  if (!exercise) throw new Error(`Unknown exercise "${id}" in programme.json`)
  return exercise
}

export function getSession(id: string): Session {
  const session = programme.sessions[id]
  if (!session) throw new Error(`Unknown session "${id}" in programme.json`)
  return session
}

export function getActivity(id: string): Activity {
  const activity = programme.activities[id]
  if (!activity) throw new Error(`Unknown activity "${id}" in programme.json`)
  return activity
}

export function getRoutine(id: string): Routine {
  const routine = programme.routines[id]
  if (!routine) throw new Error(`Unknown routine "${id}" in programme.json`)
  return routine
}

export function getDayItems(userId: UserId, day: DayKey): ScheduleItem[] {
  return getUser(userId).schedule[day] ?? []
}

/** Every exercise in a session, in the order they're done (circuits flattened). */
export function sessionExercises(session: Session): Prescription[] {
  return session.format === 'sets'
    ? session.exercises
    : session.circuits.flatMap((c) => c.exercises)
}

export function isRestOnlyDay(items: ScheduleItem[]): boolean {
  return items.every((i) => i.type === 'activity' && i.id === 'rest')
}
