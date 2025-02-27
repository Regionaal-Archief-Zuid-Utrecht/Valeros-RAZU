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
import { FileRenderService } from '../../../../../services/file-render.service';
import { NgIcon } from '@ng-icons/core';
import { featherDownload } from '@ng-icons/feather-icons';

@Component({
  selector: 'app-file-renderer',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NodeImagesComponent,
    DocViewerComponent,
    NodeLinkComponent,
    NgIcon,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
  ],
  templateUrl: './file-renderer.component.html',
  styleUrl: './file-renderer.component.css',
})
export class FileRendererComponent implements OnInit, OnChanges {
  protected readonly FileType = FileType;

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
    const fileTypes = this.fileUrls.map((url) => this.getFileType(url));
    return this.fileRenderService.getCommonFileType(fileTypes);
  }

  constructor(public fileRenderService: FileRenderService) {}

  ngOnInit(): void {
    void this.initFileUrls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urls'] && !changes['urls'].firstChange) {
      void this.initFileUrls();
    }
  }

  private async initFileUrls() {
    this.loading = true;

    try {
      const { fileUrls, mimeTypes } = await this.fileRenderService.processUrls(
        this.urls,
        this.hopSettings?.preds,
      );

      this.fileUrls = fileUrls;
      this.urlMimeTypes = mimeTypes;

      const hasViewer = this.fileRenderService.hasViewer(fileUrls, mimeTypes);
      this.hasViewer.emit(hasViewer);
    } finally {
      this.loading = false;
    }
  }

  getFileType(url: string): FileType {
    const mimeType = this.urlMimeTypes.get(url);
    return this.fileRenderService.getFileType(mimeType);
  }

  protected readonly featherDownload = featherDownload;
}
