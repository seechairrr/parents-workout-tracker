import { Icon } from '../Icon'
import styles from './SetDots.module.css'

/** ✓ ✓ ◉ ○ — done, current, still to come. Decorative: the text beside it says the same. */
export function SetDots({ current, total }: { current: number; total: number }) {
  return (
    <span className={styles.dots} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1
        const state = n < current ? 'done' : n === current ? 'current' : 'todo'
        return (
          <span key={n} className={styles.dot} data-state={state}>
            {state === 'done' && <Icon name="check" size={14} />}
          </span>
        )
      })}
    </span>
  )
}
