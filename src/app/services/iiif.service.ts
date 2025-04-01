import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { ApiService } from './api.service';
import { IIIFItem as IIIFItemData } from '../models/IIIF/iiif-item.model';
import {
  Manifest,
  Canvas,
  AnnotationPage,
  Annotation,
  ImageService,
} from '@iiif/presentation-3';
import { NodeModel } from '../models/node.model';
import { NodeService } from './node.service';
import { LabelsCacheService } from './cache/labels-cache.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class IIIFService {
  private _blobUrls: Set<string> = new Set();

  constructor(private sparql: SparqlService) {}

  private _getCanvasesFromUrls(imgUrls: string[]): Canvas[] {
    // TODO: Stop using example.org here, and properly retrieve the image dimensions etc
    const canvases: Canvas[] = imgUrls.map((url, index) => ({
      id: `https://example.org/canvas/p${index + 1}`,
      type: 'Canvas',
      height: 1800,
      width: 1200,
      items: [
        {
          id: `https://example.org/page/p${index + 1}/1`,
          type: 'AnnotationPage',
          items: [
            {
              id: `https://example.org/annotation/p${index + 1}-image`,
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: url,
                type: 'Image',
                format: 'image/jpeg',
                height: 1800,
                width: 1200,
              },
              target: `https://example.org/canvas/p${index + 1}`,
            },
          ],
        },
      ],
    }));

    return canvases;
  }

  private async _retrieveCanvasesUsingSparql(id: string): Promise<Canvas[]> {
    const itemsData: IIIFItemData[] = await this.sparql.getIIIFItemsData(id);

    const altoSample = '/assets/alto/b18035723_0006.JP2.xml';

    const canvases: Canvas[] = itemsData.map((itemData: IIIFItemData) => {
      const canvas: Canvas = {
        id: `https://data.razu.nl/iiif/canvas/${itemData.file}`,
        type: 'Canvas',
        height: itemData.height,
        width: itemData.width,
        items: [
          {
            id: `https://data.razu.nl/iiif/page/${itemData.file}/painting-annotation-page`,
            type: 'AnnotationPage',
            items: [
              {
                id: `https://data.razu.nl/iiif/annotation/${itemData.file}`,
                type: 'Annotation',
                motivation: 'painting',
                body: {
                  id: `${itemData.iiifService}/full/full/0/default.jpg`,
                  type: 'Image',
                  format: 'image/jpeg',
                },
                target: `https://data.razu.nl/iiif/canvas/${itemData.file}`,
              },
            ],
          },
        ],
        seeAlso: [
          {
            '@id': altoSample,
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml+alto',
            label: 'METS-ALTO XML',
          } as any,
        ],
        thumbnail: [
          {
            id: `${itemData.iiifService}/full/200,/0/default.jpg`,
            type: 'Image',
            format: 'image/jpeg',
            service: [
              {
                id: `${itemData.iiifService}`,
                type: 'ImageService2',
                profile: 'http://iiif.io/api/image/2/level2.json',
              },
            ],
          },
        ],
      };
      return canvas;
    });
    return canvases;
  }

  async generateCanvasesManifest(
    id: string,
    label: string,
    canvases: Canvas[],
  ): Promise<Manifest> {
    const manifest: Manifest = {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      id: id,
      type: 'Manifest',
      label: {
        nl: [label],
      },
      items: canvases,
    };

    return manifest;
  }

  async createManifestBlob(
    nodeId?: string,
    nodeLabel?: string,
    imageUrls?: string[],
  ) {
    let canvases: Canvas[] = [];
    if (imageUrls) {
      console.log('Creating manifest from image URLs', imageUrls);
      canvases = this._getCanvasesFromUrls(imageUrls);
    } else if (nodeId) {
      console.log('Creating manifest from node ID using SPARQL', nodeId);
      canvases = await this._retrieveCanvasesUsingSparql(nodeId);
    }

    const manifest: Manifest = await this.generateCanvasesManifest(
      nodeId ?? '',
      nodeLabel ?? '',
      canvases,
    );

    const manifestFile = new File([JSON.stringify(manifest)], 'manifest.json', {
      type: 'application/json',
    });
    const manifestUrl = URL.createObjectURL(manifestFile);
    this._blobUrls.add(manifestUrl);

    window.addEventListener('beforeunload', () => this._cleanup());

    return manifestUrl;
  }

  private _cleanup() {
    this._blobUrls.forEach((url) => URL.revokeObjectURL(url));
    this._blobUrls.clear();
  }
}
