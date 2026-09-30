import { getUser, userIds, type UserId } from '../programme/programme'
import { partOfDay } from '../lib/dates'
import { Avatar } from './Avatar'
import { Icon } from './Icon'
import styles from './ProfilePicker.module.css'

export function ProfilePicker({ onPick }: { onPick: (user: UserId) => void }) {
  const greeting = `Good ${partOfDay(new Date()).toLowerCase()}`

  return (
    <main className={styles.screen}>
      <p className={styles.greeting}>{greeting}</p>
      <h1 className={styles.title}>Who's working out today?</h1>
      <ul className={styles.list}>
        {userIds.map((id) => (
          <li key={id}>
            <button type="button" className={styles.profile} onClick={() => onPick(id)}>
              <Avatar user={id} size={76} />
              <span className={styles.text}>
                <span className={styles.name}>{getUser(id).displayName}</span>
                <span className={styles.hint}>Tap to begin</span>
              </span>
              <span className={styles.chevron}>
                <Icon name="chevronRight" size={28} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
