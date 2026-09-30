import { useEffect, useState } from 'react'
import { getSession, type UserId } from './programme/programme'
import { BottomNav, type Tab } from './components/BottomNav'
import { ComingSoon } from './components/ComingSoon'
import { ProfilePicker } from './components/ProfilePicker'
import { TodayScreen } from './components/TodayScreen'

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
    return (
      <ComingSoon
        title={getSession(screen.sessionId).title}
        message="The workout player is coming in the next update."
        onBack={toToday}
      />
    )
  }

  return (
    <>
      {screen.tab === 'today' ? (
        <TodayScreen
          user={screen.user}
          onStartSession={(sessionId) => setScreen({ name: 'player', user: screen.user, sessionId })}
        />
      ) : (
        <ComingSoon
          title="Exercises"
          message="The exercise library, with videos and form tips, is coming soon."
          onBack={toToday}
        />
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
