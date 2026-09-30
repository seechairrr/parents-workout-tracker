// A soft two-note chime made in the browser, so there's no sound file to load.
// Phones only allow sound after a tap, so call unlockAudio() from a button press first.

let context: AudioContext | null = null

export function unlockAudio(): void {
  try {
    context ??= new AudioContext()
    if (context.state === 'suspended') void context.resume()
  } catch {
    // No sound support; the timer still works silently.
  }
}

export function playChime(): void {
  if (!context) return
  const start = context.currentTime
  ;[659.25, 880].forEach((freq, i) => {
    const osc = context!.createOscillator()
    const gain = context!.createGain()
    const t = start + i * 0.22
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.18, t + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.1)
    osc.connect(gain).connect(context!.destination)
    osc.start(t)
    osc.stop(t + 1.2)
  })
}
