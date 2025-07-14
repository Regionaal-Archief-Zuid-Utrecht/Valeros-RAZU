import {
  AfterViewInit,
  Component,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
// @ts-ignore
import Mirador from 'mirador/dist/es/src/index';
// @ts-ignore
import textOverlayPlugin from 'mirador-textoverlay/es/index';
import { IIIFService } from '../../../../services/iiif.service';
import { MiradorHighlightService } from '../../../../services/mirador-highlight.service';

@Component({
  selector: 'app-mirador',
  standalone: true,
  imports: [],
  templateUrl: './mirador.component.html',
  styleUrl: './mirador.component.scss',
})
export class MiradorComponent implements OnChanges, OnDestroy, AfterViewInit {
  private _viewer?: any;
  private _initializeDebounceTimer?: number;

  @Input() nodeId?: string;
  @Input() nodeLabel?: string;
  @Input() imageUrls?: string[];

  constructor(
    private ngZone: NgZone,
    private iiifService: IIIFService,
    private router: Router,
    private miradorHighlight: MiradorHighlightService,
  ) {}

  ngAfterViewInit() {
    this.initViewer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrls'] || changes['nodeId'] || changes['nodeLabel']) {
      if (this._initializeDebounceTimer) {
        console.log('Cancelling previous initialization attempt');

        window.clearTimeout(this._initializeDebounceTimer);
      }

      this._initializeDebounceTimer = window.setTimeout(() => {
        console.log('Initializing viewer after changes', changes);
        this.initViewer();
        this._initializeDebounceTimer = undefined;
      }, 100);
    }
  }

  ngOnDestroy() {
    this.destroyViewer();
    this.miradorHighlight.stopCheckingForTextElementsInDOM();
  }

  private destroyViewer() {
    if (this._initializeDebounceTimer) {
      window.clearTimeout(this._initializeDebounceTimer);
      this._initializeDebounceTimer = undefined;
    }
    if (this._viewer) {
      this._viewer = undefined;
    }
  }

  private getPageFromUrl(): number | null {
    const urlSplitByHashtag = this.router.url.split('%23');
    const urlHasHashtag = urlSplitByHashtag.length > 1;
    if (urlHasHashtag) {
      const pageStr: string = urlSplitByHashtag[1];
      const pageNum = Number(pageStr);
      return !isNaN(pageNum) ? pageNum : null;
    }
    return null;
  }

  private initViewer() {
    this.destroyViewer();

    const pageNum = this.getPageFromUrl();

    this._viewer = this.ngZone.runOutsideAngular(async () => {
      const manifestUrl: string | null =
        await this.iiifService.createManifestBlob(
          this.nodeId,
          this.nodeLabel,
          this.imageUrls,
        );
      if (!manifestUrl) {
        console.warn('Failed to create manifest, not initializing viewer');
        return;
      }
      const containerId = 'mirador';
      const containerElem = document.getElementById(containerId);
      if (!containerElem) {
        console.warn('Container element not found', containerId);
        return;
      }

      const config = {
        id: 'mirador',
        workspace: {
          type: 'single',
          showZoomControls: true,
        },
        workspaceControlPanel: {
          enabled: false,
        },
        window: {
          textOverlay: {
            enabled: true,
            selectable: false,
            visible: false,
          },
        },
        windows: [
          {
            manifestId: manifestUrl,
            canvasIndex: pageNum ? pageNum - 1 : 0,
            allowWindowSideBar: true,
            sideBarOpenByDefault: false,
            allowMaximize: false,
            allowFullscreen: true,
            allowClose: false,
            ...(window.innerWidth >= 640
              ? {
                  thumbnailNavigationPosition: 'far-bottom',
                  thumbnailNavigationVisible: true,
                }
              : {}),
          },
        ],
      };

      const miradorInstance = Mirador.viewer(config, [...textOverlayPlugin]);
      return miradorInstance;
    });

    this.miradorHighlight.init();
  }
}
