// Turns a session from programme.json into a flat list of steps: one step per
// set (straight sets) or per exercise per round (circuits), each with the rest
// that follows it. The player just walks through this list.
import { getExercise, programme } from '../programme/programme'
import type { Prescription, Session } from '../programme/types'

export interface Step {
  prescription: Prescription
  /** Position of this exercise in the session (0-based), for "Exercise 2 of 5". */
  exerciseIndex: number
  exerciseCount: number
  /** Set number (sets) or round number (circuits), 1-based. */
  number: number
  /** Total sets, or the most rounds in this circuit. */
  total: number
  /** Circuits only: rounds above the minimum are a bonus and can be skipped. */
  bonus: boolean
  circuitIndex: number | null
  /** Rest after this step, in seconds. 0 for the last step. */
  restAfterSec: number
  /** Whether this is the last step of its round (circuits) or exercise (sets). */
  endsGroup: boolean
}

function setRestSec(p: Prescription): number {
  if (p.restSec) return p.restSec
  const d = programme.restDefaults.sets
  const restClass = getExercise(p.exercise).restClass
  return restClass === 'core' ? d.coreSec : restClass === 'small' ? d.smallMoveSec : d.bigLiftSec
}

export function buildSteps(session: Session): Step[] {
  const steps: Step[] = []

  if (session.format === 'sets') {
    const count = session.exercises.length
    const between = session.betweenExercisesSec ?? programme.restDefaults.sets.betweenExercisesSec
    session.exercises.forEach((p, exerciseIndex) => {
      const sets = p.sets ?? 1
      for (let n = 1; n <= sets; n++) {
        const lastSet = n === sets
        steps.push({
          prescription: p,
          exerciseIndex,
          exerciseCount: count,
          number: n,
          total: sets,
          bonus: false,
          circuitIndex: null,
          restAfterSec: lastSet ? between : setRestSec(p),
          endsGroup: lastSet,
        })
      }
    })
  } else {
    const count = session.circuits.reduce((sum, c) => sum + c.exercises.length, 0)
    let offset = 0
    session.circuits.forEach((circuit, circuitIndex) => {
      for (let round = 1; round <= circuit.rounds.max; round++) {
        circuit.exercises.forEach((p, i) => {
          const lastInRound = i === circuit.exercises.length - 1
          steps.push({
            prescription: p,
            exerciseIndex: offset + i,
            exerciseCount: count,
            number: round,
            total: circuit.rounds.max,
            bonus: round > circuit.rounds.min,
            circuitIndex,
            restAfterSec: lastInRound ? circuit.betweenRoundsSec : circuit.betweenExercisesSec,
            endsGroup: lastInRound,
          })
        })
      }
      offset += circuit.exercises.length
    })
  }

  if (steps.length) steps[steps.length - 1].restAfterSec = 0
  return steps
}

/** Index of the first step after the current circuit, or steps.length if none. */
export function nextCircuitStart(steps: Step[], from: number): number {
  const circuit = steps[from].circuitIndex
  let i = from
  while (i < steps.length && steps[i].circuitIndex === circuit) i++
  return i
}

/**
 * True when the step at `index` starts a bonus round, so the rest screen
 * before it can offer "finish this circuit" instead.
 */
export function startsBonusRound(steps: Step[], index: number): boolean {
  const step = steps[index]
  if (!step?.bonus) return false
  const prev = steps[index - 1]
  return !prev || prev.circuitIndex !== step.circuitIndex || prev.number !== step.number
}
