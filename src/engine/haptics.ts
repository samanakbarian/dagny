/** Haptic feedback through navigator.vibrate where supported. */
let enabled = true;

export function setHapticsEnabled(on: boolean): void {
  enabled = on;
}

export function vibrate(pattern: number | number[]): void {
  if (!enabled) return;
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
  } catch {
    /* some browsers throw when not triggered by a gesture */
  }
}
