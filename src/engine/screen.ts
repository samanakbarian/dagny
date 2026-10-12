/** Internal resolution: 320×180, 16:9 landscape. */
export const VIEW_W = 320;
export const VIEW_H = 180;

/**
 * Scales the canvas to the window. Integer scaling is used whenever the
 * integer scale fills at least ~85 % of the available space; otherwise we
 * fall back to the largest fractional scale that fits (still pixelated).
 */
export class Screen {
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  portrait = false;
  readonly ctx: CanvasRenderingContext2D;
  private readonly probe: HTMLDivElement;

  constructor(readonly canvas: HTMLCanvasElement, private readonly onResize?: () => void) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D stöds inte');
    this.ctx = ctx;
    ctx.imageSmoothingEnabled = false;
    this.probe = document.createElement('div');
    this.probe.style.cssText =
      'position:fixed;visibility:hidden;pointer-events:none;left:0;top:0;width:0;height:0;' +
      'padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
    document.body.appendChild(this.probe);
    window.addEventListener('resize', this.resize);
    window.addEventListener('orientationchange', () => setTimeout(this.resize, 120));
    window.visualViewport?.addEventListener('resize', this.resize);
    this.resize();
  }

  resize = (): void => {
    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    this.portrait = vh > vw * 1.05;
    // We respect the notch / home indicator: the canvas is centred in the
    // safe rectangle, measured through a probe element using env().
    const probe = getComputedStyle(this.probe);
    const sl = parseFloat(probe.paddingLeft) || 0;
    const sr = parseFloat(probe.paddingRight) || 0;
    const st = parseFloat(probe.paddingTop) || 0;
    const sb = parseFloat(probe.paddingBottom) || 0;
    const aw = Math.max(1, vw - sl - sr);
    const ah = Math.max(1, vh - st - sb);
    const fit = Math.min(aw / VIEW_W, ah / VIEW_H);
    const int = Math.floor(fit);
    let scale = fit;
    if (int >= 1 && int / fit >= 0.85) scale = int;
    // Snap fractional scales to device pixels to keep pixels as even as possible.
    const dpr = window.devicePixelRatio || 1;
    if (scale !== int) scale = Math.max(1 / dpr, Math.floor(scale * dpr) / dpr);
    this.scale = scale;
    const w = VIEW_W * scale;
    const h = VIEW_H * scale;
    this.offsetX = Math.round(sl + (aw - w) / 2);
    this.offsetY = Math.round(st + (ah - h) / 2);
    const c = this.canvas;
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;
    c.style.left = `${this.offsetX}px`;
    c.style.top = `${this.offsetY}px`;
    this.onResize?.();
  };

  /** Converts a client (CSS pixel) position to game coordinates. */
  toGame(clientX: number, clientY: number): { x: number; y: number } {
    return {
      x: (clientX - this.offsetX) / this.scale,
      y: (clientY - this.offsetY) / this.scale,
    };
  }
}
