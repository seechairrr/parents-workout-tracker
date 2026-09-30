import { Icon } from '../Icon'
import styles from './PlayerTopBar.module.css'

interface Props {
  /** 0-based index of the current exercise, or -1 during the warm-up. */
  current: number
  count: number
  onPause: () => void
  onOverview: () => void
}

export function PlayerTopBar({ current, count, onPause, onOverview }: Props) {
  return (
    <div className={styles.bar}>
      <button type="button" className={styles.pause} onClick={onPause}>
        <Icon name="pause" size={20} /> Pause
      </button>
      <button type="button" className={styles.progress} onClick={onOverview}>
        <span className={styles.label}>
          {current < 0 ? (
            'Warm-up'
          ) : (
            <>
              Exercise <strong>{current + 1}</strong> of {count}
            </>
          )}
          <Icon name="chevronRight" size={20} />
          <span className="visually-hidden">, see overview</span>
        </span>
        <span className={styles.segments} aria-hidden="true">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className={styles.segment} data-done={i <= current} />
          ))}
        </span>
      </button>
    </div>
  )
}
