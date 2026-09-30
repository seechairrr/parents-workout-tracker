import { useEffect, useMemo, useState } from 'react'
import type { UserId } from '../../programme/programme'
import { prefill } from '../../player/prefill'
import { markDemoSeen, needsDemo } from '../../player/demo'
import { startsBonusRound } from '../../player/steps'
import { useWorkout } from '../../player/useWorkout'
import { warmupFor } from '../../player/warmup'
import { useWakeLock } from '../../lib/useWakeLock'
import { useLogVersion } from '../../storage/useLog'
import { ExerciseStep } from './ExerciseStep'
import { FirstTimeDemo } from './FirstTimeDemo'
import { FinishScreen } from './FinishScreen'
import { OverviewSheet } from './OverviewSheet'
import { PauseSheet } from './PauseSheet'
import { PlayerTopBar } from './PlayerTopBar'
import { RestScreen } from './RestScreen'
import { WarmupStep } from './WarmupStep'
import styles from './WorkoutPlayer.module.css'

interface Props {
  user: UserId
  sessionId: string
  onExit: () => void
}

export function WorkoutPlayer({ user, sessionId, onExit }: Props) {
  useWakeLock()
  useLogVersion() // re-render when a demo is marked as seen
  const w = useWorkout(user, sessionId)
  const warmup = useMemo(() => warmupFor(w.session), [w.session])
  const [sheet, setSheet] = useState<'overview' | 'pause' | null>(null)
  const showDemo = w.phase === 'work' && !!w.step && needsDemo(user, w.step.prescription.exercise)

  // Each new screen in the workout starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [w.phase, w.stepIndex, showDemo])

  if (w.phase === 'finished' && w.summary) {
    return <FinishScreen user={user} session={w.session} summary={w.summary} onClose={onExit} />
  }

  if (w.phase === 'rest' && w.step && w.restEndsAt !== null) {
    return (
      <RestScreen
        key={w.stepIndex}
        endsAt={w.restEndsAt}
        totalSec={w.restTotalSec}
        next={w.step}
        onFinishCircuit={startsBonusRound(w.steps, w.stepIndex) ? w.finishCircuit : undefined}
        onAddTime={() => w.addRest(15)}
        onDone={w.endRest}
      />
    )
  }

  const step = w.step
  const closeSheet = () => setSheet(null)

  return (
    <main className={styles.screen}>
      <PlayerTopBar
        current={w.phase === 'warmup' || !step ? -1 : step.exerciseIndex}
        count={w.steps[0]?.exerciseCount ?? 0}
        onPause={() => setSheet('pause')}
        onOverview={() => setSheet('overview')}
      />

      {w.phase === 'warmup' || !step ? (
        <WarmupStep plan={warmup} onDone={w.completeWarmup} />
      ) : showDemo ? (
        <FirstTimeDemo
          key={step.prescription.exercise}
          exerciseId={step.prescription.exercise}
          onDone={() => markDemoSeen(user, step.prescription.exercise)}
        />
      ) : (
        <ExerciseStep
          key={w.stepIndex}
          user={user}
          step={step}
          next={w.steps[w.stepIndex + 1]}
          onDone={w.completeStep}
        />
      )}

      {sheet === 'overview' && (
        <OverviewSheet
          session={w.session}
          warmup={warmup}
          steps={w.steps}
          stepIndex={w.stepIndex}
          warmupDone={w.warmupDone}
          onClose={closeSheet}
        />
      )}
      {sheet === 'pause' && (
        <PauseSheet
          canSkip={w.phase === 'work' && !!step}
          onResume={closeSheet}
          onSkip={() => {
            if (step) w.skipExercise(prefill(user, step.prescription))
            closeSheet()
          }}
          onEnd={() => {
            closeSheet()
            w.endWorkout()
          }}
        />
      )}
    </main>
  )
}
