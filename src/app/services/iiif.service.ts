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

@Injectable({
  providedIn: 'root',
})
export class IIIFService {
  private _blobUrls: Set<string> = new Set();

  constructor(private sparql: SparqlService) {}

  generateManifest(imgUrls: string[]) {
    const imageManifestSample = {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      id: 'https://example.org/manifest.json',
      type: 'Manifest',
      label: { en: ['Image Collection'] },
      items: imgUrls.map((url, index) => ({
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
      })),
    };

    return imageManifestSample;
  }

  private async _retrieveCanvasesUsingSparql(id: string): Promise<Canvas[]> {
    const itemsData: IIIFItemData[] = await this.sparql.getIIIFItemsData(id);
    // TODO: Add annotations
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

  async generateCanvasesManifest(canvases: Canvas[]): Promise<Manifest> {
    // TODO: Add ID and label
    const manifest: Manifest = {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      id: 'TODO',
      type: 'Manifest',
      label: {
        nl: ['TODO'],
      },
      items: canvases,
    };

    return manifest;
  }

  async createManifestBlob(imgUrls: string[]) {
    // const manifest = this.generateManifest(imgUrls);
    const canvases: Canvas[] = await this._retrieveCanvasesUsingSparql(
      'https://data.razu.nl/id/object/NL-WbDRAZU-K50907905-689-26',
    );
    const manifest: Manifest = await this.generateCanvasesManifest(canvases);

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
