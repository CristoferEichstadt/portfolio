import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contact, chapterMap } from '../../../data/content';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly chapter = chapterMap.contact;
  readonly contact = contact;
  readonly currentYear = new Date().getFullYear();
}
