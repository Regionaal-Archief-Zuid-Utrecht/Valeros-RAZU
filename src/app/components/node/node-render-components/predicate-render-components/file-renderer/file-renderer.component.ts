import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { SparqlService } from '../../../../../services/sparql.service';
import {
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { NodeImagesComponent } from '../../../node-images/node-images.component';
import { DocViewerComponent } from '../../../../doc-viewer/doc-viewer.component';
import { HopLinkSettingsModel } from '../../../../../models/settings/hop-link-settings.model';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { MimeTypeService } from '../../../../../services/mime-type.service';
import { FileType } from '../../../../../models/file-type.model';
import { UrlService } from '../../../../../services/url.service';

@Component({
  selector: 'app-file-renderer',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NodeImagesComponent,
    DocViewerComponent,
    NodeLinkComponent,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
  ],
  templateUrl: './file-renderer.component.html',
  styleUrl: './file-renderer.component.css',
})
export class FileRendererComponent implements OnInit, OnChanges {
  protected readonly FileType = FileType;

  private static readonly THUMB_IMAGES: Record<FileType, string> = {
    [FileType.PDF]: '/assets/img/file-types/pdf.png',
    [FileType.DOC]: '/assets/img/file-types/doc.png',
    [FileType.IMAGE]: '/assets/img/file-types/image.png',
    [FileType.PPT]: '/assets/img/file-types/ppt.png',
    [FileType.XLS]: '/assets/img/file-types/xls.png',
    [FileType.OTHER_VIEWABLE_FILE]: '/assets/img/file-types/file.png',
    [FileType.UNKNOWN]: '/assets/img/file-types/file.png',
  };

  private static readonly SUPPORTED_MIME_TYPES = {
    [FileType.IMAGE]: ['image/'],
    [FileType.PDF]: ['application/pdf'],
    [FileType.DOC]: [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/x-iwork-pages-sffpages', // .pages
    ],
    [FileType.XLS]: [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ],
    [FileType.PPT]: [
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    ],
    [FileType.OTHER_VIEWABLE_FILE]: [
      'application/postscript', // .ai files
      'image/vnd.adobe.photoshop', // .psd files
      'text/plain', // .txt
      'text/html', // .html, .htm
      'text/css', // .css
      'application/x-httpd-php', // .php
      'text/x-c', // .c, .h
      'text/x-c++', // .cpp, .hpp
      'application/javascript', // .js
      'application/postscript', // .eps, .ps
      'application/dxf', // .dxf
      'application/x-font-ttf', // .ttf
      'application/zip', // .zip
      'application/x-rar-compressed', // .rar
      'application/vnd.ms-xpsdocument', // .xps
      // 'application/oxps', // .oxps
    ],
  } as const;

  @Input() urls: string | string[] = [];
  @Input() hopSettings?: HopLinkSettingsModel;
  @Input() shownInTableCell = false;
  @Input() isThumb = false;

  @Output() hasViewer = new EventEmitter<boolean>();

  fileUrls: string[] = [];
  loading = false;
  urlMimeTypes = new Map<string, string>();

  get displayUrls(): string[] {
    return this.isThumb ? this.fileUrls.slice(0, 1) : this.fileUrls;
  }

  get allFilesType(): FileType {
    if (this.fileUrls.length === 0) return FileType.UNKNOWN;

    const types = new Set(this.fileUrls.map((url) => this.getFileType(url)));
    if (types.size === 1) {
      const type = types.values().next().value;
      if (!type) {
        return FileType.UNKNOWN;
      }
      return type;
    }
    return FileType.UNKNOWN;
  }

  constructor(
    private sparql: SparqlService,
    private mimeTypeService: MimeTypeService,
    private urlService: UrlService,
  ) {}

  ngOnInit(): void {
    void this.initFileUrls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urls'] && !changes['urls'].firstChange) {
      void this.initFileUrls();
    }
  }

  private async initFileUrls() {
    const inputUrls = Array.isArray(this.urls) ? this.urls : [this.urls];
    const validUrls = inputUrls.filter((url) => url);

    if (validUrls.length === 0) {
      return;
    }

    this.loading = true;

    try {
      let unprocessedUrls: string[];
      if (
        this.hopSettings &&
        this.hopSettings.preds &&
        this.hopSettings.preds.length > 0
      ) {
        const urlPromises = validUrls.map((url) =>
          this.sparql.getObjIds(url, this.hopSettings!.preds),
        );

        const results = await Promise.all(urlPromises);
        unprocessedUrls = results.flat();
      } else {
        unprocessedUrls = validUrls;
      }

      this.fileUrls = await Promise.all(
        unprocessedUrls.map((url) => this.urlService.processUrl(url, false)),
      );

      await Promise.all(
        this.fileUrls.map(async (url) => {
          const mimeType = await this.mimeTypeService.getMimeType(url);
          if (mimeType) {
            this.urlMimeTypes.set(url, mimeType);
          }
        }),
      );

      const hasViewer = this.fileUrls.some((url) => {
        const type = this.getFileType(url);
        return type !== FileType.UNKNOWN;
      });

      this.hasViewer.emit(hasViewer);
    } finally {
      this.loading = false;
    }
  }

  getFileType(url: string): FileType {
    const mimeType = this.urlMimeTypes.get(url);
    if (!mimeType) return FileType.UNKNOWN;

    for (const [type, patterns] of Object.entries(
      FileRendererComponent.SUPPORTED_MIME_TYPES,
    )) {
      if (patterns.some((pattern) => mimeType.startsWith(pattern))) {
        return type as FileType;
      }
    }

    return FileType.UNKNOWN;
  }

  protected getThumbUrl(url: string): string {
    const fileType = this.getFileType(url);
    if (fileType === FileType.IMAGE) {
      return url;
    }
    return FileRendererComponent.THUMB_IMAGES[fileType];
  }
}
