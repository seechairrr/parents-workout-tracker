import styles from './ComingSoon.module.css'

interface Props {
  title: string
  message: string
  onBack: () => void
}

/** Stand-in for screens that arrive in later slices. */
export function ComingSoon({ title, message, onBack }: Props) {
  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>
      <button type="button" className={styles.back} onClick={onBack}>
        Back to today
      </button>
    </main>
  )
}
