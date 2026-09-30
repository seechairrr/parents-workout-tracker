// The workout player's logic: where they are, what happens on each tap, and
// saving progress so a workout can be continued after closing the app.
import { useMemo, useState } from 'react'
import { getSession, type UserId } from '../programme/programme'
import { isoDate } from '../lib/dates'
import {
  getActiveWorkout,
  logSet,
  saveActiveWorkout,
  setSessionResult,
  setsFor,
  type ActiveWorkout,
} from '../storage/storage'
import { buildSteps, nextCircuitStart, type Step } from './steps'
import type { SetValues } from './prefill'

export type Phase = 'warmup' | 'work' | 'rest' | 'finished'

export interface Summary {
  setsDone: number
  minutes: number
}

function startOrResume(user: UserId, sessionId: string): ActiveWorkout {
  const today = isoDate(new Date())
  const active = getActiveWorkout(user)
  if (active && active.sessionId === sessionId && active.date === today) return active
  return {
    sessionId,
    date: today,
    startedAt: Date.now(),
    warmupDone: false,
    stepIndex: 0,
    restEndsAt: null,
    restTotalSec: 0,
  }
}

export function useWorkout(user: UserId, sessionId: string) {
  const session = getSession(sessionId)
  const steps = useMemo(() => buildSteps(session), [session])
  const [state, setState] = useState(() => startOrResume(user, sessionId))
  const [summary, setSummary] = useState<Summary | null>(null)

  const save = (next: ActiveWorkout) => {
    setState(next)
    saveActiveWorkout(user, next)
  }

  const finish = (result: 'finished' | 'ended') => {
    const done = setsFor(user, state.date, sessionId).filter((s) => s.completed).length
    if (result === 'finished' || done > 0) setSessionResult(user, state.date, sessionId, result)
    saveActiveWorkout(user, undefined)
    setSummary({ setsDone: done, minutes: Math.max(1, Math.round((Date.now() - state.startedAt) / 60000)) })
  }

  const log = (step: Step, values: SetValues, completed: boolean) =>
    logSet({
      date: state.date,
      user,
      sessionId,
      exerciseId: step.prescription.exercise,
      setNumber: step.number,
      weightKg: values.weightKg,
      reps: values.reps,
      seconds: values.seconds,
      completed,
    })

  /** Move to step `next`, resting `restSec` first. Finishes if there are no steps left. */
  const goTo = (next: number, restSec: number) => {
    if (next >= steps.length) return finish('finished')
    save({
      ...state,
      stepIndex: next,
      restEndsAt: restSec > 0 ? Date.now() + restSec * 1000 : null,
      restTotalSec: restSec,
    })
  }

  const phase: Phase = summary
    ? 'finished'
    : !state.warmupDone
      ? 'warmup'
      : state.restEndsAt !== null
        ? 'rest'
        : 'work'

  return {
    session,
    steps,
    phase,
    stepIndex: state.stepIndex,
    warmupDone: state.warmupDone,
    step: steps[state.stepIndex] as Step | undefined,
    restEndsAt: state.restEndsAt,
    restTotalSec: state.restTotalSec,
    summary,

    completeWarmup: () => save({ ...state, warmupDone: true }),

    completeStep: (values: SetValues) => {
      const step = steps[state.stepIndex]
      log(step, values, true)
      goTo(state.stepIndex + 1, step.restAfterSec)
    },

    endRest: () => save({ ...state, restEndsAt: null }),

    addRest: (sec: number) => {
      if (state.restEndsAt === null) return
      save({
        ...state,
        restEndsAt: Math.max(state.restEndsAt, Date.now()) + sec * 1000,
        restTotalSec: state.restTotalSec + sec,
      })
    },

    /** During the rest before a bonus round: skip the rest of this circuit. */
    finishCircuit: () => {
      const next = nextCircuitStart(steps, state.stepIndex)
      if (next >= steps.length) return finish('finished')
      save({ ...state, stepIndex: next })
    },

    /**
     * Straight sets: skip the remaining sets of this exercise.
     * Circuits: skip this exercise for this round only.
     * Skipped sets are logged as not completed.
     */
    skipExercise: (values: SetValues) => {
      const current = steps[state.stepIndex]
      let next = state.stepIndex
      do {
        log(steps[next], values, false)
        next++
      } while (
        current.circuitIndex === null &&
        next < steps.length &&
        steps[next].exerciseIndex === current.exerciseIndex
      )
      goTo(next, 0)
    },

    endWorkout: () => finish('ended'),
  }
}

export type Workout = ReturnType<typeof useWorkout>
