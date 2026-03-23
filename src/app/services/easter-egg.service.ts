import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EasterEggService {
  readonly active = signal(false);
  readonly activation = signal(0);

  private clickCount = 0;
  private lastClickAt = 0;
  private resetTimeout: ReturnType<typeof setTimeout> | null = null;
  private activeTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly comboWindowMs = 900;
  private readonly activeDurationMs = 3600;

  logoClick(): void {
    const now = Date.now();

    if (now - this.lastClickAt > this.comboWindowMs) {
      this.clickCount = 0;
    }

    this.lastClickAt = now;
    this.clickCount++;

    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    this.resetTimeout = setTimeout(() => {
      this.clickCount = 0;
    }, this.comboWindowMs);

    if (this.clickCount >= 5) {
      this.trigger();
    }
  }

  private trigger(): void {
    this.clickCount = 0;

    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }

    this.activation.update((count) => count + 1);
    this.active.set(true);

    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout);
    }

    this.activeTimeout = setTimeout(() => {
      this.active.set(false);
    }, this.activeDurationMs);
  }
}
