import { getExercise } from '../../programme/programme'
import { categoryLabel } from '../../programme/library'
import { CueList } from '../CueList'
import { DemoVideo } from '../DemoVideo'
import { Icon } from '../Icon'
import styles from './ExerciseDetail.module.css'

interface Props {
  exerciseId: string
  onBack: () => void
}

export function ExerciseDetail({ exerciseId, onBack }: Props) {
  const exercise = getExercise(exerciseId)
  const main = exercise.musclesPrimary ?? []
  const also = exercise.musclesSecondary ?? []

  return (
    <main className={styles.screen}>
      <button type="button" className={styles.back} onClick={onBack}>
        <Icon name="chevronLeft" size={22} /> Exercises
      </button>

      <p className={styles.category}>{categoryLabel(exercise)}</p>
      <h1 className={styles.title}>{exercise.shortName ?? exercise.name}</h1>
      {exercise.shortName && <p className={styles.fullName}>{exercise.name}</p>}

      <div className={styles.video}>
        <DemoVideo exercise={exercise} />
      </div>

      {main.length > 0 && (
        <section className={styles.card} aria-labelledby="muscles">
          <h2 id="muscles" className={styles.cardTitle}>
            Muscles worked
          </h2>
          <h3 className={styles.chipLabel}>Main</h3>
          <ul className={styles.chips}>
            {main.map((m) => (
              <li key={m} className={styles.chipMain}>
                {m}
              </li>
            ))}
          </ul>
          {also.length > 0 && (
            <>
              <h3 className={styles.chipLabel}>Also helps</h3>
              <ul className={styles.chips}>
                {also.map((m) => (
                  <li key={m} className={styles.chipAlso}>
                    {m}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {exercise.why && (
        <section className={styles.why}>
          <Icon name="heart" size={24} />
          <div>
            <h2 className={styles.whyTitle}>Why it matters</h2>
            <p>{exercise.why}</p>
          </div>
        </section>
      )}

      <h2 className={styles.heading}>How to do it</h2>
      <CueList cues={exercise.cues} />
    </main>
  )
}
