import { describeSession, describeWarmup } from '../programme/format'
import type { ScheduleItem, SetsSession } from '../programme/types'
import { Eyebrow } from './Eyebrow'
import { ExerciseList } from './ExerciseList'
import { Icon } from './Icon'
import { SessionAction, type SessionStatus } from './SessionAction'
import ui from './ui.module.css'
import styles from './SessionCard.module.css'

interface Props {
  item: ScheduleItem
  session: SetsSession
  status: SessionStatus
  onStart: () => void
}

/** Straight-sets session: big card with a start button, then the exercise list below it. */
export function SetsSessionCard({ item, session, status, onStart }: Props) {
  return (
    <>
      <section className={ui.card} aria-label={session.title}>
        <div className={styles.hero}>
          <span className={styles.chip}>
            <Icon name="sun" size={20} /> {describeWarmup(session)}
          </span>
          <span className={styles.heroArt}>
            <Icon name="dumbbell" size={56} />
          </span>
        </div>
        <div className={ui.cardBody}>
          <Eyebrow item={item} />
          <h3 className={ui.cardTitle}>{session.title}</h3>
          <p className={ui.meta}>{describeSession(session)}</p>
          <SessionAction status={status} startLabel="Start workout" onStart={onStart} />
        </div>
      </section>

      <h2 className={styles.listHeading}>What's in today</h2>
      <ExerciseList exercises={session.exercises} variant="rows" />
    </>
  )
}
