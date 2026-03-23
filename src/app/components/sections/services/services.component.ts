import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeService } from '../../../services/mode.service';
import { services, contact, chapterMap } from '../../../data/content';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  readonly modeService = inject(ModeService);
  readonly chapter = chapterMap.services;
  readonly services = services;
  readonly contact = contact;
}
