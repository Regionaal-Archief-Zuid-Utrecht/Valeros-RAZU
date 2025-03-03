import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FileType } from '../../models/file-type.model';
import { Settings } from '../../config/settings';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doc-viewer',
  standalone: true,
  imports: [NgxDocViewerModule, NgIf, PdfJsViewerModule],
  templateUrl: './doc-viewer.component.html',
  styleUrl: './doc-viewer.component.css',
})
export class DocViewerComponent implements OnInit, AfterViewInit {
  @Input() url?: string;
  @Input() fileType?: FileType;
  @ViewChild('pdfViewer') pdfViewer: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initPdfViewer();
  }

  initPdfViewer() {
    const pdfUrl = this._getPdfUrl();
    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe((result) => {
      this.pdfViewer.pdfSrc = result;
      this.pdfViewer.refresh();
    });
  }

  private _getPdfUrl(): string {
    if (!this.url || !this.fileType) return '';

    if (this.fileType === FileType.PDF) {
      // TODO: Fix CORS issues on localhost / dev without corsproxy
      const isLocalhost = window.location.hostname === 'localhost';
      return isLocalhost
        ? 'https://corsproxy.io/?url=' + encodeURIComponent(this.url)
        : this.url;
    }

    return Settings.pdfConversionUrl + encodeURIComponent(this.url);
  }
}
