import { Injectable } from '@angular/core';
import { Settings } from '../config/settings';
import { FileType } from '../models/file-type.model';
import { SparqlService } from './sparql.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class FileRenderService {
  constructor(
    private urlService: UrlService,
    private sparql: SparqlService,
  ) {}

  getThumbImageUrl(url: string, fileType: FileType): string {
    if (fileType === FileType.IMAGE) {
      return url;
    }

    const fileIconUrl = Settings.fileTypes[fileType]?.iconUrl;
    const unknownIconUrl = Settings.fileTypes[FileType.UNKNOWN].iconUrl;
    return fileIconUrl ?? unknownIconUrl;
  }

  getFileType(url: string): FileType {
    if (!url) return FileType.UNKNOWN;

    const urlWithoutParams = url.split('?')[0];
    const fileExtension = urlWithoutParams.split('.').pop()?.toLowerCase();

    if (!fileExtension) return FileType.UNKNOWN;

    for (const [fileType, config] of Object.entries(Settings.fileTypes)) {
      if (config.extensions.includes(fileExtension)) {
        return fileType as FileType;
      }
    }

    return FileType.UNKNOWN;
  }

  findUnifiedFileType(fileTypes: FileType[]): FileType {
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
  ): Promise<string[]> {
    const urls = Array.isArray(inputUrls) ? inputUrls : [inputUrls];
    const validUrls = urls.filter((url) => url);

    if (validUrls.length === 0) {
      return [];
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

    return fileUrls;
  }
}
