import { getExercise } from '../../programme/programme'
import { Sheet } from './Sheet'
import styles from './HowToSheet.module.css'

/** Form tips from the programme. Demo videos come in the next slice. */
export function HowToSheet({ exerciseId, onClose }: { exerciseId: string; onClose: () => void }) {
  const exercise = getExercise(exerciseId)
  return (
    <Sheet title="How to" onClose={onClose}>
      <h3 className={styles.name}>{exercise.name}</h3>
      {exercise.why && <p className={styles.why}>{exercise.why}</p>}
      <ol className={styles.cues}>
        {exercise.cues.map((cue, i) => (
          <li key={cue} className={styles.cue}>
            <span className={styles.number} aria-hidden="true">
              {i + 1}
            </span>
            {cue}
          </li>
        ))}
      </ol>
      {exercise.musclesPrimary && exercise.musclesPrimary.length > 0 && (
        <p className={styles.muscles}>Works: {exercise.musclesPrimary.join(', ')}</p>
      )}
    </Sheet>
  )
}
