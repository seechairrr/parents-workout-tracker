import { useState } from 'react'
import { getExercise, type UserId } from '../../programme/programme'
import { describeAim, describeWork, exerciseShortName } from '../../programme/format'
import { prefill, weightOptions, type SetValues } from '../../player/prefill'
import type { Step } from '../../player/steps'
import { unlockAudio } from '../../lib/chime'
import { Icon } from '../Icon'
import { HowToSheet } from './HowToSheet'
import { SetDots } from './SetDots'
import { SetTimer } from './SetTimer'
import { Stepper } from './Stepper'
import styles from './ExerciseStep.module.css'

interface Props {
  user: UserId
  step: Step
  next: Step | undefined
  onDone: (values: SetValues) => void
}

export function ExerciseStep({ user, step, next, onDone }: Props) {
  const p = step.prescription
  const exercise = getExercise(p.exercise)
  const [values, setValues] = useState<SetValues>(() => prefill(user, p))
  const [showHowTo, setShowHowTo] = useState(false)
  const weights = weightOptions(p.exercise)
  const isCircuit = step.circuitIndex !== null

  const weightIndex = weights && values.weightKg !== null ? weights.indexOf(values.weightKg) : -1
  const setWeight = (i: number) => weights && setValues({ ...values, weightKg: weights[i] })
  const setReps = (reps: number) => setValues({ ...values, reps })
  const setSeconds = (seconds: number) => setValues({ ...values, seconds })

  const doneLabel = !next ? 'Done, finish workout' : isCircuit ? 'Done, next exercise' : 'Set done'

  return (
    <>
      <h1 className={styles.name}>{exercise.name}</h1>

      <div className={styles.setRow}>
        <div>
          <p className={styles.setLabel}>
            {isCircuit ? 'Round' : 'Set'} {step.number} of {step.total}{' '}
            <SetDots current={step.number} total={step.total} />
          </p>
          {step.bonus && <p className={styles.bonus}>Bonus round: only if you feel good</p>}
          <p className={styles.aim}>{describeAim(p)}</p>
        </div>
        <button type="button" className={styles.howTo} onClick={() => setShowHowTo(true)}>
          <Icon name="playCircle" size={26} /> How to
        </button>
      </div>

      {p.note && <p className={styles.note}>{p.note}</p>}

      <div className={styles.steppers}>
        {weights && weightIndex >= 0 && (
          <Stepper
            label="Weight"
            display={values.weightKg === 0 ? 'None' : String(values.weightKg)}
            unit={values.weightKg === 0 ? undefined : 'kg'}
            onLess={() => setWeight(weightIndex - 1)}
            onMore={() => setWeight(weightIndex + 1)}
            canLess={weightIndex > 0}
            canMore={weightIndex < weights.length - 1}
          />
        )}
        {values.reps !== null && (
          <Stepper
            label={p.perSide ? 'Reps (each side)' : 'Reps'}
            display={String(values.reps)}
            onLess={() => setReps(values.reps! - 1)}
            onMore={() => setReps(values.reps! + 1)}
            canLess={values.reps > 1}
            canMore={values.reps < 50}
          />
        )}
        {values.seconds !== null && (
          <>
            <Stepper
              label={p.perSide ? 'Seconds (each side)' : 'Seconds'}
              display={String(values.seconds)}
              onLess={() => setSeconds(values.seconds! - 5)}
              onMore={() => setSeconds(values.seconds! + 5)}
              canLess={values.seconds > 5}
              canMore={values.seconds < 300}
            />
            <SetTimer seconds={values.seconds} />
          </>
        )}
      </div>

      {isCircuit && next && (
        <div className={styles.upNext}>
          <span className={styles.upNextIcon}>
            <Icon name="arrowRight" size={22} />
          </span>
          <span>
            <span className={styles.upNextLabel}>
              Up next{next.number !== step.number ? ` · Round ${next.number}` : ''}
            </span>
            <span className={styles.upNextName}>
              {exerciseShortName(next.prescription)}{' '}
              <span className={styles.upNextWork}>· {describeWork(next.prescription)}</span>
            </span>
          </span>
        </div>
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.done}
          onClick={() => {
            unlockAudio()
            onDone(values)
          }}
        >
          <Icon name="check" size={26} /> {doneLabel}
        </button>
      </div>

      {showHowTo && <HowToSheet exerciseId={p.exercise} onClose={() => setShowHowTo(false)} />}
    </>
  )
}
