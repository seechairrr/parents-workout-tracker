// Look and feel for each profile. This is styling, not programme content,
// so it lives here rather than in programme.json.
import type { UserId } from '../programme/programme'

interface AvatarTheme {
  background: string
  text: string
}

const themes: Record<string, AvatarTheme> = {
  mum: { background: 'var(--avatar-peach-bg)', text: 'var(--avatar-peach-text)' },
  dad: { background: 'var(--avatar-sage-bg)', text: 'var(--avatar-sage-text)' },
}

const fallback: AvatarTheme = { background: 'var(--surface-muted)', text: 'var(--text)' }

export function avatarTheme(user: UserId): AvatarTheme {
  return themes[user] ?? fallback
}
