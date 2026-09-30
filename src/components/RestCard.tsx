import type { ScheduleItem } from '../programme/types'
import { activityName } from '../programme/format'
import { Icon } from './Icon'
import ui from './ui.module.css'
import styles from './ActivityCard.module.css'

export function RestCard({ item }: { item: ScheduleItem }) {
  return (
    <div className={`${ui.card} ${styles.row}`}>
      <span className={ui.iconCircle}>
        <Icon name="moonRest" size={28} />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{activityName(item.id)}</span>
        <span className={styles.note}>Resting is part of getting stronger. Enjoy it.</span>
      </span>
    </div>
  )
}
