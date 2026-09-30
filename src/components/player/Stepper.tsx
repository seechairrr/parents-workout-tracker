import { Icon } from '../Icon'
import styles from './Stepper.module.css'

interface Props {
  label: string
  /** Text read out and shown for the value, e.g. "5" with unit "kg". */
  display: string
  unit?: string
  onLess: () => void
  onMore: () => void
  canLess: boolean
  canMore: boolean
}

/** Big − value + control, so nobody has to type. */
export function Stepper({ label, display, unit, onLess, onMore, canLess, canMore }: Props) {
  return (
    <div className={styles.card} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.button}
        onClick={onLess}
        disabled={!canLess}
        aria-label={`Less ${label.toLowerCase()}`}
      >
        <Icon name="minus" size={28} />
      </button>
      <div className={styles.middle}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value} aria-live="polite">
          {display}
          {unit && <span className={styles.unit}> {unit}</span>}
        </span>
      </div>
      <button
        type="button"
        className={styles.button}
        onClick={onMore}
        disabled={!canMore}
        aria-label={`More ${label.toLowerCase()}`}
      >
        <Icon name="plus" size={28} />
      </button>
    </div>
  )
}
