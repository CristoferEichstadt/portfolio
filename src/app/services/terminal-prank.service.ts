import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TerminalPrankService {
  readonly active = signal(false);
  readonly activation = signal(0);

  private activeTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly activeDurationMs = 1400;

  attemptClose(): void {
    this.activation.update(count => count + 1);
    this.active.set(true);

    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout);
    }

    this.activeTimeout = setTimeout(() => {
      this.active.set(false);
    }, this.activeDurationMs);
  }
}
