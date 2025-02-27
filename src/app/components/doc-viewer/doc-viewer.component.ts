import { NgIf } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FileType, ViewerType } from '../../models/file-type.model';
import { UrlService } from '../../services/url.service';

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

  loadingGoogleViewer = false;
  convertingToPdf = false;

  // TODO: Remove Google viewer, use PDF viewer + Gotenberg conversion for all doc types and simply hide viewer if request fails.
  private readonly OFFICE_TYPES = [FileType.DOC, FileType.PPT, FileType.XLS];

  constructor() {}

  ngOnInit(): void {
    if (this.getViewer() === ViewerType.GOOGLE) {
      this.loadingGoogleViewer = true;
    }
  }

  private convertToPdf(url: string): string {
    return `https://ontwikkel.viewer.razu.nl/gotenberg/convert?url=${encodeURIComponent(url)}`;
  }

  getViewer(): ViewerType {
    if (!this.fileType) return ViewerType.GOOGLE;

    switch (this.fileType) {
      case FileType.PDF:
        return ViewerType.PDF;
      case FileType.DOC:
      case FileType.PPT:
      case FileType.XLS:
        return ViewerType.PDF;
      default:
        return ViewerType.GOOGLE;
    }
  }

  onLoadedGoogleViewer() {
    this.loadingGoogleViewer = false;
  }

  getViewerUrl(): string {
    if (!this.url || !this.fileType) return '';

    if (this.OFFICE_TYPES.includes(this.fileType)) {
      return this.convertToPdf(this.url);
    }
    return this.url;
  }
}
