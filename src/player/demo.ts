import { getExercise, type UserId } from '../programme/programme'
import { videoFor } from '../lib/video'
import { lastSet, markSeen, seenLevel } from '../storage/storage'

/**
 * Should the "New exercise" demo show before this exercise?
 * - With a video: until they've watched it once.
 * - Without a video yet: once, the very first time they meet the exercise,
 *   so they see the form tips. It shows again once a video is added.
 */
export function needsDemo(user: UserId, exerciseId: string): boolean {
  const level = seenLevel(user, exerciseId)
  if (videoFor(getExercise(exerciseId))) return level !== 'video'
  return level === undefined && !lastSet(user, exerciseId)
}

export function markDemoSeen(user: UserId, exerciseId: string): void {
  markSeen(user, exerciseId, videoFor(getExercise(exerciseId)) ? 'video' : 'cues')
}
