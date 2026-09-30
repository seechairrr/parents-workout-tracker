# Parents' Workout Tracker

A phone app (installable web app) that guides Mum and Dad through their weekly strength programme.
See `CLAUDE.md` for the brief. All programme content lives in `data/programme.json`.

## Run it on your computer

```bash
npm install
npm run dev
```

It prints a local link (http://localhost:5173) and a "Network" link. If your phone is on the
same Wi-Fi, open the Network link on the phone to try the app there.

Other commands:

- `npm run typecheck`: checks the code for type mistakes
- `npm run build`: makes the production version in `dist/` (this is what Vercel runs)

## Where things are

```
data/programme.json      the programme (exercises, sessions, schedules)
design/                  the design mockups
public/                  app icons, manifest (add to home screen) and sw.js (offline)
src/programme/           reads programme.json and turns it into on-screen text
src/player/              workout player logic: steps, rest times, pre-filled numbers
src/storage/             everything saved on the phone (swap for a backend later)
src/lib/                 dates, week ticks, profile colours
src/components/          the screens and cards (player screens in components/player/)
```

## Deploy to Vercel

`vercel.json` already tells Vercel how to build the app.

1. Sign in at vercel.com with your GitHub account.
2. Add New → Project → import `parents-workout-tracker`. Leave the settings as they are and click Deploy.
3. Every branch you push gets its own preview link. The main branch becomes the live site.
