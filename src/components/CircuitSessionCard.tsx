import { describeRounds, describeSession } from '../programme/format'
import type { CircuitSession, ScheduleItem } from '../programme/types'
import { Eyebrow } from './Eyebrow'
import { ExerciseList } from './ExerciseList'
import { SessionAction, type SessionStatus } from './SessionAction'
import ui from './ui.module.css'
import styles from './SessionCard.module.css'

interface Props {
  item: ScheduleItem
  session: CircuitSession
  status: SessionStatus
  onStart: () => void
}

/** Circuit session: one card with the loop's exercises listed inside it. */
export function CircuitSessionCard({ item, session, status, onStart }: Props) {
  const several = session.circuits.length > 1
  let number = 1

  return (
    <section className={ui.card} aria-label={session.title}>
      <div className={ui.cardBody}>
        <Eyebrow item={item} />
        <h3 className={ui.cardTitle}>{session.title}</h3>
        <p className={ui.meta}>{describeSession(session)}</p>

        {session.circuits.map((circuit, i) => {
          const start = number
          number += circuit.exercises.length
          return (
            <div key={i}>
              <p className={styles.loopLabel}>
                {several ? `Loop ${i + 1} · ` : ''}
                {describeRounds(circuit.rounds)}
              </p>
              <ExerciseList exercises={circuit.exercises} variant="compact" start={start} />
            </div>
          )
        })}

        <SessionAction status={status} startLabel="Start circuit" onStart={onStart} />
      </div>
    </section>
  )
}
