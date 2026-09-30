import { getRoutine, getUser, type UserId } from '../programme/programme'
import styles from './SafetyNote.module.css'

export function SafetyNote({ user }: { user: UserId }) {
  const routineNotes = getUser(user)
    .dailyRoutines.map((id) => getRoutine(id).safetyNote)
    .filter((note): note is string => Boolean(note))

  return (
    <aside className={styles.note} aria-label="Safety">
      <p>Stop any exercise that causes sharp pain.</p>
      {routineNotes.map((note) => (
        <p key={note}>{note}</p>
      ))}
      <p className={styles.small}>This app is a guide, not medical advice.</p>
    </aside>
  )
}
