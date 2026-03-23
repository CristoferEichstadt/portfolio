import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeService } from '../../../services/mode.service';
import { ThemeService } from '../../../services/theme.service';
import { EasterEggService } from '../../../services/easter-egg.service';
import { NarrativeService } from '../../../services/narrative.service';
import type { ChapterId } from '../../../data/content';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  readonly modeService = inject(ModeService);
  readonly themeService = inject(ThemeService);
  readonly easterEggService = inject(EasterEggService);
  readonly narrative = inject(NarrativeService);

  readonly navLinks = this.narrative.navChapters;

  scrollTo(href: string, event: Event): void {
    event.preventDefault();

    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  onLogoClick(event: Event): void {
    this.easterEggService.logoClick();
    this.scrollTo('#', event);
  }

  isActive(id: ChapterId): boolean {
    return this.narrative.activeChapterId() === id;
  }
}
