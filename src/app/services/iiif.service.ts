import { Injectable } from '@angular/core';
import { Canvas, Manifest } from '@iiif/presentation-3';
import { Settings } from '../config/settings';
import { IIIFItem } from '../models/IIIF/iiif-item.model';
import { SparqlService } from './sparql.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class IIIFService {
  private _blobUrls: Set<string> = new Set();

  constructor(
    private sparql: SparqlService,
    private url: UrlService,
  ) {}

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

  private _selectPreferredImageFormats(
    items: IIIFItem[],
    preferredFormats: string[],
  ): IIIFItem[] {
    // Group items by position
    const itemsByPosition = items.reduce(
      (acc, item) => {
        const position = item.position;
        if (!acc[position]) {
          acc[position] = [];
        }
        acc[position].push(item);
        return acc;
      },
      {} as { [key: string]: IIIFItem[] },
    );

    // For each position, try formats in order of preference
    return Object.values(itemsByPosition)
      .map((items) => {
        if (items.length === 1) {
          // If only one item and its format is in preferred list, return it
          return preferredFormats.includes(items[0].format) ? items[0] : null;
        }

        // Try each preferred format in order
        for (const format of preferredFormats) {
          const matchingItem = items.find((i) => i.format === format);
          if (matchingItem) {
            return matchingItem;
          }
        }

        // No matching format found
        return null;
      })
      .filter((item): item is IIIFItem => item !== null);
  }

  private async _retrieveCanvasesUsingSparql(id: string): Promise<Canvas[]> {
    let itemsData: IIIFItem[] = await this.sparql.getIIIFItemsData(id);

    itemsData = this._selectPreferredImageFormats(
      itemsData,
      Settings.iiif.preferredImageFormats,
    );

    const processAltoUrl = async (item: IIIFItem) => {
      if (item.altoUrl) {
        item.altoUrl = await this.url.processUrl(item.altoUrl);
      }
      return item;
    };
    itemsData = await Promise.all(
      itemsData.map(async (item) => await processAltoUrl(item)),
    );

    const canvases: Canvas[] = itemsData.map((item) => {
      const canvas: Canvas = {
        id: `https://data.razu.nl/iiif/canvas/${item.file}`,
        type: 'Canvas',
        height: item.height,
        width: item.width,
        items: [
          {
            id: `https://data.razu.nl/iiif/page/${item.file}/painting-annotation-page`,
            type: 'AnnotationPage',
            items: [
              {
                id: `https://data.razu.nl/iiif/annotation/${item.file}`,
                type: 'Annotation',
                motivation: 'painting',
                body: {
                  id: `${item.iiifService}/full/${item.width},/0/default.jpg`,
                  type: 'Image',
                  format: 'image/jpeg',
                },
                target: `https://data.razu.nl/iiif/canvas/${item.file}`,
              },
            ],
          },
        ],
        seeAlso: item.altoUrl
          ? [
              {
                '@id': item.altoUrl,
                profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
                format: 'text/xml+alto',
                label: 'METS-ALTO XML',
              } as any,
            ]
          : [],
        thumbnail: [
          {
            id: `${item.iiifService}/full/200,/0/default.jpg`,
            type: 'Image',
            format: 'image/jpeg',
            service: [
              {
                id: `${item.iiifService}`,
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
      requiredStatement: {
        label: {
          en: [''],
        },
        value: {
          en: [''],
        },
      },
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
    console.log('Created manifest:', manifest);

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
