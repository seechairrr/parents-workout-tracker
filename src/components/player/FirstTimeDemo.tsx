import { getExercise } from '../../programme/programme'
import { CueList } from '../CueList'
import { DemoVideo } from '../DemoVideo'
import { Icon } from '../Icon'
import styles from './FirstTimeDemo.module.css'
import stepStyles from './ExerciseStep.module.css'

interface Props {
  exerciseId: string
  onDone: () => void
}

/** Shown the first time someone meets an exercise: demo plays, then "Got it". */
export function FirstTimeDemo({ exerciseId, onDone }: Props) {
  const exercise = getExercise(exerciseId)
  return (
    <>
      <p className={styles.badge}>
        <Icon name="star" size={20} /> New exercise
      </p>
      <h1 className={styles.name}>{exercise.name}</h1>
      <div className={styles.video}>
        <DemoVideo exercise={exercise} autoplay />
      </div>
      <h2 className={styles.heading}>Remember</h2>
      <CueList cues={exercise.cues} />

      <div className={stepStyles.footer}>
        <button type="button" className={stepStyles.done} onClick={onDone}>
          Got it, let's go <Icon name="arrowRight" size={26} />
        </button>
      </div>
    </>
  )
}
