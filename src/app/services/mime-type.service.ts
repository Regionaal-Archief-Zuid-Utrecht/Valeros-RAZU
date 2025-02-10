import { Injectable } from '@angular/core';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root',
})
export class MimeTypeService {
  private readonly mimeTypeMap: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.tiff': 'image/tiff',
    '.svg': 'image/svg+xml',
    '.ai': 'application/postscript',
    '.psd': 'image/vnd.adobe.photoshop',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx':
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.pages': 'application/x-iwork-pages-sffpages',
    '.xps': 'application/vnd.ms-xpsdocument',
    '.oxps': 'application/oxps',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.htm': 'text/html',
    '.css': 'text/css',
    '.php': 'application/x-httpd-php',
    '.c': 'text/x-c',
    '.cpp': 'text/x-c++',
    '.h': 'text/x-c',
    '.hpp': 'text/x-c++',
    '.js': 'application/javascript',
    '.eps': 'application/postscript',
    '.ps': 'application/postscript',
    '.dxf': 'application/dxf',
    '.ttf': 'application/x-font-ttf',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
  };

  getMimeType(url: string): string | null {
    try {
      if (
        (Settings.imageUrlSubstrings as string[]).some((substring) =>
          url.includes(substring),
        )
      ) {
        return 'image/jpeg';
      }

      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      const lastDotIndex = pathname.lastIndexOf('.');
      if (lastDotIndex === -1) {
        return null;
      }

      const extension = pathname.substring(lastDotIndex).toLowerCase();
      return this.mimeTypeMap[extension] || null;
    } catch (error) {
      console.error('Error parsing URL in getMimeType:', error);
      return null;
    }
  }
}
