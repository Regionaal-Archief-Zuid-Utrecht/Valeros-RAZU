import { NgIf } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FileType } from '../../models/file-type.model';
import { Settings } from '../../config/settings';

@Component({
  selector: 'app-doc-viewer',
  standalone: true,
  imports: [NgxDocViewerModule, NgIf],
  templateUrl: './doc-viewer.component.html',
  styleUrl: './doc-viewer.component.css',
})
export class DocViewerComponent implements OnInit {
  @Input() url?: string;
  @Input() fileType?: FileType;

  constructor() {}

  ngOnInit(): void {}

  getPdfUrl(): string {
    if (!this.url || !this.fileType) return '';

    if (this.fileType === FileType.PDF) {
      return this.url;
    }

    return Settings.pdfConversionUrl + encodeURIComponent(this.url);
  }
}
