import { useState } from 'react'
import { getUser, type UserId } from '../programme/programme'
import { dayLong, isoDate, partOfDay, weekOf } from '../lib/dates'
import { useNow } from '../lib/useNow'
import { dayStatus } from '../lib/weekStatus'
import { useLogVersion } from '../storage/useLog'
import { DayPlan } from './DayPlan'
import { SafetyNote } from './SafetyNote'
import { WeekStrip, type WeekDay } from './WeekStrip'
import styles from './TodayScreen.module.css'

interface Props {
  user: UserId
  onStartSession: (sessionId: string) => void
}

export function TodayScreen({ user, onStartSession }: Props) {
  useLogVersion() // re-render when something is ticked off
  const now = useNow()
  const todayIso = isoDate(now)
  const week = weekOf(now)
  const [picked, setPicked] = useState<string | null>(null)

  // If the week rolls over while the app is open, fall back to today.
  const selected = week.find((d) => d.iso === picked) ?? week.find((d) => d.iso === todayIso)!
  const isToday = selected.iso === todayIso

  const days: WeekDay[] = week.map((d) => ({
    ...d,
    status: dayStatus(user, d.key, d.iso, todayIso),
    isToday: d.iso === todayIso,
  }))

  return (
    <main className={styles.screen}>
      <h1 className={styles.greeting}>
        {partOfDay(now)}, {getUser(user).displayName}
      </h1>

      <WeekStrip days={days} selected={selected.iso} onSelect={setPicked} />

      <h2 className={styles.dayHeading}>{isToday ? 'Today' : dayLong[selected.key]}</h2>

      <DayPlan
        user={user}
        day={selected.key}
        iso={selected.iso}
        canLog={selected.iso <= todayIso}
        week={week}
        onStartSession={onStartSession}
      />

      <SafetyNote user={user} />
    </main>
  )
}
