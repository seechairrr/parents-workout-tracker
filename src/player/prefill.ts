// Works out the starting weight/reps/seconds for a set, so they only have to
// tap "Set done" (or nudge a stepper) instead of typing.
import { getExercise, programme, type UserId } from '../programme/programme'
import type { Prescription } from '../programme/types'
import { lastSet } from '../storage/storage'

/**
 * The weights they can pick for this exercise, lightest first, or null if it
 * doesn't use dumbbells. 0 means "no weight" (for moves where dumbbells are optional).
 */
export function weightOptions(exerciseId: string): number[] | null {
  const equipment = getExercise(exerciseId).equipment ?? []
  const dumbbells = equipment.filter((e) => e.includes('dumbbell'))
  if (dumbbells.length === 0) return null
  const weights = [...programme.progression.availableWeightsKg].sort((a, b) => a - b)
  const optional = dumbbells.every((e) => e.startsWith('optional'))
  return optional ? [0, ...weights] : weights
}

function closest(options: number[], value: number): number {
  return options.reduce((best, o) => (Math.abs(o - value) < Math.abs(best - value) ? o : best))
}

export interface SetValues {
  weightKg: number | null
  reps: number | null
  seconds: number | null
}

/** Last time's numbers if there are any; otherwise the lightest weight and the top of the range. */
export function prefill(user: UserId, p: Prescription): SetValues {
  const last = lastSet(user, p.exercise)
  const options = weightOptions(p.exercise)
  return {
    weightKg: options ? closest(options, last?.weightKg ?? options[0]) : null,
    reps: p.reps ? (last?.reps ?? p.reps.max) : null,
    seconds: p.durationSec ? (last?.seconds ?? p.durationSec.max) : null,
  }
}
