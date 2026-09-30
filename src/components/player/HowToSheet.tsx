import { getExercise } from '../../programme/programme'
import { CueList } from '../CueList'
import { DemoVideo } from '../DemoVideo'
import { Sheet } from './Sheet'
import styles from './HowToSheet.module.css'

/** Demo video (tap to play) and form tips, opened from the "How to" button. */
export function HowToSheet({ exerciseId, onClose }: { exerciseId: string; onClose: () => void }) {
  const exercise = getExercise(exerciseId)
  return (
    <Sheet title="How to" onClose={onClose}>
      <h3 className={styles.name}>{exercise.name}</h3>
      <div className={styles.video}>
        <DemoVideo exercise={exercise} />
      </div>
      {exercise.why && <p className={styles.why}>{exercise.why}</p>}
      <CueList cues={exercise.cues} />
    </Sheet>
  )
}
