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
import { NgClass } from '@angular/common';
// @ts-ignore
import Mirador from 'mirador/dist/es/src/index';
import { IIIFService } from '../../services/iiif.service';

@Component({
  selector: 'app-mirador',
  standalone: true,
  templateUrl: './mirador.component.html',
  styleUrl: './mirador.component.scss',
})
export class MiradorComponent implements OnChanges, OnDestroy, AfterViewInit {
  private _viewer?: any;

  @Input() imageUrls?: string[];

  constructor(
    private ngZone: NgZone,
    private iiifService: IIIFService,
  ) {}

  ngAfterViewInit() {
    this.initViewer(this.imageUrls);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrls']) {
      this.initViewer(this.imageUrls);
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

  private initViewer(imgUrls: string[] | undefined) {
    if (!imgUrls || imgUrls.length === 0) {
      return;
    }

    this.destroyViewer();

    this._viewer = this.ngZone.runOutsideAngular(async () => {
      const manifestUrl = await this.iiifService.createManifestBlob(imgUrls);
      const containerId = 'mirador';
      const containerElem = document.getElementById(containerId);
      if (!containerElem) {
        console.warn('Container element not found', containerId);
        return;
      }

      return Mirador.viewer({
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
    });
  }
}
