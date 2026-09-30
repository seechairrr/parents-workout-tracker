import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './Sheet.module.css'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
}

/** A full-screen panel that slides over the player (overview, how to, pause). */
export function Sheet({ title, onClose, children }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div className={styles.header}>
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <Icon name="close" size={26} />
        </button>
        <h2 id="sheet-title" className={styles.title}>
          {title}
        </h2>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
