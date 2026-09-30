import { useEffect, useState } from 'react'

/**
 * Milliseconds left until `endsAt` (a timestamp), updated a few times a second.
 * Based on the clock rather than counting ticks, so it stays right even if the
 * phone locks for a moment.
 */
export function useCountdown(endsAt: number | null): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (endsAt === null) return
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(timer)
  }, [endsAt])
  return endsAt === null ? 0 : Math.max(0, endsAt - now)
}

/** 75000 → "1:15" */
export function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}
