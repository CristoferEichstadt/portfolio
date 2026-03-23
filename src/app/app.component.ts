import { Component, AfterViewInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/layout/nav/nav.component';
import { HeroComponent } from './components/sections/hero/hero.component';
import { ProjectsComponent } from './components/sections/projects/projects.component';
import { StackComponent } from './components/sections/stack/stack.component';
import { ServicesComponent } from './components/sections/services/services.component';
import { AboutComponent } from './components/sections/about/about.component';
import { ContactComponent } from './components/sections/contact/contact.component';
import { RobotComponent } from './components/robot/robot/robot.component';
import { RobotLabComponent } from './components/robot/robot-lab/robot-lab.component';
import { NarrativeService } from './services/narrative.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    HeroComponent,
    ProjectsComponent,
    StackComponent,
    ServicesComponent,
    AboutComponent,
    ContactComponent,
    RobotComponent,
    RobotLabComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  readonly narrative = inject(NarrativeService);
  readonly isLab = new URLSearchParams(window.location.search).has('lab');

  cursorX = -100;
  cursorY = -100;
  cursorHover = false;

  @HostListener('window:scroll')
  onPageScroll() {
    if (this.isLab) return;
    this.narrative.updateFromScroll();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isLab) return;
    this.narrative.syncSections();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.cursorX = e.clientX;
    this.cursorY = e.clientY;
  }

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(e: MouseEvent) {
    const target = e.target as HTMLElement;
    this.cursorHover = !!(target.closest('a, button, [role="button"], .project-card, .badge'));
  }

  @HostListener('document:mouseout')
  onMouseOut() {
    this.cursorHover = false;
  }

  ngAfterViewInit(): void {
    if (this.isLab) return;
    this.initRevealObserver();
    requestAnimationFrame(() => this.narrative.syncSections());
    setTimeout(() => this.narrative.syncSections(), 220);
  }

  private initRevealObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        visible.forEach((entry, batchIdx) => {
          const el = entry.target as HTMLElement;
          const base = parseFloat(el.dataset['revealDelay'] ?? '0');
          el.style.transitionDelay = `${base + batchIdx * 55}ms`;
          el.classList.add('revealed');
          observer.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10px 0px' }
    );

    const sections = document.querySelectorAll('section, .section');
    sections.forEach(section => {
      const items = section.querySelectorAll('.reveal');
      items.forEach((el, idx) => {
        (el as HTMLElement).dataset['revealDelay'] = `${idx * 55}`;
      });
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
}
