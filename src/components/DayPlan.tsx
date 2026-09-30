import type { UserId } from '../programme/programme'
import { buildDayPlan } from '../programme/dayPlan'
import type { DayKey } from '../programme/types'
import { isActivityDone, isRoutineDone, setActivityDone, setRoutineDone } from '../storage/storage'
import { ActivityCard } from './ActivityCard'
import { CircuitSessionCard } from './CircuitSessionCard'
import { RestCard } from './RestCard'
import { RoutineCard, type RoutineDay } from './RoutineCard'
import { SetsSessionCard } from './SetsSessionCard'
import styles from './DayPlan.module.css'

interface Props {
  user: UserId
  day: DayKey
  iso: string
  /** False for days later this week: nothing to tick off yet. */
  canLog: boolean
  week: { key: DayKey; iso: string }[]
  onStartSession: (sessionId: string) => void
}

export function DayPlan({ user, day, iso, canLog, week, onStartSession }: Props) {
  const cards = buildDayPlan(user, day)

  return (
    <div className={styles.plan}>
      {cards.map((card, i) => {
        switch (card.kind) {
          case 'session': {
            const start = () => onStartSession(card.item.id)
            return card.session.format === 'sets' ? (
              <SetsSessionCard key={i} item={card.item} session={card.session} onStart={start} />
            ) : (
              <CircuitSessionCard key={i} item={card.item} session={card.session} onStart={start} />
            )
          }
          case 'rest':
            return <RestCard key={i} item={card.item} />
          case 'activity': {
            const done = isActivityDone(user, iso, card.item.id)
            return (
              <ActivityCard
                key={i}
                item={card.item}
                activity={card.activity}
                done={done}
                onToggle={canLog ? () => setActivityDone(user, iso, card.item.id, !done) : undefined}
              />
            )
          }
          case 'routine': {
            const done = isRoutineDone(user, iso, card.routineId)
            const routineWeek: RoutineDay[] = week.map((d) => ({
              ...d,
              done: isRoutineDone(user, d.iso, card.routineId),
              isSelected: d.iso === iso,
            }))
            return (
              <RoutineCard
                key={i}
                routineId={card.routineId}
                done={done}
                week={routineWeek}
                onToggle={
                  canLog ? () => setRoutineDone(user, iso, card.routineId, !done) : undefined
                }
              />
            )
          }
        }
      })}
    </div>
  )
}
