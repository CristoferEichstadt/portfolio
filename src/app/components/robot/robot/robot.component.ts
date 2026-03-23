import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  signal,
  computed,
  NgZone,
  ElementRef,
  input,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasterEggService } from '../../../services/easter-egg.service';
import { NarrativeService } from '../../../services/narrative.service';
import { TerminalPrankService } from '../../../services/terminal-prank.service';
import type { ChapterId } from '../../../data/content';

export type RobotState =
  | 'sleep'
  | 'idle'
  | 'wake-stretch'
  | 'wake'
  | 'teleport'
  | 'inspect'
  | 'work'
  | 'walk'
  | 'spy'
  | 'cta-focus'
  | 'goodbye-idle';

export type PropType =
  | 'none'
  | 'terminal-cursor'
  | 'map'
  | 'camera'
  | 'gear'
  | 'browsers'
  | 'wrench'
  | 'toolbox'
  | 'checkmark';

interface SceneConfig {
  id: ChapterId;
  state: RobotState;
  prop: PropType;
  eyeTarget?: 'left' | 'right' | 'down' | 'center';
}

@Component({
  selector: 'app-robot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './robot.component.html',
  styleUrl: './robot.component.scss',
})
export class RobotComponent implements OnInit, OnDestroy {
  readonly labMode = input(false);
  private readonly easterEgg = inject(EasterEggService);
  private readonly narrative = inject(NarrativeService);
  private readonly terminalPrank = inject(TerminalPrankService);

  readonly robotState = signal<RobotState>('sleep');
  readonly activeProp = signal<PropType>('none');
  readonly isVisible = signal(false);
  readonly robotY = signal(0);
  readonly isWalking = signal(false);
  readonly eyeDirection = signal<'left' | 'right' | 'down' | 'center'>('center');
  readonly scanBeamActive = signal(false);
  readonly showTrail = signal(false);
  readonly eyeOffsetX = signal(0);
  readonly eyeOffsetY = signal(0);
  readonly robotX = signal<number | null>(null);
  readonly isPointingLeft = signal(false);
  readonly speechText = signal('');
  readonly showSpeech = signal(false);
  readonly isDenyingClose = signal(false);

  // Combined eye transform: merges mouse offset + section direction
  readonly eyeTranslateX = computed(() => {
    const dir = this.eyeDirection();
    const base = dir === 'left' ? -2.5 : dir === 'right' ? 2.5 : 0;
    return +(base + this.eyeOffsetX()).toFixed(2);
  });
  readonly eyeTranslateY = computed(() => {
    const base = this.eyeDirection() === 'down' ? 2.5 : 0;
    return +(base + this.eyeOffsetY()).toFixed(2);
  });
  readonly isTeleporting = signal(false);
  readonly showFlame = signal(false);
  readonly showSmoke = signal(false);
  readonly dodgeOffsetX = signal(0);

  private targetY = 0;
  private currentY = 0;
  private targetX: number | null = null;
  private currentX: number | null = null;
  private rafId: number | null = null;
  private transitionTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastSceneId: ChapterId = 'hero';
  private lastScrollY = 0;
  private trailDots: HTMLElement[] = [];
  private mouseTrackingEnabled = true;
  private dodgeTargetX = 0;
  private currentDodgeX = 0;
  private lockedY = false;
  private returningToEdge = false;
  private smokeTimeout: ReturnType<typeof setTimeout> | null = null;
  private startupTimeouts: ReturnType<typeof setTimeout>[] = [];
  private teleportTimeout: ReturnType<typeof setTimeout> | null = null;
  private easterEggRestoreTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly scanBeamDuration = 1800;
  private readonly teleportDuration = 520;
  private readonly easterEggDuration = 2100;
  private isEasterEggPlaying = false;
  private readonly startupFinished = signal(false);
  private terminalPrankTimeout: ReturnType<typeof setTimeout> | null = null;
  private speechTimeout: ReturnType<typeof setTimeout> | null = null;
  private prankIndex = 0;
  private readonly prankMessages = [
    'opa. esse nao.',
    'nao fecha, vai.',
    'deixa eu terminar.',
  ] as const;

