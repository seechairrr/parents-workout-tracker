import { programme } from '../programme/programme'
import type { Session, WarmupItem } from '../programme/types'

export interface WarmupPlan {
  title: string
  items: WarmupItem[]
  /** Shown instead of a list when the session has a short, described warm-up. */
  note?: string
  finalNote?: string
  estMinutes: number
}

export function warmupFor(session: Session): WarmupPlan {
  const { warmups } = programme
  if (!session.warmup.base) {
    return { title: 'Short warm-up', items: [], note: session.warmup.note, estMinutes: 2 }
  }
  const addOn = session.warmup.addOn ? warmups[session.warmup.addOn] : []
  return {
    title: warmups.base.title,
    items: [...warmups.base.items, ...addOn],
    finalNote: warmups.base.finalNote,
    estMinutes: 5,
  }
}
