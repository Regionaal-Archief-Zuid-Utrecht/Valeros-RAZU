import { Injectable } from '@angular/core';
import { FileType } from '../models/file-type.model';
import { MimeTypeService } from './mime-type.service';
import { UrlService } from './url.service';
import { SparqlService } from './sparql.service';

@Injectable({
  providedIn: 'root',
})
export class FileRenderService {
  private readonly THUMB_IMAGES: Record<FileType, string> = {
    [FileType.PDF]: '/assets/img/file-types/pdf.png',
    [FileType.DOC]: '/assets/img/file-types/doc.png',
    [FileType.IMAGE]: '/assets/img/file-types/image.png',
    [FileType.PPT]: '/assets/img/file-types/ppt.png',
    [FileType.XLS]: '/assets/img/file-types/xls.png',
    [FileType.OTHER_VIEWABLE_FILE]: '/assets/img/file-types/file.png',
    [FileType.UNKNOWN]: '/assets/img/file-types/file.png',
  };

  private readonly SUPPORTED_MIME_TYPES = {
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

  constructor(
    private mimeTypeService: MimeTypeService,
    private urlService: UrlService,
    private sparql: SparqlService,
  ) {}

  getFileType(mimeType: string | undefined): FileType {
    if (!mimeType) return FileType.UNKNOWN;

    for (const [type, patterns] of Object.entries(this.SUPPORTED_MIME_TYPES)) {
      if (patterns.some((pattern) => mimeType.startsWith(pattern))) {
        return type as FileType;
      }
    }

    return FileType.UNKNOWN;
  }

  getThumbUrl(url: string, fileType: FileType): string {
    if (fileType === FileType.IMAGE) {
      return url;
    }
    return this.THUMB_IMAGES[fileType] || this.THUMB_IMAGES[FileType.UNKNOWN];
  }

  getCommonFileType(fileTypes: FileType[]): FileType {
    if (fileTypes.length === 0) return FileType.UNKNOWN;

    const uniqueTypes = new Set(fileTypes);
    if (uniqueTypes.size === 1) {
      const type = fileTypes[0];
      return type || FileType.UNKNOWN;
    }
    return FileType.UNKNOWN;
  }

  async processUrls(
    inputUrls: string | string[],
    hopPreds?: string[],
  ): Promise<{ fileUrls: string[]; mimeTypes: Map<string, string> }> {
    const urls = Array.isArray(inputUrls) ? inputUrls : [inputUrls];
    const validUrls = urls.filter((url) => url);

    if (validUrls.length === 0) {
      return { fileUrls: [], mimeTypes: new Map() };
    }

    let unprocessedUrls: string[];
    if (hopPreds && hopPreds.length > 0) {
      const urlPromises = validUrls.map((url) =>
        this.sparql.getObjIds(url, hopPreds),
      );
      const results = await Promise.all(urlPromises);
      unprocessedUrls = results.flat();
    } else {
      unprocessedUrls = validUrls;
    }

    const fileUrls = await Promise.all(
      unprocessedUrls.map((url) => this.urlService.processUrl(url, false)),
    );

    const mimeTypes = new Map<string, string>();
    await Promise.all(
      fileUrls.map(async (url) => {
        const mimeType = await this.mimeTypeService.getMimeType(url);
        if (mimeType) {
          mimeTypes.set(url, mimeType);
        }
      }),
    );

    return { fileUrls, mimeTypes };
  }

  hasViewer(fileUrls: string[], mimeTypes: Map<string, string>): boolean {
    return fileUrls.some((url) => {
      const mimeType = mimeTypes.get(url);
      const type = this.getFileType(mimeType);
      return type !== FileType.UNKNOWN;
    });
  }
}
