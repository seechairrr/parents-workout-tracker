import type { Session, WarmupItem } from '../programme/types'

export interface WarmupPlan {
  title: string
  items: WarmupItem[]
  finalNote?: string
  estMinutes: number
}

/** The session's own warm-up from programme.json, e.g. "5-minute warm-up". */
export function warmupFor(session: Session): WarmupPlan {
  const { estMinutes, items, finalNote } = session.warmup
  return { title: `${estMinutes}-minute warm-up`, items, finalNote, estMinutes }
}
