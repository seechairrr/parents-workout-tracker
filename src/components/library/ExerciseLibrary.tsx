import { useEffect, useRef, useState } from 'react'
import { librarySections, musclesLine } from '../../programme/library'
import { Icon } from '../Icon'
import { ExerciseDetail } from './ExerciseDetail'
import styles from './ExerciseLibrary.module.css'

export function ExerciseLibrary() {
  const [openId, setOpenId] = useState<string | null>(null)
  const listScroll = useRef(0)

  // Detail opens at the top; going back returns to where they were in the list.
  useEffect(() => {
    window.scrollTo(0, openId ? 0 : listScroll.current)
  }, [openId])

  if (openId) return <ExerciseDetail exerciseId={openId} onBack={() => setOpenId(null)} />

  const open = (id: string) => {
    listScroll.current = window.scrollY
    setOpenId(id)
  }

  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>Exercises</h1>
      <p className={styles.intro}>Tap any exercise to see how it's done.</p>

      {librarySections().map((section) => (
        <section key={section.title} aria-labelledby={`lib-${section.title}`}>
          <h2 id={`lib-${section.title}`} className={styles.heading}>
            {section.title}
          </h2>
          <ul className={styles.list}>
            {section.exercises.map(({ id, exercise }) => (
              <li key={id}>
                <button type="button" className={styles.row} onClick={() => open(id)}>
                  <span className={styles.text}>
                    <span className={styles.name}>{exercise.shortName ?? exercise.name}</span>
                    {musclesLine(exercise) && (
                      <span className={styles.muscles}>{musclesLine(exercise)}</span>
                    )}
                  </span>
                  <Icon name="chevronRight" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