  private readonly sceneMap: Record<ChapterId, SceneConfig> = {
    hero:     { id: 'hero',     state: 'wake',      prop: 'terminal-cursor', eyeTarget: 'left' },
    projects: { id: 'projects', state: 'work',      prop: 'gear',            eyeTarget: 'left' },
    stack:    { id: 'stack',    state: 'inspect',   prop: 'wrench',          eyeTarget: 'down' },
    services: { id: 'services', state: 'walk',      prop: 'toolbox',         eyeTarget: 'left' },
    about:    { id: 'about',    state: 'spy',       prop: 'none',            eyeTarget: 'right' },
    contact:  { id: 'contact',  state: 'cta-focus', prop: 'checkmark',       eyeTarget: 'left' },
  };

  private readonly chapterAnchors: Record<ChapterId, number> = {
    hero: 0.24,
    projects: 0.36,
    stack: 0.45,
    services: 0.56,
    about: 0.66,
    contact: 0.74,
  };

  constructor(private ngZone: NgZone, private elRef: ElementRef) {
    effect(() => {
      const activation = this.easterEgg.activation();
      if (activation > 0 && !this.labMode()) {
        this.triggerEasterEggTeleport();
      }
    });

    effect(() => {
      const chapterId = this.narrative.activeChapterId();
      const ready = this.startupFinished();
      if (!ready || this.labMode() || this.isEasterEggPlaying) return;
      this.enterSceneByChapter(chapterId);
      this.updateTargetY();
    });

    effect(() => {
      const activation = this.terminalPrank.activation();
      if (activation > 0 && !this.labMode()) {
        this.playTerminalCloseDeny();
      }
    });
  }

  ngOnInit(): void {
    if (this.labMode()) {
      // Lab mode: visible immediately, no scroll/observer setup
      this.isVisible.set(true);
      this.robotState.set('idle');
      return;
    }

    // Robot enters sleeping, then moves through a slower, more characterful startup.
    this.scheduleStartup(() => {
      this.currentY = window.innerHeight * 0.25;
      this.targetY = this.currentY;
      this.robotY.set(this.currentY);
      this.robotState.set('sleep');
      this.isVisible.set(true);
      this.startLerpLoop();
    }, 180);

    this.scheduleStartup(() => {
      this.robotState.set('wake-stretch');
      this.eyeDirection.set('center');
      this.activeProp.set('none');
    }, 980);

    this.scheduleStartup(() => {
      if (this.robotState() === 'wake-stretch') {
        this.robotState.set('wake');
      }
    }, 2520);

    this.scheduleStartup(() => {
      if (this.robotState() === 'wake') {
        this.eyeDirection.set('left');
        this.activeProp.set('terminal-cursor');
      }
    }, 3160);

    this.scheduleStartup(() => {
      if (this.robotState() === 'wake') {
        this.robotState.set('idle');
        this.activeProp.set('terminal-cursor');
      }
      this.startupFinished.set(true);
    }, 3940);

    this.lastSceneId = 'hero';
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
    if (this.smokeTimeout) clearTimeout(this.smokeTimeout);
    if (this.teleportTimeout) clearTimeout(this.teleportTimeout);
    if (this.easterEggRestoreTimeout) clearTimeout(this.easterEggRestoreTimeout);
    if (this.terminalPrankTimeout) clearTimeout(this.terminalPrankTimeout);
    if (this.speechTimeout) clearTimeout(this.speechTimeout);
    this.startupTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.labMode()) return;
    const currentScroll = window.scrollY;
    const scrollDelta = currentScroll - this.lastScrollY;

    // Any upward scroll releases the cta-focus Y lock so robot follows again
    if (scrollDelta < -20 && this.lockedY) {
      this.lockedY = false;
    }

