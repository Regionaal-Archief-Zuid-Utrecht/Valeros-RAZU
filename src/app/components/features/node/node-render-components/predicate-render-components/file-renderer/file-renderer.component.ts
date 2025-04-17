import { NgForOf, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherDownload } from '@ng-icons/feather-icons';
import { FileType } from '../../../../../../models/file-type.model';
import { HopLinkSettingsModel } from '../../../../../../models/settings/hop-link-settings.model';
import { FileRenderService } from '../../../../../../services/file-render.service';
import { DocViewerComponent } from '../../../../../doc-viewer/doc-viewer.component';
import { NodeImagesComponent } from '../../../node-images/node-images.component';
import { NodeLinkComponent } from '../../../node-link/node-link.component';

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

  constructor(public fileRenderService: FileRenderService) {}

  ngOnInit(): void {
    void this._initFileUrls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urls'] && !changes['urls'].firstChange) {
      void this._initFileUrls();
    }
  }

  get displayUrls(): string[] {
    if (this.isThumb) {
      return this.fileUrls.slice(0, 1);
    }

    return this.fileUrls;
  }

  get unifiedFileType(): FileType {
    const fileTypes = this.fileUrls.map((url) =>
      this.fileRenderService.getFileType(url),
    );
    return this.fileRenderService.findUnifiedFileType(fileTypes);
  }

  private _initHasViewer() {
    const fileTypes = this.fileUrls.map((fileUrl) =>
      this.fileRenderService.getFileType(fileUrl),
    );
    const hasViewableFiles = fileTypes.some(
      (type) => type !== FileType.UNKNOWN,
    );
    this.hasViewer.emit(hasViewableFiles);
  }

  private async _initFileUrls() {
    this.loading = true;

    try {
      const fileUrls = await this.fileRenderService.processUrls(
        this.urls,
        this.hopSettings?.preds,
      );

      this.fileUrls = fileUrls;
      this._initHasViewer();
    } finally {
      this.loading = false;
    }
  }

  protected readonly featherDownload = featherDownload;
}
