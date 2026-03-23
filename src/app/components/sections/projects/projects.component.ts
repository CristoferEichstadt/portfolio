import { Component, inject, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeService } from '../../../services/mode.service';
import { projects, ndaProject, contact, chapterMap } from '../../../data/content';
import type { ProjectSignal } from '../../../data/content';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements AfterViewInit {
  readonly modeService = inject(ModeService);
  readonly chapter = chapterMap.projects;
  readonly projects = projects;
  readonly ndaProject = ndaProject;
  readonly contact = contact;
  private readonly el = inject(ElementRef);
  readonly mainProject = projects.find((project) => project.priority === 'primary') ?? projects[0];
  readonly secondaryProjects = projects.filter((project) => project.priority === 'supporting');

  readonly logoMap: Record<string, string> = {
    'everflow': 'assets/logos/everflow.png',
    'mega-vistorias': 'assets/logos/mega-vistorias.png',
    'facilinformatica': 'assets/logos/facilinformatica.webp',
  };

  getLogoPath(logoKey: string): string {
    return this.logoMap[logoKey] ?? '';
  }

  getSignalPath(signal: ProjectSignal): string {
    const iconMap: Record<ProjectSignal, string> = {
      'field-sync': 'M6 19h12M5 7l7-4 7 4M8 10v4m8-4v8M4 14h4m8 0h4M9 18h6',
      'evidence-pdf': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5',
      'pipeline-webhook': 'M6 6h4v4H6zM14 14h4v4h-4zM14 4h4v4h-4zM10 8h4M16 8v6M10 16h4',
      'silent-ops': 'M3 5h8v6H3zM13 5h8v6h-8zM8 13h8v6H8zM7 11v2m10-2v2m-5 0v-2',
    };
    return iconMap[signal];
  }

  ngAfterViewInit(): void {
    // Skip on touch devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cards = this.el.nativeElement.querySelectorAll('.project-card') as NodeListOf<HTMLElement>;
    cards.forEach(card => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        const glowX = (50 + x * 40).toFixed(1);
        const glowY = (50 + y * 40).toFixed(1);
        card.style.setProperty('--glow-x', `${glowX}%`);
        card.style.setProperty('--glow-y', `${glowY}%`);
      });
    });
  }
}
