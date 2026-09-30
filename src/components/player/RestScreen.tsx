import { useEffect, useRef } from 'react'
import { describeWork, exerciseShortName } from '../../programme/format'
import type { Step } from '../../player/steps'
import { playChime } from '../../lib/chime'
import { formatClock, useCountdown } from '../../lib/useCountdown'
import { Icon } from '../Icon'
import styles from './RestScreen.module.css'

interface Props {
  endsAt: number
  totalSec: number
  next: Step
  /** Set when the next round is a bonus round, to offer finishing the circuit instead. */
  onFinishCircuit?: () => void
  onAddTime: () => void
  onDone: () => void
}

const RADIUS = 120
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function upNextText(next: Step): string {
  const name = exerciseShortName(next.prescription)
  if (next.circuitIndex === null) return `Set ${next.number} of ${next.total} · ${name}`
  return `${name} · ${describeWork(next.prescription)}`
}

export function RestScreen({ endsAt, totalSec, next, onFinishCircuit, onAddTime, onDone }: Props) {
  const left = useCountdown(endsAt)
  const over = left === 0
  const wasRunning = useRef(!over)

  // Chime once when the rest runs out while this screen is open.
  useEffect(() => {
    if (over && wasRunning.current) {
      wasRunning.current = false
      playChime()
    }
    if (!over) wasRunning.current = true
  }, [over])

  const fraction = totalSec > 0 ? left / (totalSec * 1000) : 0

  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>Rest</h1>
      <p className={styles.sub}>Nice work. Breathe easy and have a sip of water.</p>

      <div
        className={styles.ring}
        data-small={!!onFinishCircuit}
        role="timer" aria-label={`Rest, ${formatClock(left)} left`}>
        <svg viewBox="0 0 280 280" aria-hidden="true">
          <circle cx="140" cy="140" r={RADIUS} className={styles.track} />
          <circle
            cx="140"
            cy="140"
            r={RADIUS}
            className={styles.progress}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          />
        </svg>
        <div className={styles.face}>
          <span className={styles.clock}>{formatClock(left)}</span>
          <span className={styles.hint} aria-live="polite">
            {over ? 'Ready when you are' : 'Rest a moment'}
          </span>
        </div>
      </div>

      <div className={styles.upNext}>
        <span className={styles.upNextIcon}>
          <Icon name="arrowRight" size={22} />
        </span>
        <span>
          <span className={styles.upNextLabel}>
            Up next{next.circuitIndex !== null ? ` · Round ${next.number} of ${next.total}` : ''}
          </span>
          <span className={styles.upNextName}>{upNextText(next)}</span>
        </span>
      </div>

      {onFinishCircuit && (
        <div className={styles.bonus}>
          <p>Round {next.number} is a bonus. Do it if you feel good, or finish here.</p>
          <button type="button" className={styles.finishCircuit} onClick={onFinishCircuit}>
            I'm done with this circuit
          </button>
        </div>
      )}

      <div className={styles.footer}>
        <button type="button" className={styles.more} onClick={onAddTime}>
          +15 s
        </button>
        <button type="button" className={styles.skip} onClick={onDone}>
          {over ? "Let's go" : 'Skip rest'} <Icon name="skip" size={22} />
        </button>
      </div>
    </main>
  )
}
