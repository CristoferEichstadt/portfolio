import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeService } from '../../../services/mode.service';
import { about, chapterMap } from '../../../data/content';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly modeService = inject(ModeService);
  readonly chapter = chapterMap.about;
  readonly about = about;
}
