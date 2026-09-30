// Works out how to play an exercise's demo from its videoUrl in programme.json.
// - YouTube links (watch, youtu.be, shorts, embed) play through youtube-nocookie.com
// - Links ending in .mp4 / .webm / .mov (e.g. /videos/goblet-squat.mp4 in public/) play directly
import type { Exercise } from '../programme/types'

export type VideoSource =
  | { kind: 'youtube'; embedUrl: (autoplay: boolean) => string; seconds: number | null }
  | { kind: 'file'; src: string; seconds: number | null }

function youTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null
    if (!u.hostname.endsWith('youtube.com') && !u.hostname.endsWith('youtube-nocookie.com')) return null
    if (u.searchParams.get('v')) return u.searchParams.get('v')
    const match = u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export function videoFor(exercise: Exercise): VideoSource | null {
  const url = exercise.videoUrl
  if (!url) return null
  const start = exercise.videoStartSec ?? null
  const end = exercise.videoEndSec ?? null
  const seconds = start !== null && end !== null && end > start ? end - start : null

  const id = youTubeId(url)
  if (id) {
    return {
      kind: 'youtube',
      seconds,
      embedUrl: (autoplay) => {
        const params = new URLSearchParams({
          rel: '0',
          playsinline: '1',
          cc_load_policy: '1', // captions on
          cc_lang_pref: 'en',
          mute: '1', // no sound surprises: they can turn sound on in the player
          autoplay: autoplay ? '1' : '0',
        })
        if (start !== null) params.set('start', String(start))
        if (end !== null) params.set('end', String(end))
        return `https://www.youtube-nocookie.com/embed/${id}?${params}`
      },
    }
  }

  if (/\.(mp4|webm|mov)(\?|#|$)/i.test(url)) {
    const fragment = start !== null ? `#t=${start}${end !== null ? `,${end}` : ''}` : ''
    return { kind: 'file', src: url + fragment, seconds }
  }
  return null
}
