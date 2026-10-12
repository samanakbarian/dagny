/**
 * Fixed 60 Hz logic step with rendering on requestAnimationFrame.
 * Logic never runs more than a few steps per frame, so a long hiccup
 * (e.g. coming back from the background) never causes a spiral of death.
 */
export const STEP = 1 / 60;
const MAX_STEPS = 5;

export class Loop {
  private acc = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  /** Frames rendered last second (for the optional FPS meter). */
  fps = 60;
  private fpsFrames = 0;
  private fpsTime = 0;

  constructor(
    private readonly update: () => void,
    private readonly render: (alpha: number) => void,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.acc = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  get isRunning(): boolean {
    return this.running;
  }

  private frame = (now: number): void => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.frame);
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > 0.25) dt = 0.25;
    this.acc += dt;
    let steps = 0;
    while (this.acc >= STEP && steps < MAX_STEPS) {
      this.update();
      this.acc -= STEP;
      steps++;
    }
    if (steps === MAX_STEPS) this.acc = 0;
    this.render(this.acc / STEP);

    this.fpsFrames++;
    this.fpsTime += dt;
    if (this.fpsTime >= 1) {
      this.fps = Math.round(this.fpsFrames / this.fpsTime);
      this.fpsFrames = 0;
      this.fpsTime = 0;
    }
  };
}
