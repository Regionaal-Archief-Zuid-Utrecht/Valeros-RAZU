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
// prettier-ignore
// @ts-ignore
import { getCanvasIndex,getCurrentCanvas } from 'mirador/dist/es/src/state/selectors';
// @ts-ignore
import textOverlayPlugin from 'mirador-textoverlay/es/index';
import { BehaviorSubject } from 'rxjs';
import { IIIFService } from '../../../../services/iiif.service';
import { MiradorHighlightService } from '../../../../services/mirador-highlight.service';
import { UrlService } from '../../../../services/url.service';

@Component({
  selector: 'app-mirador',
  imports: [],
  templateUrl: './mirador.component.html',
  styleUrl: './mirador.component.scss',
})
export class MiradorComponent implements OnChanges, OnDestroy, AfterViewInit {
  viewer?: any;
  private _initializeDebounceTimer?: number;
  containerId: string = '';

  private _canvasIndex: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);

  @Input() nodeId?: string;
  @Input() nodeLabel?: string;
  @Input() imageUrls?: string[];

  constructor(
    private ngZone: NgZone,
    private iiifService: IIIFService,
    private router: Router,
    private urlService: UrlService,
    private miradorHighlight: MiradorHighlightService,
  ) {
    this._canvasIndex.subscribe((canvasIndex: number | null) => {
      console.log('Canvas index:', canvasIndex);
    });
  }

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
        console.log('Initializing Mirador after changes', changes);
        this.initViewer();
        this._initializeDebounceTimer = undefined;
      }, 500);
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

    if (this.viewer) {
      this.viewer.unmount();
      this.viewer = undefined;
    }

    const styleElements = document.querySelectorAll('style[data-jss]');
    styleElements.forEach((styleElement) => {
      styleElement.remove();
    });

    const containerElem = document.getElementById(this.containerId);
    if (containerElem) {
      containerElem.innerHTML = '';
    }
  }

  private async initViewer() {
    this.destroyViewer();

    this.containerId = `mirador-${Math.random().toString(36).substr(2, 9)}`;

    const pageNum = this.urlService.getPageNumberFromUrl();

    this.viewer = await this.ngZone.runOutsideAngular(async () => {
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
      const containerElem = document.getElementById(this.containerId);
      if (!containerElem) {
        console.warn('Container element not found', this.containerId);
        return;
      }

      const config = {
        id: this.containerId,
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
            selectable: true,
            visible: false,
            // opacity: 0,
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
                  thumbnailNavigationPosition: 'far-right',
                  thumbnailNavigationVisible: true,
                }
              : {}),
          },
        ],
      };

      console.log('Mirador init', this.containerId);
      const miradorInstance = Mirador.viewer(config, [...textOverlayPlugin]);
      this.initCanvasIndexTracking(miradorInstance);

      return miradorInstance;
    });

    console.log('Mirador viewer', this.viewer);
    this.miradorHighlight.init();
  }

  initCanvasIndexTracking(miradorInstance: any) {
    const store = miradorInstance.store;
    const originalDispatch = store.dispatch;

    store.dispatch = (action: any) => {
      // TODO: Only check for canvas change for setCanvas calls, now checks for canvas change for all actions
      const result = originalDispatch(action);
      const currentState = store.getState();

      const windows = currentState.windows || {};
      const windowId = Object.keys(windows)[0];

      const currentCanvas = getCurrentCanvas(currentState, {
        windowId,
      });
      const canvasId = currentCanvas?.id;
      if (canvasId) {
        const canvasIndex = getCanvasIndex(currentState, {
          windowId,
          canvasId,
        });
        const canvasIsUpdated = canvasIndex !== this._canvasIndex.value;
        if (canvasIsUpdated) {
          this._canvasIndex.next(canvasIndex);
        }
      }

      return result;
    };
  }
}
