import { useEffect } from 'react'

/** Keeps the phone screen on while a workout is open (where the browser supports it). */
export function useWakeLock(): void {
  useEffect(() => {
    let lock: WakeLockSentinel | null = null
    let cancelled = false

    const request = async () => {
      try {
        if ('wakeLock' in navigator && document.visibilityState === 'visible') {
          lock = await navigator.wakeLock.request('screen')
          if (cancelled) void lock.release()
        }
      } catch {
        // Not allowed right now (e.g. low battery). Not a problem.
      }
    }

    void request()
    document.addEventListener('visibilitychange', request)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', request)
      void lock?.release()
    }
  }, [])
}
