import { useEffect, useState } from 'react'
import type { UserId } from './programme/programme'
import { BottomNav, type Tab } from './components/BottomNav'
import { ExerciseLibrary } from './components/library/ExerciseLibrary'
import { ProfilePicker } from './components/ProfilePicker'
import { TodayScreen } from './components/TodayScreen'
import { WorkoutPlayer } from './components/player/WorkoutPlayer'

// Simple screen switching. No router needed yet: the app always opens on the
// profile picker, and there are only a few screens.
type Screen =
  | { name: 'profile' }
  | { name: 'tab'; user: UserId; tab: Tab }
  | { name: 'player'; user: UserId; sessionId: string }

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'profile' })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  if (screen.name === 'profile') {
    return <ProfilePicker onPick={(user) => setScreen({ name: 'tab', user, tab: 'today' })} />
  }

  const toToday = () => setScreen({ name: 'tab', user: screen.user, tab: 'today' })

  if (screen.name === 'player') {
    return <WorkoutPlayer user={screen.user} sessionId={screen.sessionId} onExit={toToday} />
  }

  return (
    <>
      {screen.tab === 'today' ? (
        <TodayScreen
          user={screen.user}
          onStartSession={(sessionId) => setScreen({ name: 'player', user: screen.user, sessionId })}
        />
      ) : (
        <ExerciseLibrary />
      )}
      <BottomNav
        user={screen.user}
        active={screen.tab}
        onTab={(tab) => setScreen({ name: 'tab', user: screen.user, tab })}
        onSwitch={() => setScreen({ name: 'profile' })}
      />
    </>
  )
}
