import { Component, Input, OnInit, inject } from '@angular/core';
import { humanFileSize } from '../../../../../helpers/util.helper';
import { Direction, NodeModel } from '../../../../../models/node.model';
import { TypeRenderComponentInput } from '../../../../../models/type-render-component-input.model';
import { NodeService } from '../../../../../services/node/node.service';
import { SparqlService } from '../../../../../services/sparql.service';

/**
 * Component for handling downloads of representation files
 */
@Component({
  selector: 'app-razu-aflevering-download',
  imports: [],
  templateUrl: './razu-aflevering-download.component.html',
  standalone: true,
})
export class RazuAfleveringDownloadComponent implements OnInit {
  private readonly sparqlService = inject(SparqlService);
  private readonly nodeService = inject(NodeService);

  @Input() data?: TypeRenderComponentInput;
  isLoaded = false;

  private readonly imageUrlMap = new Map<string, string[]>();
  private readonly pageNumberMap = new Map<string, string>();
  private readonly fileSizeMap = new Map<string, string>();

  ngOnInit(): void {}

  onDownloadSectionToggle(event: Event): void {
    const isExpanded = (event.target as HTMLDetailsElement)?.open;
    if (isExpanded) {
      void this.loadRepresentationMetadata();
    }
  }

  getRepresentationIds(): string[] {
    const representationIds = this.nodeService.getObjValues(
      this.data?.node,
      ['https://data.razu.nl/def/ldto/isRepresentatieVan'],
      Direction.Incoming,
    );
    return representationIds;
  }

  getImageUrls(representationId: string): string[] {
    return representationId ? this.imageUrlMap.get(representationId) || [] : [];
  }

  getFirstImageUrl(representationId: string): string {
    return this.getImageUrls(representationId)[0] || '';
  }

  getPageNumber(representationId: string): number | undefined {
    if (!representationId) return undefined;
    const pageNumber = this.pageNumberMap.get(representationId);
    const numericValue = Number(pageNumber);
    return Number.isFinite(numericValue) ? numericValue : undefined;
  }

  getFileSize(representationId: string): string {
    return this.fileSizeMap.get(representationId) || '';
  }

  private async loadRepresentationMetadata(): Promise<void> {
    if (this.isLoaded) return;

    const representationIds = this.getRepresentationIds();
    if (!representationIds.length) return;

    try {
      await this._fetchAndProcessRepresentations(representationIds);
    } finally {
      this.isLoaded = true;
    }
  }

  private async _fetchAndProcessRepresentations(
    representationIds: string[],
  ): Promise<void> {
    await Promise.all(
      representationIds.map(async (representationId: string) => {
        const node: NodeModel =
          await this.sparqlService.getNode(representationId);
        this._processRepresentationNode(representationId, node);
      }),
    );
  }

  private _processRepresentationNode(
    representationId: string,
    node: NodeModel,
  ): void {
    this._extractAndStoreImageUrls(representationId, node);
    this._extractAndStorePageNumber(representationId, node);
    this._extractAndStoreFileSize(representationId, node);
  }

  private _extractAndStoreImageUrls(
    representationId: string,
    node: NodeModel,
  ): void {
    let imageUrls: string[] = this.nodeService
      .getObjValues(node, ['https://data.razu.nl/def/ldto/URLBestand'])
      .filter((url) => this._isValidImageUrl(url));

    if (imageUrls.length > 0) {
      this.imageUrlMap.set(representationId, imageUrls);
    }
  }

  private _extractAndStorePageNumber(
    representationId: string,
    node: NodeModel,
  ): void {
    const positionObjects: string[] = this.nodeService.getObjValues(node, [
      'http://schema.org/position',
    ]);
    if (positionObjects[0]) {
      this.pageNumberMap.set(representationId, positionObjects[0]);
    }
  }

  private _extractAndStoreFileSize(
    representationId: string,
    node: NodeModel,
  ): void {
    const sizeObjects: string[] = this.nodeService.getObjValues(node, [
      'https://data.razu.nl/def/ldto/omvang',
    ]);
    if (sizeObjects[0]) {
      const numericValue = Number(sizeObjects[0]);
      const fileSize = humanFileSize(
        Number.isFinite(numericValue) ? numericValue : 0,
      );
      this.fileSizeMap.set(representationId, fileSize);
    }
  }

  private _isValidImageUrl(url?: string): boolean {
    if (!url) return false;
    const lowercasedUrl = url.toLowerCase();
    return /(\.jpg|\.jpeg|\.png|\.gif|\.tiff?|\.webp|\.bmp)(\?.*)?$/.test(
      lowercasedUrl,
    );
  }
}
