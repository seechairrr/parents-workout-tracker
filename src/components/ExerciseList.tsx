import { describePrescription, exerciseShortName } from '../programme/format'
import type { Prescription } from '../programme/types'
import styles from './ExerciseList.module.css'

interface Props {
  exercises: Prescription[]
  /** "rows": white rows with details (sets days). "compact": names only, inside a card. */
  variant: 'rows' | 'compact'
  start?: number
}

export function ExerciseList({ exercises, variant, start = 1 }: Props) {
  return (
    <ol className={styles[variant]} start={start}>
      {exercises.map((p, i) => (
        <li key={`${p.exercise}-${i}`} className={styles.item}>
          <span className={styles.number} aria-hidden="true">
            {start + i}
          </span>
          <span className={styles.text}>
            <span className={styles.name}>{exerciseShortName(p)}</span>
            {variant === 'rows' && <span className={styles.detail}>{describePrescription(p)}</span>}
          </span>
        </li>
      ))}
    </ol>
  )
}
