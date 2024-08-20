import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Config } from '../../../config/config';
import { NgIcon } from '@ng-icons/core';
import { UrlService } from '../../../services/url.service';
import { Settings } from '../../../config/settings';
import { PdfViewerModule, PDFProgressData } from 'ng2-pdf-viewer';
import { MessageService } from '../../../services/message.service';
import { featherEye, featherEyeOff } from '@ng-icons/feather-icons';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-node-document',
  standalone: true,
  imports: [NgForOf, NgIf, NgIcon, JsonPipe, PdfViewerModule, TranslocoModule],
  templateUrl: './node-document.component.html',
  styleUrl: './node-document.component.scss',
})
export class NodeDocumentComponent implements OnInit, OnChanges {
  @Input() documentUrls?: string[];
  @Input() width = '5rem';
  src = '/assets/example.pdf';
  processedDocumentUrls: string[] = [];
  documents: { url: string, blobUrl: string, visible: boolean, title: string }[] = [];
  setTimedMessage = new EventEmitter<any>();

  constructor(
    public urlService: UrlService,
    public messageService: MessageService,
  ) {}

  ngOnInit() {
    this.messageService.sendMessage('Loading documents...', true, 5);
    this.processDocumentUrls().then(() => {
      this.fetchDocuments(this.processedDocumentUrls);
      this.messageService.destroyMessage();
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentUrls']) {
      this.processDocumentUrls();
    }
  }

  private async processDocumentUrls() {
    if (!this.documentUrls) {
      return;
    }

    this.processedDocumentUrls = await this.urlService.processUrls(
      this.documentUrls,
    );
    
  }

  fetchDocuments(urls: string[]): void {
    urls.forEach((url) => {
      this.urlService.getProxiedDocument(url).subscribe(
        (response) => {
          const blobUrl = URL.createObjectURL(response);
          const title = url.split('/').pop()?.split('?')[0] || url;
          this.documents.push({ url, blobUrl, visible: false, title });
        },
        (error) => {
          console.error('Error fetching PDF document:', error);
        }
      );
    });
  }

  toggleDocumentVisibility(document: { url: string, blobUrl: string, visible: boolean, title: string }): void {
    document.visible = !document.visible;
  }

  protected readonly Config = Config;
  protected readonly featherEye = featherEye;
  protected readonly featherEyeOff = featherEyeOff;

  onDocumentLoadError($event: ErrorEvent) {
    ($event.target as any).src = Settings.imageForWhenLoadingFails; // set to doc-url?
  }
  onProgress(progressData: PDFProgressData) {
    console.log(progressData);
    //this.setTimedMessage.emit([translate('PDF_ERROR'), 5]);
  }
  onError($event: any) {
    console.log('PDF-viewer error: ', $event);
    //this.setTimedMessage.emit([translate('PDF_ERROR'), 5]);
  }
}