    // Teleport effect when scrolling up very fast (>500px jump)
    if (scrollDelta < -500 && !this.isTeleporting()) {
      this.isTeleporting.set(true);
      if (this.teleportTimeout) clearTimeout(this.teleportTimeout);
      this.teleportTimeout = setTimeout(() => {
        this.currentY = this.targetY;
        this.robotY.set(this.currentY);
        this.isTeleporting.set(false);
      }, this.teleportDuration);
    }

    this.lastScrollY = currentScroll;
    this.updateTargetY();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.mouseTrackingEnabled || this.labMode()) return;

    // Get robot position on screen
    const wrap = this.elRef.nativeElement.querySelector('.robot-wrap');
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const robotCenterX = rect.left + rect.width / 2;
    const robotCenterY = rect.top + rect.height * 0.3; // eyes are near top

    const dx = e.clientX - robotCenterX;
    const dy = e.clientY - robotCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Normalize to max 3px offset for eyes
    const maxOffset = 3;
    const factor = Math.min(dist / 200, 1);
    const angle = Math.atan2(dy, dx);
    this.eyeOffsetX.set(Math.cos(angle) * maxOffset * factor);
    this.eyeOffsetY.set(Math.sin(angle) * maxOffset * factor);
  }

  private updateTargetY(): void {
    if (this.lockedY) return;
    const minY = window.innerHeight * 0.12;
    const maxY = window.innerHeight * 0.78;
    const chapterY = window.innerHeight * this.chapterAnchors[this.narrative.activeChapterId()];
    this.targetY = chapterY;
    // Safety clamp — prevents robot from going off-screen after bad rect captures
    this.targetY = Math.max(minY, Math.min(maxY, this.targetY));
  }

  /**
   * Detect DOM elements near the robot's position and compute
   * how far left the robot should shift to avoid overlapping them.
   * Called every frame inside the RAF loop (outside Angular zone).
   */
  private updateDodge(): void {
    // During contact walk (X-axis movement), no dodge needed
    if (this.targetX !== null) {
      this.dodgeTargetX = 0;
      return;
    }

    // Use the actual fixed robot-wrap element for correct viewport coordinates
    const wrap = (this.elRef.nativeElement as HTMLElement).querySelector('.robot-wrap') as HTMLElement;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();

    const elements = document.querySelectorAll<HTMLElement>(
      'h1, h2, h3, p, li, article, blockquote, .project-card, .stack__category, .stack__capability, .hero__content, .about__content, .services__list'
    );

    let maxShift = 0;

    elements.forEach(el => {
      const elRect = el.getBoundingClientRect();

      // Skip elements not visible on screen
      if (elRect.bottom < 0 || elRect.top > window.innerHeight) return;

      // Vertical overlap: robot vs element (with 16px padding)
      const vOverlap = rect.top - 16 < elRect.bottom && rect.bottom + 16 > elRect.top;
      if (!vOverlap) return;

      // How far does the element intrude into the robot (overlap in X)?
      const overlapX = elRect.right - rect.left;
      if (overlapX > 0) {
        // Push robot off right edge by overlapX + 16px breathing room
        // Cap at 60 so robot stays at least half (36px) on screen
        maxShift = Math.max(maxShift, Math.min(overlapX + 16, 60));
      }
    });

    this.dodgeTargetX = maxShift;
  }

  private startLerpLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        const diff = this.targetY - this.currentY;
        const speed = Math.abs(diff);

        if (speed > 0.5) {
          this.currentY += diff * 0.05;

          if (speed > 5 && !this.isWalking()) {
            this.ngZone.run(() => {
              this.isWalking.set(true);
              this.showTrail.set(true);
              this.showFlame.set(true);
            });
          } else if (speed <= 5 && this.isWalking()) {
            this.ngZone.run(() => {
              this.isWalking.set(false);
              this.showFlame.set(false);
              setTimeout(() => this.showTrail.set(false), 600);
            });
          }

          this.ngZone.run(() => this.robotY.set(this.currentY));
        } else {
          this.currentY = this.targetY;
          if (this.isWalking()) {
            this.ngZone.run(() => {
              this.isWalking.set(false);
              this.showFlame.set(false);
              setTimeout(() => this.showTrail.set(false), 600);
            });
          }
        }

        // Lerp X for contact walk and return-to-edge
        if (this.targetX !== null && this.currentX !== null) {
          const dxWalk = this.targetX - this.currentX;
          const lerpX = this.returningToEdge ? 0.07 : 0.03;
          if (Math.abs(dxWalk) > 1) {
            this.currentX += dxWalk * lerpX;
            this.ngZone.run(() => this.robotX.set(this.currentX));
          } else if (this.returningToEdge) {
            // Reached right edge — switch back to right-based positioning seamlessly
            this.targetX = null;
            this.currentX = null;
            this.returningToEdge = false;
            this.ngZone.run(() => this.robotX.set(null));
          } else {
            this.currentX = this.targetX;
            this.ngZone.run(() => {
              this.robotX.set(this.currentX);
              // Landing smoke when reaching WhatsApp
              if (this.smokeTimeout) clearTimeout(this.smokeTimeout);
              this.showSmoke.set(true);
              this.smokeTimeout = setTimeout(() => this.showSmoke.set(false), 1400);
            });
          }
        }

        // Dodge text elements
        this.updateDodge();
        const dodgeDiff = this.dodgeTargetX - this.currentDodgeX;
        if (Math.abs(dodgeDiff) > 0.5) {
          this.currentDodgeX += dodgeDiff * 0.08;
          this.ngZone.run(() => this.dodgeOffsetX.set(this.currentDodgeX));
        }

        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    });
  }

  private enterSceneByChapter(chapterId: ChapterId, force = false): void {
    this.enterSceneInternal(this.sceneMap[chapterId], force);
  }

  private enterSceneInternal(scene: SceneConfig, force = false): void {
    if (!force && this.lastSceneId === scene.id) return;
    this.lastSceneId = scene.id;

    if (this.isEasterEggPlaying) return;

    if (this.transitionTimeout) clearTimeout(this.transitionTimeout);

    // Prop exit
    this.activeProp.set('none');

    // Brief pause before new scene (contact reacts faster)
    const sceneDelay = scene.id === 'contact' ? 50 : 200;
    this.transitionTimeout = setTimeout(() => {
      this.robotState.set(scene.state);
      this.eyeDirection.set(scene.eyeTarget ?? 'center');

      // Prop entrance (staggered)
      if (scene.prop !== 'none') {
        setTimeout(() => this.activeProp.set(scene.prop), 300);
      }

      // Scan beam for stack section
      if (scene.id === 'stack') {
        setTimeout(() => this.scanBeamActive.set(true), 500);
        setTimeout(() => this.scanBeamActive.set(false), 500 + this.scanBeamDuration);
      }

      // Auto-return to idle from transient states
      if (['wake', 'inspect', 'work', 'spy'].includes(scene.state)) {
        this.transitionTimeout = setTimeout(() => {
          if (this.robotState() === scene.state) {
            this.robotState.set('idle');
          }
        }, 3200);
      }

      // CTA payoff — robot walks to WhatsApp button
      if (scene.state === 'cta-focus') {
        this.isPointingLeft.set(false);

        // Capture Y immediately (before scroll moves the button out of viewport)
        const whatsBtn = document.querySelector('.contact__btn-whatsapp') as HTMLElement;
        const contactPanel = document.querySelector('.contact__panel') as HTMLElement | null;
        if (whatsBtn) {
          const btnRect = whatsBtn.getBoundingClientRect();
          const btnCenterY = btnRect.top + btnRect.height / 2;
          const rawY = btnCenterY - 54;
          // Only lock if button is actually on screen (positive top means in viewport)
          if (btnRect.top > 0 && btnRect.top < window.innerHeight) {
            this.targetY = Math.max(0, Math.min(window.innerHeight - 120, rawY));
            this.lockedY = true;
          }
        }

        // Walk X after short delay
        setTimeout(() => {
          const emailBtn = document.querySelector('.btn-secondary') as HTMLElement;
          const anchorBtn = whatsBtn ?? emailBtn;
          if (anchorBtn) {
            const btnRect = anchorBtn.getBoundingClientRect();
            const panelRect = contactPanel?.getBoundingClientRect();
            const robotWidth = window.innerWidth < 768 ? 44 : window.innerWidth < 1024 ? 58 : 72;
            const laneStart = panelRect ? panelRect.right + 18 : btnRect.right + 18;
            const minLeft = btnRect.right + 18;
            const maxLeft = window.innerWidth - robotWidth - 12;
            const hasSafeLane = laneStart + robotWidth <= window.innerWidth - 12;

            if (window.innerWidth >= 1100 && hasSafeLane) {
              this.targetX = Math.max(minLeft, Math.min(maxLeft, laneStart));
              this.currentX = this.currentX ?? (window.innerWidth - 24);
              return;
            }

            this.targetX = null;
            this.currentX = null;
            this.robotX.set(null);
          }
        }, 300);

        this.transitionTimeout = setTimeout(() => {
          if (this.robotState() === 'cta-focus') {
            this.robotState.set('goodbye-idle');
          }
        }, 4000);
      } else {
        // Animate robot back to right edge before switching positioning
        if (this.currentX !== null && !this.returningToEdge) {
          this.returningToEdge = true;
          this.targetX = window.innerWidth - 96; // right:24px + width:72px
          this.isPointingLeft.set(false);
        }
        this.lockedY = false;
      }
    }, sceneDelay);
  }

  private scheduleStartup(fn: () => void, delay: number): void {
    this.startupTimeouts.push(setTimeout(fn, delay));
  }

  private triggerEasterEggTeleport(): void {
    this.isEasterEggPlaying = true;
    this.mouseTrackingEnabled = false;
    this.lockedY = false;
    this.returningToEdge = false;
    this.targetX = null;
    this.currentX = null;

    if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
    if (this.smokeTimeout) clearTimeout(this.smokeTimeout);
    if (this.teleportTimeout) clearTimeout(this.teleportTimeout);
    if (this.easterEggRestoreTimeout) clearTimeout(this.easterEggRestoreTimeout);

    this.isWalking.set(false);
    this.showTrail.set(false);
    this.showFlame.set(false);
    this.showSmoke.set(false);
    this.isPointingLeft.set(false);
    this.robotX.set(null);

    this.robotState.set('teleport');
    this.activeProp.set('browsers');
    this.eyeDirection.set('center');
    this.isTeleporting.set(true);

    this.teleportTimeout = setTimeout(() => {
      this.isTeleporting.set(false);
    }, this.teleportDuration);

    this.easterEggRestoreTimeout = setTimeout(() => {
      this.isEasterEggPlaying = false;
      this.mouseTrackingEnabled = true;

      const scene = this.sceneMap[this.narrative.activeChapterId()] ?? this.sceneMap.hero;
      this.robotState.set('idle');
      this.activeProp.set('none');
      this.enterSceneInternal(scene, true);
    }, this.easterEggDuration);
  }

  private playTerminalCloseDeny(): void {
    if (this.isEasterEggPlaying) return;

    if (this.terminalPrankTimeout) clearTimeout(this.terminalPrankTimeout);
    if (this.speechTimeout) clearTimeout(this.speechTimeout);

    this.isDenyingClose.set(true);
    this.showSpeech.set(true);
    this.speechText.set(this.prankMessages[this.prankIndex % this.prankMessages.length]);
    this.prankIndex++;

    this.mouseTrackingEnabled = false;
    this.eyeOffsetX.set(0);
    this.eyeOffsetY.set(0);
    this.eyeDirection.set('left');
    this.activeProp.set('terminal-cursor');

    this.speechTimeout = setTimeout(() => {
      this.showSpeech.set(false);
    }, 1150);

    this.terminalPrankTimeout = setTimeout(() => {
      this.isDenyingClose.set(false);
      this.mouseTrackingEnabled = true;

      if (!this.labMode() && this.startupFinished()) {
        this.enterSceneByChapter(this.narrative.activeChapterId(), true);
      }
    }, 1500);
  }
}
