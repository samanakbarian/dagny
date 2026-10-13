import { Act, type Action, type Input } from './input';

export type StickMode = 'stick' | 'dpad';

export interface TouchLayout {
  mode: StickMode;
  /** 0.75 – 1.6 */
  scale: number;
  /** 0.15 – 0.9 */
  opacity: number;
  /** Distance from the screen edges in CSS px (placement). */
  offsetX: number;
  offsetY: number;
  /** Show an extra "LÅGT" button for a low strike. */
  lowButton: boolean;
}

/**
 * On-screen controls as DOM elements on top of the canvas, so they are
 * crisp, at least 48×48 CSS px and independent of the game resolution.
 * Pointer events with per-pointer tracking give full multitouch: walk,
 * jump and strike at the same time.
 */
export class TouchControls {
  private readonly root: HTMLElement;
  private stickEl!: HTMLElement;
  private knob: HTMLElement | null = null;
  private arms: Record<string, HTMLElement> = {};
  private stickPointer: number | null = null;
  private dirs = { left: false, right: false, up: false, down: false };
  private layout: TouchLayout;
  onPause: (() => void) | null = null;
  onFullscreen: (() => void) | null = null;

  constructor(root: HTMLElement, private readonly input: Input, layout: TouchLayout) {
    this.root = root;
    this.layout = layout;
    this.build();
    this.apply(layout);
    const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
    this.setVisible(coarse || 'ontouchstart' in window);
  }

  setVisible(v: boolean): void {
    this.root.classList.toggle('hidden', !v);
    if (!v) this.clearStick();
  }

  get visible(): boolean {
    return !this.root.classList.contains('hidden');
  }

  apply(layout: TouchLayout): void {
    const modeChanged = layout.mode !== this.layout.mode;
    this.layout = layout;
    const s = document.documentElement.style;
    s.setProperty('--ctl-scale', String(layout.scale));
    s.setProperty('--ctl-opacity', String(layout.opacity));
    s.setProperty('--ctl-offset-x', `${layout.offsetX}px`);
    s.setProperty('--ctl-offset-y', `${layout.offsetY}px`);
    this.root.classList.toggle('no-low', !layout.lowButton);
    if (modeChanged) {
      this.stickEl.remove();
      this.buildStick();
    }
  }

  private build(): void {
    this.root.innerHTML = '';
    this.buildStick();
    this.button('ctl-btn ctl-jump', 'HOPPA', Act.Jump);
    this.button('ctl-btn ctl-sword', 'SVÄRD', Act.Sword);
    this.button('ctl-btn ctl-magic', 'MAGI', Act.Magic);
    this.button('ctl-btn ctl-low', 'LÅGT', Act.LowSword);
    const pause = this.el('ctl ctl-small ctl-pause', 'II');
    pause.setAttribute('aria-label', 'Paus');
    pause.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.input.setSource('touch');
      this.onPause?.();
    });
    const fs = this.el('ctl ctl-small ctl-fullscreen', '⛶');
    fs.setAttribute('aria-label', 'Helskärm');
    fs.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.onFullscreen?.();
    });
  }

  private el(cls: string, text: string): HTMLElement {
    const d = document.createElement('div');
    d.className = cls;
    d.textContent = text;
    d.addEventListener('contextmenu', (e) => e.preventDefault());
    this.root.appendChild(d);
    return d;
  }

  private button(cls: string, label: string, action: Action): void {
    const d = this.el(`ctl ${cls}`, label);
    const pointers = new Set<number>();
    const down = (e: PointerEvent): void => {
      e.preventDefault();
      pointers.add(e.pointerId);
      try {
        d.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      d.classList.add('pressed');
      this.input.press(action);
    };
    const up = (e: PointerEvent): void => {
      pointers.delete(e.pointerId);
      if (pointers.size === 0) {
        d.classList.remove('pressed');
        this.input.release(action);
      }
    };
    d.addEventListener('pointerdown', down);
    d.addEventListener('pointerup', up);
    d.addEventListener('pointercancel', up);
    d.addEventListener('lostpointercapture', up);
  }

  private buildStick(): void {
    const dpad = this.layout.mode === 'dpad';
    const zone = document.createElement('div');
    zone.className = dpad ? 'ctl ctl-dpad' : 'ctl ctl-stick';
    zone.addEventListener('contextmenu', (e) => e.preventDefault());
    this.arms = {};
    this.knob = null;
    if (dpad) {
      for (const k of ['up', 'down', 'left', 'right']) {
        const a = document.createElement('div');
        a.className = `arm ${k}`;
        zone.appendChild(a);
        this.arms[k] = a;
      }
    } else {
      this.knob = document.createElement('div');
      this.knob.className = 'knob';
      zone.appendChild(this.knob);
    }
    this.root.insertBefore(zone, this.root.firstChild);
    this.stickEl = zone;

    const move = (e: PointerEvent): void => {
      if (e.pointerId !== this.stickPointer) return;
      e.preventDefault();
      const r = zone.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const radius = r.width / 2;
      let dx = (e.clientX - cx) / radius;
      let dy = (e.clientY - cy) / radius;
      const len = Math.hypot(dx, dy);
      if (len > 1) {
        dx /= len;
        dy /= len;
      }
      const dead = dpad ? 0.2 : 0.3;
      const mag = Math.hypot(dx, dy);
      let l = false, rr = false, u = false, d = false;
      if (mag > dead) {
        // 8-way with generous diagonals; diagonals are narrower for the d-pad.
        const ang = Math.atan2(dy, dx);
        const sector = Math.round(ang / (Math.PI / 4));
        switch (sector) {
          case 0: rr = true; break;
          case 1: rr = true; d = true; break;
          case 2: d = true; break;
          case 3: l = true; d = true; break;
          case 4: case -4: l = true; break;
          case -3: l = true; u = true; break;
          case -2: u = true; break;
          case -1: rr = true; u = true; break;
        }
      }
      this.setDirs(l, rr, u, d);
      if (this.knob) {
        this.knob.style.transform = `translate(${dx * 70}%, ${dy * 70}%)`;
      }
    };
    zone.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.stickPointer !== null) return;
      this.stickPointer = e.pointerId;
      try {
        zone.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      this.input.setSource('touch');
      move(e);
    });
    zone.addEventListener('pointermove', move);
    const end = (e: PointerEvent): void => {
      if (e.pointerId !== this.stickPointer) return;
      this.clearStick();
    };
    zone.addEventListener('pointerup', end);
    zone.addEventListener('pointercancel', end);
    zone.addEventListener('lostpointercapture', end);
  }

  private clearStick(): void {
    this.stickPointer = null;
    this.setDirs(false, false, false, false);
    if (this.knob) this.knob.style.transform = '';
  }

  private setDirs(l: boolean, r: boolean, u: boolean, d: boolean): void {
    const set = (key: 'left' | 'right' | 'up' | 'down', on: boolean, a: Action): void => {
      if (this.dirs[key] === on) return;
      this.dirs[key] = on;
      if (on) this.input.press(a);
      else this.input.release(a);
      this.arms[key]?.classList.toggle('on', on);
    };
    set('left', l, Act.Left);
    set('right', r, Act.Right);
    set('up', u, Act.Up);
    set('down', d, Act.Down);
  }
}
