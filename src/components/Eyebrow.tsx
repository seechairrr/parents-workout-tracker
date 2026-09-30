import type { ScheduleItem } from '../programme/types'
import { Icon } from './Icon'
import ui from './ui.module.css'

/** Small line above a card title: "Morning", "Evening", and/or "Optional". */
export function Eyebrow({ item }: { item: ScheduleItem }) {
  if (!item.time && !item.optional) return null
  return (
    <p className={ui.eyebrow}>
      {item.time === 'morning' && (
        <>
          <Icon name="sun" size={20} /> Morning
        </>
      )}
      {item.time === 'evening' && (
        <>
          <Icon name="moon" size={20} /> Evening
        </>
      )}
      {item.optional && <span className={ui.optionalTag}>Optional</span>}
    </p>
  )
}
