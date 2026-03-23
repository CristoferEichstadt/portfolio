import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RobotComponent, RobotState, PropType } from '../robot/robot.component';

@Component({
  selector: 'app-robot-lab',
  standalone: true,
  imports: [CommonModule, RobotComponent],
  templateUrl: './robot-lab.component.html',
  styleUrl: './robot-lab.component.scss',
})
export class RobotLabComponent implements AfterViewInit {
  @ViewChild(RobotComponent) robot!: RobotComponent;

  readonly states: RobotState[] = ['sleep', 'wake-stretch', 'wake', 'idle', 'teleport', 'inspect', 'work', 'walk', 'spy', 'cta-focus', 'goodbye-idle'];
  readonly props: PropType[] = ['none', 'terminal-cursor', 'map', 'camera', 'gear', 'browsers', 'wrench', 'toolbox', 'checkmark'];
  readonly eyes: Array<'left' | 'right' | 'down' | 'center'> = ['left', 'right', 'down', 'center'];

  activeState: RobotState = 'idle';
  activeProp: PropType = 'none';
  activeEye: 'left' | 'right' | 'down' | 'center' = 'center';
  isFlying = false;

  ngAfterViewInit(): void {}

  setState(s: RobotState) {
    this.activeState = s;
    this.robot.robotState.set(s);
  }

  setProp(p: PropType) {
    this.activeProp = p;
    this.robot.activeProp.set(p);
  }

  setEye(e: 'left' | 'right' | 'down' | 'center') {
    this.activeEye = e;
    this.robot.eyeDirection.set(e);
  }

  toggleFly() {
    this.isFlying = !this.isFlying;
    this.robot.isWalking.set(this.isFlying);
    this.robot.showFlame.set(this.isFlying);
    this.robot.showTrail.set(false);
  }

  triggerSmoke() {
    this.robot.showSmoke.set(true);
    setTimeout(() => this.robot.showSmoke.set(false), 1400);
  }

  triggerScan() {
    this.robot.scanBeamActive.set(true);
    setTimeout(() => this.robot.scanBeamActive.set(false), 1800);
  }

  triggerTeleport() {
    this.robot.isTeleporting.set(true);
    setTimeout(() => this.robot.isTeleporting.set(false), 520);
  }

  togglePoint() {
    const next = !this.robot.isPointingLeft();
    this.robot.isPointingLeft.set(next);
  }

  animSpeed = 1;
  scrubMode = false;
  scrubValue = 0;

  setSpeed(value: number) {
    this.animSpeed = value;
    const anims = this.getRobotAnimations();
    anims.forEach(a => {
      a.playbackRate = value;
      if (a.playState === 'paused') a.play();
    });
  }

  toggleScrub() {
    this.scrubMode = !this.scrubMode;
    const anims = this.getRobotAnimations();
    if (this.scrubMode) {
      anims.forEach(a => a.pause());
      this.scrubValue = 0;
    } else {
      anims.forEach(a => { a.playbackRate = this.animSpeed; a.play(); });
    }
  }

  scrub(percent: number) {
    this.scrubValue = percent;
    const anims = this.getRobotAnimations();
    anims.forEach(a => {
      const timing = (a.effect as KeyframeEffect)?.getTiming();
      const duration = typeof timing?.duration === 'number' ? timing.duration : 0;
      if (duration > 0) a.currentTime = (percent / 100) * duration;
    });
  }

  private getRobotAnimations(): Animation[] {
    const wrap = document.querySelector('app-robot .robot-wrap');
    return wrap ? Array.from((wrap as Element).getAnimations({ subtree: true })) : [];
  }
}
