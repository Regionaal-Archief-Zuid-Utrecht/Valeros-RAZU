import { IIIFService } from '../../../services/iiif.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Config } from '../../../config/config';
import { UrlService } from '../../../services/url.service';
import { Settings } from '../../../config/settings';
// @ts-ignore
import Mirador from 'mirador/dist/es/src/index';
import { NodeLinkComponent } from "../node-link/node-link.component";

@Component({
  selector: 'app-node-images',
  standalone: true,
  imports: [NgForOf, NgIf, JsonPipe, NgClass, NodeLinkComponent],
  templateUrl: './node-images.component.html',
  styleUrl: './node-images.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NodeImagesComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  private _imageViewer?: any;

  @Input() imageUrls?: string[];
  @Input() shownInTableCell = true;
  @Input() useViewer = true;
  @Input() imageLabel?: string;

  processedImageUrls: string[] = [];

  constructor(
    public urlService: UrlService,
    private ngZone: NgZone,
    private iiifService: IIIFService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  destroyImageViewer() {
    if (this._imageViewer) {
      this._imageViewer = undefined;
    }
  }

  initImageViewer(imgUrls: string[] | undefined) {
    if (!this.useViewer) {
      return;
    }
    if (!imgUrls || imgUrls.length === 0) {
      return;
    }

    this.destroyImageViewer();

    this._imageViewer = this.ngZone.runOutsideAngular(() => {
      const manifestUrl = this.iiifService.createManifestBlob(imgUrls);
      console.log('Manifest URL', manifestUrl);

      const miradorInstance = Mirador.viewer({
        id: 'mirador',
        workspace: {
          type: 'single',
          showZoomControls: true,
        },
        workspaceControlPanel: {
          enabled: false,
        },
        windows: [
          {
            manifestId: manifestUrl,
            allowWindowSideBar: true,
            sideBarOpenByDefault: false,
            allowMaximize: false,
            allowFullscreen: true,
            allowClose: false,
          },
        ],
      });

      // Center image after load
      miradorInstance.store.subscribe(() => {
        const state = miradorInstance.store.getState();
        const windows = state.windows || {};
        const windowIds = Object.keys(windows);

        if (windowIds.length > 0) {
          const windowId = windowIds[0];
          const canvasId = windows[windowId]?.canvasId;

          if (canvasId && state.viewers?.[windowId]?.viewer) {
            const viewer = state.viewers[windowId].viewer;
            if (viewer && !viewer.__centered) {
              viewer.viewport.goHome();
              viewer.__centered = true;
            }
          }
        }
      });

      return miradorInstance;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrls']) {
      this._processImageUrls().then(() => {
        this.initImageViewer(this.processedImageUrls);
      });
    }
  }

  private async _processImageUrls() {
    if (!this.imageUrls) {
      return;
    }
    this.processedImageUrls = await this.urlService.processUrls(
      this.imageUrls,
      false,
    );
  }

  ngOnDestroy() {
    this.destroyImageViewer();
  }

  onImageLoadError($event: ErrorEvent) {
    ($event.target as any).src = Settings.imageForWhenLoadingFails;
  }

  protected readonly Config = Config;
}
