import { getExercise } from '../../programme/programme'
import { describePrescription } from '../../programme/format'
import type { WarmupPlan } from '../../player/warmup'
import { unlockAudio } from '../../lib/chime'
import { Icon } from '../Icon'
import styles from './WarmupStep.module.css'
import stepStyles from './ExerciseStep.module.css'

export function WarmupStep({ plan, onDone }: { plan: WarmupPlan; onDone: () => void }) {
  return (
    <>
      <h1 className={stepStyles.name}>{plan.title}</h1>
      <p className={styles.intro}>Get the blood flowing. Go at an easy pace.</p>

      {plan.note && <p className={styles.note}>{plan.note}</p>}

      {plan.items.length > 0 && (
        <ol className={styles.list}>
          {plan.items.map((item, i) => (
            <li key={`${item.exercise}-${i}`} className={styles.item}>
              <span className={styles.number} aria-hidden="true">
                {i + 1}
              </span>
              <span>
                <span className={styles.name}>{getExercise(item.exercise).name}</span>
                <span className={styles.detail}>{item.note ?? describePrescription(item)}</span>
              </span>
            </li>
          ))}
        </ol>
      )}

      {plan.finalNote && <p className={styles.note}>{plan.finalNote}</p>}

      <div className={stepStyles.footer}>
        <button
          type="button"
          className={stepStyles.done}
          onClick={() => {
            unlockAudio()
            onDone()
          }}
        >
          <Icon name="check" size={26} /> Warm-up done
        </button>
      </div>
    </>
  )
}
