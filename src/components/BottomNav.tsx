import type { UserId } from '../programme/programme'
import { Avatar } from './Avatar'
import { Icon } from './Icon'
import styles from './BottomNav.module.css'

export type Tab = 'today' | 'exercises'

interface Props {
  user: UserId
  active: Tab
  onTab: (tab: Tab) => void
  onSwitch: () => void
}

export function BottomNav({ user, active, onTab, onSwitch }: Props) {
  return (
    <nav className={styles.bar} aria-label="Main">
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.tab}
          aria-current={active === 'today' ? 'page' : undefined}
          onClick={() => onTab('today')}
        >
          <Icon name="home" />
          Today
        </button>
        <button
          type="button"
          className={styles.tab}
          aria-current={active === 'exercises' ? 'page' : undefined}
          onClick={() => onTab('exercises')}
        >
          <Icon name="library" />
          Exercises
        </button>
        <button type="button" className={styles.tab} onClick={onSwitch}>
          <Avatar user={user} size={26} />
          Switch
        </button>
      </div>
    </nav>
  )
}
