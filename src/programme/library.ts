// Groups exercises for the library screen, in the order they appear in programme.json.
import { programme } from './programme'
import type { Exercise } from './types'

export interface LibrarySection {
  title: string
  exercises: { id: string; exercise: Exercise }[]
}

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "Quads, glutes" */
export function musclesLine(exercise: Exercise): string {
  const muscles = exercise.musclesPrimary ?? []
  return capitalise(muscles.map((m) => m.toLowerCase()).join(', '))
}

export function categoryLabel(exercise: Exercise): string {
  if (exercise.type === 'warmup') return 'Warm-up'
  if (exercise.type === 'mobility') return 'Stretch'
  return capitalise(exercise.category ?? 'Other')
}

/**
 * Strength moves by category (Legs, Push, Pull, Core, Carry), then warm-up
 * moves and stretches. Locked moves stay hidden until they're unlocked.
 */
export function librarySections(): LibrarySection[] {
  const sections = new Map<string, LibrarySection>()
  const add = (title: string, id: string, exercise: Exercise) => {
    if (!sections.has(title)) sections.set(title, { title, exercises: [] })
    sections.get(title)!.exercises.push({ id, exercise })
  }

  const entries = Object.entries(programme.exercises).filter(([, e]) => e.status !== 'locked')
  for (const [id, e] of entries) if (e.type === 'strength') add(categoryLabel(e), id, e)
  for (const [id, e] of entries) if (e.type === 'warmup') add('Warm-up moves', id, e)
  for (const [id, e] of entries) if (e.type === 'mobility') add('Neck routine stretches', id, e)
  return [...sections.values()]
}
