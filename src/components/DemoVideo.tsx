import { useState } from 'react'
import type { Exercise } from '../programme/types'
import { videoFor } from '../lib/video'
import { formatClock } from '../lib/useCountdown'
import { Icon } from './Icon'
import styles from './DemoVideo.module.css'

interface Props {
  exercise: Exercise
  /** Start playing straight away (muted). Otherwise show a play button first. */
  autoplay?: boolean
}

/** Demo video for an exercise, or a calm placeholder while there isn't one yet. */
export function DemoVideo({ exercise, autoplay = false }: Props) {
  const video = videoFor(exercise)
  const [playing, setPlaying] = useState(autoplay)
  const title = `How to do ${exercise.name}`

  if (!video) {
    return (
      <div className={styles.frame}>
        <div className={styles.placeholder}>
          <Icon name="playCircle" size={40} />
          <span>Video coming soon. The tips below show how.</span>
        </div>
      </div>
    )
  }

  if (!playing) {
    return (
      <div className={styles.frame}>
        <button type="button" className={styles.poster} onClick={() => setPlaying(true)}>
          <span className={styles.playButton}>
            <Icon name="play" size={34} />
          </span>
          <span>Play demo</span>
          <span className="visually-hidden">: {exercise.name}</span>
        </button>
        {video.seconds !== null && (
          <span className={styles.length}>{formatClock(video.seconds * 1000)}</span>
        )}
      </div>
    )
  }

  return (
    <div className={styles.frame}>
      {video.kind === 'youtube' ? (
        <iframe
          className={styles.media}
          src={video.embedUrl(true)}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <video
          className={styles.media}
          src={video.src}
          title={title}
          controls
          muted
          autoPlay
          playsInline
          preload="metadata"
        />
      )}
      {!navigator.onLine && video.kind === 'youtube' && (
        <p className={styles.offline}>Videos need an internet connection.</p>
      )}
    </div>
  )
}
