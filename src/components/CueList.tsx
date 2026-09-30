import styles from './CueList.module.css'

/** Numbered form tips, e.g. "1 Hold the dumbbell at your chest". */
export function CueList({ cues }: { cues: string[] }) {
  return (
    <ol className={styles.cues}>
      {cues.map((cue, i) => (
        <li key={cue} className={styles.cue}>
          <span className={styles.number} aria-hidden="true">
            {i + 1}
          </span>
          {cue}
        </li>
      ))}
    </ol>
  )
}
