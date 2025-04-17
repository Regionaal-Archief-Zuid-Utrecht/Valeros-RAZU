import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MiradorComponent } from '../../../components/mirador/mirador.component';

@Component({
  selector: 'app-node-images',
  standalone: true,
  imports: [NgIf, MiradorComponent],
  templateUrl: './node-images.component.html',
  styleUrl: './node-images.component.scss',
})
export class NodeImagesComponent {
  @Input() imageUrls?: string[];
  @Input() shownInTableCell = true;
  @Input() useViewer = true;
  @Input() imageLabel?: string;

  onImageLoadError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/assets/images/default.png';
  }
}
