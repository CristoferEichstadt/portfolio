import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { stackCategories, stackCapabilitiesHuman, CapabilityIcon, chapterMap } from '../../../data/content';
import { ModeService } from '../../../services/mode.service';

// Lucide SVG paths (viewBox 0 0 24 24, stroke, stroke-width 1.5)
const ICON_PATHS: Record<CapabilityIcon, string> = {
  smartphone: 'M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01',
  monitor:    'M20 3H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8 21h8M12 17v4',
  server:     'M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zM2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4zM6 10h.01M6 18h.01',
  database:   'M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zM2 12c0 2.21 4.48 4 10 4s10-1.79 10-4M2 6c0 2.21 4.48 4 10 4s10-1.79 10-4',
  cloud:      'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
  bot:        'M12 8V4H8M12 8V4h4M12 8v4m-4 4h8M2 14h4m12 0h4M6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 14h8',
  eye:        'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
};

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.scss',
})
export class StackComponent {
  readonly modeService = inject(ModeService);
  readonly chapter = chapterMap.stack;
  readonly stackCategories = stackCategories;
  readonly capabilities = stackCapabilitiesHuman;

  readonly marqueeItems = stackCategories.flatMap(c => c.techs);

  getIconPath(icon: CapabilityIcon): string {
    return ICON_PATHS[icon];
  }
}
