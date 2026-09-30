import { Icon } from './Icon'
import ui from './ui.module.css'
import styles from './SessionAction.module.css'

export type SessionStatus = 'new' | 'active' | 'finished'

interface Props {
  status: SessionStatus
  startLabel: string
  onStart: () => void
}

/** The main button on a session card: start, continue, or (once done) do it again. */
export function SessionAction({ status, startLabel, onStart }: Props) {
  if (status === 'finished') {
    return (
      <>
        <p className={styles.done}>
          <span className={styles.tick}>
            <Icon name="check" size={20} />
          </span>
          Done today. Well done!
        </p>
        <button type="button" className={styles.again} onClick={onStart}>
          Do it again
        </button>
      </>
    )
  }
  return (
    <button type="button" className={ui.primaryButton} onClick={onStart}>
      <Icon name="play" size={22} /> {status === 'active' ? 'Continue workout' : startLabel}
    </button>
  )
}
