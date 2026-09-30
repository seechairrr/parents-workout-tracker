import { useSyncExternalStore } from 'react'
import { subscribe } from './storage'

let version = 0
subscribe(() => {
  version++
})

/** Re-renders the calling component whenever something is saved. */
export function useLogVersion(): number {
  return useSyncExternalStore(subscribe, () => version)
}
