import { getRoutine } from '../programme/programme'
import { dayShort } from '../lib/dates'
import type { DayKey } from '../programme/types'
import { Icon } from './Icon'
import ui from './ui.module.css'
import styles from './RoutineCard.module.css'

export interface RoutineDay {
  key: DayKey
  iso: string
  done: boolean
  isSelected: boolean
}

interface Props {
  routineId: string
  done: boolean
  week: RoutineDay[]
  /** Undefined for days in the future. */
  onToggle?: () => void
}

export function RoutineCard({ routineId, done, week, onToggle }: Props) {
  const routine = getRoutine(routineId)
  return (
    <section className={`${ui.card} ${styles.card}`} aria-label={routine.title}>
      <div className={styles.header}>
        <span className={ui.iconCircle}>
          <Icon name="person" size={28} />
        </span>
        <div>
          <p className={ui.eyebrow}>Every day</p>
          <h3 className={styles.title}>
            {routine.title} <span className={styles.minutes}>· {routine.estMinutes} min</span>
          </h3>
        </div>
      </div>

      {onToggle && (
        <button
          type="button"
          className={styles.toggle}
          data-done={done}
          aria-pressed={done}
          onClick={onToggle}
        >
          <span className={ui.doneCircle} data-done={done}>
            {done && <Icon name="check" size={26} />}
          </span>
          {done ? 'Done today. Well done!' : 'Tap when done today'}
        </button>
      )}

      <ol className={styles.week} aria-label="This week">
        {week.map((d) => (
          <li key={d.iso} className={styles.day}>
            <span aria-hidden="true">{dayShort[d.key].charAt(0)}</span>
            <span className="visually-hidden">
              {dayShort[d.key]}: {d.done ? 'done' : 'not done'}
            </span>
            <span
              className={styles.mark}
              data-done={d.done}
              data-selected={d.isSelected}
              aria-hidden="true"
            >
              {d.done && <Icon name="check" size={14} />}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
