import { Injectable, computed, signal } from '@angular/core';
import { chapters, chapterMap, type ChapterId } from '../data/content';

@Injectable({ providedIn: 'root' })
export class NarrativeService {
  readonly chapters = chapters;
  readonly navChapters = chapters.filter((chapter) => chapter.id !== 'hero');

  readonly scrollProgress = signal(0);
  readonly activeChapterId = signal<ChapterId>('hero');
  readonly activeChapter = computed(() => chapterMap[this.activeChapterId()]);

  private readonly sectionElements = new Map<ChapterId, HTMLElement>();

  syncSections(): void {
    this.sectionElements.clear();

    for (const chapter of this.chapters) {
      const el = document.getElementById(chapter.id);
      if (el) {
        this.sectionElements.set(chapter.id, el);
      }
    }

    this.updateFromScroll();
  }

  updateFromScroll(): void {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const viewportAnchor = scrollTop + Math.min(window.innerHeight * 0.38, 340);

    this.scrollProgress.set(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

    let nextChapter: ChapterId = 'hero';

    for (const chapter of this.chapters) {
      const el = this.sectionElements.get(chapter.id);
      if (!el) continue;

      if (viewportAnchor >= el.offsetTop - 48) {
        nextChapter = chapter.id;
      }
    }

    if (nextChapter !== this.activeChapterId()) {
      this.activeChapterId.set(nextChapter);
    }
  }
}
