import { getUser, type UserId } from '../programme/programme'
import { avatarTheme } from '../lib/profiles'

/** Initial in a coloured circle. Decorative: the name is always shown or read out nearby. */
export function Avatar({ user, size }: { user: UserId; size: number }) {
  const theme = avatarTheme(user)
  return (
    <span
      aria-hidden="true"
      style={{
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: theme.background,
        color: theme.text,
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: Math.round(size * 0.44),
        lineHeight: 1,
      }}
    >
      {getUser(user).displayName.charAt(0)}
    </span>
  )
}
