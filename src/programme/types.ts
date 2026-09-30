// Types describing data/programme.json. They only cover the fields the app reads.

export interface Range {
  min: number
  max: number
}

export interface Exercise {
  name: string
  /** Shorter name for tight lists, e.g. "Dumbbell RDL". Falls back to `name`. */
  shortName?: string
  type: 'strength' | 'warmup' | 'mobility'
  category?: string
  status?: 'locked'
  musclesPrimary?: string[]
  musclesSecondary?: string[]
  why?: string
  cues: string[]
  equipment?: string[]
  restClass?: 'big' | 'small' | 'core'
  videoUrl: string | null
  videoStartSec?: number | null
  videoEndSec?: number | null
}

/** One exercise as it appears inside a session, warm-up or routine. */
export interface Prescription {
  exercise: string
  sets?: number
  reps?: Range
  durationSec?: Range
  holdSec?: number
  perSide?: boolean
  restSec?: number
  note?: string
}

export interface Circuit {
  rounds: Range
  betweenExercisesSec: number
  betweenRoundsSec: number
  exercises: Prescription[]
}

interface SessionBase {
  title: string
  estMinutes: number
  optional?: boolean
  warmup: SessionWarmup
  after?: string[]
}

export interface SetsSession extends SessionBase {
  format: 'sets'
  exercises: Prescription[]
  betweenExercisesSec: number
}

export interface CircuitSession extends SessionBase {
  format: 'circuit'
  circuits: Circuit[]
}

export type Session = SetsSession | CircuitSession

export interface Routine {
  title: string
  estMinutes: number
  items: Prescription[]
  safetyNote?: string
}

export interface Activity {
  name: string
  defaultMinutes?: number
}

export type TimeOfDay = 'morning' | 'evening'

export interface ScheduleItem {
  type: 'session' | 'activity'
  id: string
  optional?: boolean
  time?: TimeOfDay
  note?: string
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface User {
  displayName: string
  dailyRoutines: string[]
  schedule: Record<DayKey, ScheduleItem[]>
}

export interface WarmupItem {
  exercise: string
  reps?: Range
  durationSec?: Range
  perSide?: boolean
  note?: string
}

/** Each session's own warm-up, matched to that day's exercises. */
export interface SessionWarmup {
  estMinutes: number
  items: WarmupItem[]
  finalNote?: string
}

export interface RestDefaults {
  sets: { bigLiftSec: number; smallMoveSec: number; coreSec: number; betweenExercisesSec: number }
  circuit: { betweenExercisesSec: number; betweenRoundsSec: number }
}

export interface Programme {
  version: number
  restDefaults: RestDefaults
  progression: { rule: string; availableWeightsKg: number[] }
  exercises: Record<string, Exercise>
  routines: Record<string, Routine>
  sessions: Record<string, Session>
  activities: Record<string, Activity>
  users: Record<string, User>
}
