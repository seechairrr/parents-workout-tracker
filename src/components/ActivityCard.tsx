import type { Activity, ScheduleItem } from '../programme/types'
import { activityIcon, Icon } from './Icon'
import { Eyebrow } from './Eyebrow'
import ui from './ui.module.css'
import styles from './ActivityCard.module.css'

interface Props {
  item: ScheduleItem
  activity: Activity
  done: boolean
  /** Undefined for days in the future, where there's nothing to tick yet. */
  onToggle?: () => void
}

export function ActivityCard({ item, activity, done, onToggle }: Props) {
  const title = activity.defaultMinutes
    ? `${activity.name} · ${activity.defaultMinutes} min`
    : activity.name

  const content = (
    <>
      <span className={ui.iconCircle}>
        <Icon name={activityIcon[item.id] ?? 'walk'} size={28} />
      </span>
      <span className={styles.text}>
        <Eyebrow item={item} />
        <span className={styles.title}>{title}</span>
        {item.note && <span className={styles.note}>{item.note}</span>}
        {onToggle && (
          <span className={styles.action}>{done ? 'Done. Nice work!' : 'Tap when done'}</span>
        )}
      </span>
      {onToggle && (
        <span className={ui.doneCircle} data-done={done}>
          {done && <Icon name="check" size={26} />}
        </span>
      )}
    </>
  )

  if (!onToggle) return <div className={`${ui.card} ${styles.row}`}>{content}</div>

  return (
    <button
      type="button"
      className={`${ui.card} ${styles.row}`}
      aria-pressed={done}
      onClick={onToggle}
    >
      {content}
    </button>
  )
}
