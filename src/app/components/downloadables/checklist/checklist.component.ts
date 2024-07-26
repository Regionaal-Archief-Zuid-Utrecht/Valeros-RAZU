import { Component, Input } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Representation {
  id: string;
  label: string;
  url: string[];
}

interface Child {
  id: string;
  label: string;
  children: Child[];
  representations: Representation[];
  selected?: boolean;
  selectAssociated?: boolean;
}

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
})
export class ChecklistComponent {
  @Input() item: any;
  @Input() depth: number = 0;
  @Input() maxDepth: number = 3; // Default max depth

  getAbbreviatedId(id: string | undefined): string {
    if (!id) {
      return '..unknown'; // Handle cases where id is undefined
    }
    const parts = id.split('-');
    return parts.length > 1
      ? '..' + parts.slice(-2).join('-')
      : '..' + id.slice(-6);
  }
}
