import { dayLong, dayShort } from '../lib/dates'
import type { DayStatus } from '../lib/weekStatus'
import type { DayKey } from '../programme/types'
import { Icon } from './Icon'
import styles from './WeekStrip.module.css'

export interface WeekDay {
  key: DayKey
  iso: string
  status: DayStatus
  isToday: boolean
}

interface Props {
  days: WeekDay[]
  selected: string
  onSelect: (iso: string) => void
}

const statusWords: Record<DayStatus, string> = {
  done: 'done',
  open: 'not done yet',
  upcoming: 'coming up',
}

export function WeekStrip({ days, selected, onSelect }: Props) {
  return (
    <nav aria-label="This week" className={styles.strip}>
      {days.map((d) => {
        const isSelected = d.iso === selected
        const label = `${dayLong[d.key]}${d.isToday ? ', today' : ''}, ${statusWords[d.status]}`
        return (
          <button
            key={d.iso}
            type="button"
            className={styles.day}
            data-selected={isSelected}
            data-today={d.isToday}
            aria-pressed={isSelected}
            aria-label={label}
            onClick={() => onSelect(d.iso)}
          >
            <span className={styles.name}>{dayShort[d.key]}</span>
            <span className={styles.mark} data-status={d.status} data-today={d.isToday}>
              {d.status === 'done' ? <Icon name="check" size={18} /> : null}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
