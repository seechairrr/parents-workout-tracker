# Parents' Workout Tracker

A simple mobile web app (PWA) that guides my mum and dad through their weekly strength programme, logs what they did, and shows their progress. I'm a UX designer, not an engineer, so explain technical decisions in plain language and keep the codebase simple.

## Users

- **Mum and Dad**, both working, tired after work, new to structured strength training.
- They use their own phones. They are comfortable with WhatsApp-level apps, not with complex UIs.
- **Goals:** stay healthy and active, keep muscle mass, stay physically independent as they age.
- They hike Bukit Timah Hill on Saturdays and enjoy hiking overseas.
- **Dad has neck pain/tightness.** He does a daily neck routine, and his plan avoids exercises that load the neck (no upright rows, light shoulder press, "shoulders down" cue on carries).
- Sessions must stay around 30–35 minutes including warm-up.

## Equipment

- Dumbbells: 2.5 kg and 5 kg pairs at home (heavier ones may be bought later; make the weight list editable).
- A house gym downstairs (bench, possibly heavier dumbbells).
- Resistance band (needed for Dad's band pull-aparts).

## Source of truth: `data/programme.json`

All programme content lives in `data/programme.json`: exercises, warm-up, neck routine, weekly schedules, sessions, sets, reps, rest times, and future exercise unlocks.

- **Never hardcode exercises or sessions in components.** Read them from the JSON.
- **Do not change programme content** (exercises, reps, rest times) without asking me first. You may propose schema changes, but explain why.
- Session `format` is either `"sets"` (straight sets, one exercise at a time) or `"circuit"` (rounds through a group of exercises). The workout player must handle both.
- Reps are `{ "min", "max" }`, and `perSide: true` means per leg/arm. Timed moves use `durationSec: { "min", "max" }`.

## Design principles

- Mobile-first, portrait, one-handed use.
- **Large text:** body text 18px minimum, key numbers (reps, weight, timer) very large.
- **Tap targets:** 48px minimum.
- **Contrast:** high contrast, with nothing important conveyed by colour alone.
- **One main action per screen.** Always show "what do I do next".
- **Minimal typing.** Pre-fill the last used weight and reps and let them tap to confirm. Use +/- steppers instead of keyboards.
- **Encouraging tone.** No guilt for skipped days. Yoga, walks and the optional Wednesday session are clearly marked as optional.
- Profile switch between Mum and Dad on launch (no login in the MVP).

## Key behaviours

- **Today screen:** pick Mum or Dad, and it shows that day's plan from their weekly schedule.
- **Workout player:**
  - It shows the warm-up first, then the exercises.
  - Tapping "set done" auto-starts the rest timer with the rest time from the JSON, and a gentle chime plays when rest ends.
  - For circuits it shows "Round X of Y" and moves through the exercises in order.
- **Demo videos:**
  - The first time a user meets an exercise, the demo auto-plays before they start.
  - After that, the video sits behind a "How to" button.
  - "Seen" is tracked per user.
  - Use `youtube-nocookie.com` embeds with start/end times when `videoUrl` is set, and allow local video files later.
  - Captions on, no sound surprises.
- **Exercise library:** all exercises with muscles worked, form cues, and video.
- **Dad's neck routine:** a daily checklist, available every day, with a guided timer for each stretch.
- **Progression nudge:** when all sets of an exercise hit the top of the rep range, suggest the next weight up next session.
- **Unlocks:** every 4–6 weeks one exercise can rotate to its locked alternative (see `rotations` in the JSON). Frame it as "New move unlocked" and auto-play its demo.

## Data to log

Per set: date, user, session id, exercise id, set/round number, weight (kg), reps or seconds, and completed flag.

Also log:
- optional activities (walk, yoga, cycle, hike) as done/skipped
- neck routine completion per day

## Tech stack

- React + TypeScript + Vite, set up as an installable PWA (add to home screen, works offline).
- Store data on the device (IndexedDB or localStorage) for the MVP. A backend (e.g. Supabase) may come later so I can view their progress; keep the storage layer behind one module so it's easy to swap.
- **Ask me before adding new dependencies.**

## How to work with me

- Build **one slice at a time** and stop for me to review:
  1. Today screen (profile pick + today's plan from the JSON).
  2. Workout player with set logging and auto rest timer.
  3. Demo videos (first-time auto-play) + exercise library.
  4. History, progression nudges, unlocks, streaks, hike log, neck routine reminders.
- Test layouts at iPhone size in mobile Safari.
- Keep components small and named clearly. Explain what you changed at the end of each slice.

## Safety copy

This app is not medical advice. Show a gentle note in the app:
- Stop any exercise that causes sharp pain.
- For the neck routine, see a doctor or physio if there is pain or tingling down an arm, numbness, headaches or dizziness.
