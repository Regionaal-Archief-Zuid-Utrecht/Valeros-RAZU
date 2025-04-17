import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-view-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-container.component.html',
  styleUrl: './view-container.component.scss',
})
export class ViewContainerComponent {}
