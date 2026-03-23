import { Component, inject, OnInit, OnDestroy, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeService } from '../../../services/mode.service';
import { EasterEggService } from '../../../services/easter-egg.service';
import { TerminalPrankService } from '../../../services/terminal-prank.service';
import { hero, terminalHuman, terminalDev, contact, layers, chapterMap } from '../../../data/content';
import type { TerminalLine, CapabilityIcon } from '../../../data/content';

interface AnimatedTerminalLine extends TerminalLine {
  visible: boolean;
  showLeadCursor: boolean;
  showBot: boolean;
  showTyping: boolean;
  showCmd: boolean;
  showOut: boolean;
}

const ICON_PATHS: Record<CapabilityIcon, string> = {
  smartphone: 'M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01',
  monitor: 'M20 3H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8 21h8M12 17v4',
  server: 'M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zM2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4zM6 10h.01M6 18h.01',
  database: 'M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zM2 12c0 2.21 4.48 4 10 4s10-1.79 10-4M2 6c0 2.21 4.48 4 10 4s10-1.79 10-4',
  cloud: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
  bot: 'M12 8V4H8M12 8V4h4M12 8v4m-4 4h8M2 14h4m12 0h4M6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 14h8',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
};

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly modeService = inject(ModeService);
  readonly easterEgg = inject(EasterEggService);
  readonly terminalPrank = inject(TerminalPrankService);

  readonly chapter = chapterMap.hero;
  readonly hero = hero;
  readonly contact = contact;
  readonly layers = layers;
  readonly easterEggLine = {
    cmd: 'intruso detectado...',
    out: 'brincadeira. oi.',
  };

  displayMetrics: { value: string; label: string }[] = [];
  easterEggLineVisible = false;
  easterEggLineOutputVisible = false;

  getIconPath(icon: CapabilityIcon): string {
    return ICON_PATHS[icon];
  }

  terminalLines: AnimatedTerminalLine[] = [];
  private terminalInterval: ReturnType<typeof setTimeout> | null = null;
  private easterEggTimeouts: ReturnType<typeof setTimeout>[] = [];
  private lastMode: 'human' | 'dev' = 'human';

  constructor() {
    effect(() => {
      const mode = this.modeService.mode();
      if (mode !== this.lastMode) {
        this.lastMode = mode;
        if (!this.easterEggLineVisible) {
          this.restartAnimation();
        }
      }
    });

    effect(() => {
      const activation = this.easterEgg.activation();
      if (activation > 0) {
        this.playEasterEggLine();
      }
    });
  }

  scrollToProjects(event: Event): void {
    event.preventDefault();
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }

  onTerminalCloseClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.terminalPrank.attemptClose();
  }

  ngOnInit(): void {
    this.lastMode = this.modeService.mode();
    this.startTerminalAnimation();
    this.displayMetrics = this.hero.metrics.map(m => ({ value: m.value, label: m.label }));
  }

  ngAfterViewInit(): void {
    const metricsEl = document.querySelector('.hero__metrics');
    if (!metricsEl) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        this.animateMetrics();
      }
    }, { threshold: 0.5 });
    obs.observe(metricsEl);
  }

  private animateMetrics(): void {
    this.hero.metrics.forEach((metric, i) => {
      const match = metric.value.match(/^(\d+)(.*)$/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = match[2] ?? '';
      const duration = 1000;
      const steps = 28;
      const intervalMs = duration / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const eased = 1 - Math.pow(1 - step / steps, 3);
        const current = Math.round(target * eased);
        this.displayMetrics[i] = { value: `${current}${suffix}`, label: metric.label };
        if (step >= steps) clearInterval(timer);
      }, intervalMs);
    });
  }

  ngOnDestroy(): void {
    if (this.terminalInterval) clearTimeout(this.terminalInterval);
    this.clearEasterEggTimers();
  }

  private getSourceLines(): TerminalLine[] {
    return this.modeService.isDevMode() ? terminalDev : terminalHuman;
  }

  private buildAnimatedLines(source: TerminalLine[]): AnimatedTerminalLine[] {
    return source.map(line => ({
      ...line,
      visible: false,
      showLeadCursor: false,
      showBot: false,
      showTyping: false,
      showCmd: false,
      showOut: false,
    }));
  }

  private restartAnimation(): void {
    if (this.terminalInterval) clearTimeout(this.terminalInterval);
    this.terminalLines = [];
    this.easterEggLineVisible = false;
    this.easterEggLineOutputVisible = false;
    this.clearEasterEggTimers();
    this.terminalInterval = setTimeout(() => this.startTerminalAnimation(), 150);
  }

  private startTerminalAnimation(): void {
    if (this.easterEggLineVisible) return;

    const source = this.getSourceLines();
    this.terminalLines = this.buildAnimatedLines(source);
    let i = 0;

    const showLine = () => {
      if (i >= this.terminalLines.length) {
        this.terminalInterval = setTimeout(() => {
          const fresh = this.getSourceLines();
          this.terminalLines = this.buildAnimatedLines(fresh);
          i = 0;
          this.terminalInterval = setTimeout(showLine, 600);
        }, 4000);
        return;
      }

      const current = i;
      const line = this.terminalLines[current];
      line.visible = true;
      line.showLeadCursor = true;

      this.terminalInterval = setTimeout(() => {
        line.showLeadCursor = false;
        line.showBot = true;
        line.showTyping = true;

        this.terminalInterval = setTimeout(() => {
          line.showTyping = false;
          line.showCmd = true;

          this.terminalInterval = setTimeout(() => {
            line.showOut = true;
            i++;
            this.terminalInterval = setTimeout(showLine, 460);
          }, 340);
        }, 420);
      }, 320);
    };

    this.terminalInterval = setTimeout(showLine, 700);
  }

  private playEasterEggLine(): void {
    if (this.terminalInterval) {
      clearTimeout(this.terminalInterval);
      this.terminalInterval = null;
    }

    this.clearEasterEggTimers();
    this.easterEggLineVisible = true;
    this.easterEggLineOutputVisible = false;

    this.easterEggTimeouts.push(
      setTimeout(() => {
        this.easterEggLineOutputVisible = true;
      }, 620),
      setTimeout(() => {
        this.easterEggLineVisible = false;
        this.easterEggLineOutputVisible = false;
        this.startTerminalAnimation();
      }, 3600)
    );
  }

  private clearEasterEggTimers(): void {
    this.easterEggTimeouts.forEach(timeout => clearTimeout(timeout));
    this.easterEggTimeouts = [];
  }
}
