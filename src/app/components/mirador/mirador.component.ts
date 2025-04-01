import {
  AfterViewInit,
  Component,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
// @ts-ignore
import Mirador from 'mirador/dist/es/src/index';
// @ts-ignore
import textOverlayPlugin from 'mirador-textoverlay/es/index';
import { IIIFService } from '../../services/iiif.service';
import { NodeModel } from '../../models/node.model';

@Component({
  selector: 'app-mirador',
  standalone: true,
  imports: [],
  templateUrl: './mirador.component.html',
  styleUrl: './mirador.component.scss',
})
export class MiradorComponent implements OnChanges, OnDestroy, AfterViewInit {
  private _viewer?: any;

  @Input() nodeId?: string;
  @Input() nodeLabel?: string;
  @Input() imageUrls?: string[];

  constructor(
    private ngZone: NgZone,
    private iiifService: IIIFService,
  ) {}

  ngAfterViewInit() {
    this.initViewer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrls'] || changes['nodeId'] || changes['nodeLabel']) {
      console.log('Changes detected, reinitializing viewer', changes);
      this.initViewer();
    }
  }

  ngOnDestroy() {
    this.destroyViewer();
  }

  private destroyViewer() {
    if (this._viewer) {
      this._viewer = undefined;
    }
  }

  private initCenterImageAfterLoad(miradorInstance: any) {
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
  }

  private initViewer() {
    this.destroyViewer();

    this._viewer = this.ngZone.runOutsideAngular(async () => {
      const manifestUrl = await this.iiifService.createManifestBlob(
        this.nodeId,
        this.nodeLabel,
        this.imageUrls,
      );
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
            selectable: true,
            visible: false,
          },
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
      };

      const miradorInstance = Mirador.viewer(config, [...textOverlayPlugin]);
      this.initCenterImageAfterLoad(miradorInstance);

      return miradorInstance;
    });
  }
}
