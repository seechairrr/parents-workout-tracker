import { useEffect, useRef, useState } from 'react'
import { playChime, unlockAudio } from '../../lib/chime'
import { formatClock, useCountdown } from '../../lib/useCountdown'
import { Icon } from '../Icon'
import styles from './SetTimer.module.css'

/** Optional countdown for timed moves (plank, carries). Chimes when time is up. */
export function SetTimer({ seconds }: { seconds: number }) {
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const left = useCountdown(endsAt)
  const chimed = useRef(false)

  useEffect(() => {
    if (endsAt !== null && left === 0 && !chimed.current) {
      chimed.current = true
      playChime()
    }
  }, [endsAt, left])

  const running = endsAt !== null && left > 0
  const finished = endsAt !== null && left === 0

  return (
    <button
      type="button"
      className={styles.timer}
      data-running={running}
      onClick={() => {
        unlockAudio()
        chimed.current = false
        setEndsAt(running ? null : Date.now() + seconds * 1000)
      }}
    >
      <Icon name="timer" size={24} />
      {running ? (
        <span>
          <span className={styles.clock} aria-live="off">
            {formatClock(left)}
          </span>{' '}
          · Tap to stop
        </span>
      ) : finished ? (
        'Time! Start again?'
      ) : (
        `Start ${seconds} s timer`
      )}
    </button>
  )
}
