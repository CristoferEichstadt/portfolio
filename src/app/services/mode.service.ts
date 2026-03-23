import { Injectable, signal, computed } from '@angular/core';

export type SiteMode = 'human' | 'dev';

@Injectable({ providedIn: 'root' })
export class ModeService {
  readonly mode = signal<SiteMode>('human');
  readonly isDevMode = computed(() => this.mode() === 'dev');
  readonly isHumanMode = computed(() => this.mode() === 'human');

  toggle(): void {
    this.mode.update(m => (m === 'human' ? 'dev' : 'human'));
  }

  setMode(mode: SiteMode): void {
    this.mode.set(mode);
  }
}
