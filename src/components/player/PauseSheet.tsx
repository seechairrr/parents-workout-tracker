import { Sheet } from './Sheet'
import styles from './PauseSheet.module.css'

interface Props {
  canSkip: boolean
  onResume: () => void
  onSkip: () => void
  onEnd: () => void
}

export function PauseSheet({ canSkip, onResume, onSkip, onEnd }: Props) {
  return (
    <Sheet title="Paused" onClose={onResume}>
      <p className={styles.text}>Take your time. Everything you've done so far is saved.</p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={onResume}>
          Carry on
        </button>
        {canSkip && (
          <button type="button" className={styles.secondary} onClick={onSkip}>
            Skip this exercise
          </button>
        )}
        <button type="button" className={styles.secondary} onClick={onEnd}>
          End workout for today
        </button>
      </div>
      <p className={styles.safety}>Stop any exercise that causes sharp pain.</p>
    </Sheet>
  )
}
