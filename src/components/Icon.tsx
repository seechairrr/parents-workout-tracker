// Small inline line icons, so we don't need an icon library.
// Icons are decorative: the text next to them always says the same thing.

const paths = {
  chevronRight: <path d="M9 5l7 7-7 7" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.3 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  pause: <path d="M9 5v14M15 5v14" />,
  arrowRight: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  skip: <path d="M6 6l7 6-7 6M17 6v12" />,
  playCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l5.5-3.5z" fill="currentColor" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9.5 2.5h5" />
    </>
  ),
  play: <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  bike: (
    <>
      <circle cx="5.5" cy="16" r="3.5" />
      <circle cx="18.5" cy="16" r="3.5" />
      <path d="M5.5 16l4-7h6l3 7M9.5 9L12 16h3.5M14 6h2.5" />
    </>
  ),
  walk: (
    <>
      <circle cx="13" cy="4.5" r="2" />
      <path d="M10 21l2-6 3 3v3M8 12l2.5-4.5h3L16 11l2.5 1M12 15l1-5" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="7.5" r="3.5" />
      <path d="M8 21v-4.5a4 4 0 018 0V21" />
    </>
  ),
  mountain: <path d="M2.5 20l7-12 4 6.5 2.5-3.5 5.5 9z" />,
  yoga: (
    <>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 8v6M5 11l7-2 7 2M7 20l5-6 5 6M4.5 20h15" />
    </>
  ),
  moonRest: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  dumbbell: <path d="M3.5 9.5v5M6.5 7v10M17.5 7v10M20.5 9.5v5M6.5 12h11" />,
  home: <path d="M4 10.5L12 4l8 6.5V20h-5v-6H9v6H4z" />,
  library: (
    <>
      <rect x="4.5" y="4" width="6" height="16" rx="1.5" />
      <rect x="13.5" y="4" width="6" height="16" rx="1.5" />
    </>
  ),
}

export type IconName = keyof typeof paths

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}

export const activityIcon: Record<string, IconName> = {
  'incline-walk': 'walk',
  walk: 'walk',
  yoga: 'yoga',
  cycle: 'bike',
  hike: 'mountain',
  rest: 'moonRest',
}
