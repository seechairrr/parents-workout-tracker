import { describePrescription, describeRounds, describeSession, exerciseShortName } from '../../programme/format'
import type { Session } from '../../programme/types'
import type { Step } from '../../player/steps'
import type { WarmupPlan } from '../../player/warmup'
import { Icon } from '../Icon'
import { Sheet } from './Sheet'
import styles from './OverviewSheet.module.css'

interface Props {
  session: Session
  warmup: WarmupPlan
  steps: Step[]
  stepIndex: number
  warmupDone: boolean
  onClose: () => void
}

type Status = 'done' | 'now' | 'todo'

function Row({ title, detail, status, nowLabel }: { title: string; detail: string; status: Status; nowLabel?: string }) {
  return (
    <li className={styles.row} data-status={status}>
      <span className={styles.mark} aria-hidden="true">
        {status === 'done' && <Icon name="check" size={20} />}
      </span>
      <span>
        {status === 'done' && <span className={styles.state}>Done</span>}
        {status === 'now' && <span className={styles.state}>{nowLabel ?? 'Now'}</span>}
        <span className={styles.title}>{title}</span>
        <span className={styles.detail}>{detail}</span>
      </span>
    </li>
  )
}

export function OverviewSheet({ session, warmup, steps, stepIndex, warmupDone, onClose }: Props) {
  const current = warmupDone ? steps[stepIndex] : undefined

  // Group steps by exercise position, remembering which circuit each belongs to.
  const exercises = new Map<number, Step[]>()
  steps.forEach((s) => exercises.set(s.exerciseIndex, [...(exercises.get(s.exerciseIndex) ?? []), s]))

  const statusOf = (index: number): Status => {
    if (!warmupDone) return 'todo'
    if (current?.exerciseIndex === index) return 'now'
    const own = exercises.get(index) ?? []
    return own.every((s) => steps.indexOf(s) < stepIndex) ? 'done' : 'todo'
  }

  const circuits = session.format === 'circuit' ? session.circuits : [null]

  return (
    <Sheet title="Overview" onClose={onClose}>
      <h3 className={styles.session}>{session.title}</h3>
      <p className={styles.meta}>{describeSession(session)}</p>

      <h4 className={styles.heading}>Warm-up</h4>
      <ul className={styles.list}>
        <Row
          title={warmup.title}
          detail={`${warmup.estMinutes} min`}
          status={warmupDone ? 'done' : 'now'}
        />
      </ul>

      {circuits.map((circuit, c) => (
        <div key={c}>
          <h4 className={styles.heading}>
            {circuit
              ? `${circuits.length > 1 ? `Loop ${c + 1} · ` : 'Exercises · '}${describeRounds(circuit.rounds)}`
              : 'Exercises'}
          </h4>
          <ul className={styles.list}>
            {[...exercises.entries()]
              .filter(([, own]) => (circuit ? own[0].circuitIndex === c : true))
              .map(([index, own]) => {
                const p = own[0].prescription
                const nowLabel =
                  current && current.exerciseIndex === index
                    ? `Now · ${current.circuitIndex === null ? 'Set' : 'Round'} ${current.number} of ${current.total}`
                    : undefined
                return (
                  <Row
                    key={index}
                    title={exerciseShortName(p)}
                    detail={describePrescription(p)}
                    status={statusOf(index)}
                    nowLabel={nowLabel}
                  />
                )
              })}
          </ul>
        </div>
      ))}
    </Sheet>
  )
}
