import { getRoutine, getUser, type UserId } from '../../programme/programme'
import type { Session } from '../../programme/types'
import type { Summary } from '../../player/useWorkout'
import { Icon } from '../Icon'
import styles from './FinishScreen.module.css'

interface Props {
  user: UserId
  session: Session
  summary: Summary
  onClose: () => void
}

export function FinishScreen({ user, session, summary, onClose }: Props) {
  const name = getUser(user).displayName
  const after = (session.after ?? []).map(getRoutine)
  const noSets = summary.setsDone === 0

  return (
    <main className={styles.screen}>
      <span className={styles.badge}>
        <Icon name="check" size={48} />
      </span>
      <h1 className={styles.title}>{noSets ? `See you next time, ${name}` : `Well done, ${name}!`}</h1>
      <p className={styles.sub}>
        {noSets
          ? 'No problem. Every day is a fresh start.'
          : `${session.title}: ${summary.setsDone} ${summary.setsDone === 1 ? 'set' : 'sets'} in ${summary.minutes} min.`}
      </p>

      {after.map((routine) => (
        <p key={routine.title} className={styles.after}>
          Next: your {routine.title.toLowerCase()} ({routine.estMinutes} min). Tick it off on the
          Today screen when it's done.
        </p>
      ))}

      <button type="button" className={styles.button} onClick={onClose}>
        Back to today
      </button>
    </main>
  )
}
