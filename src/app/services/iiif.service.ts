import { Injectable } from '@angular/core';
import { Canvas, Manifest } from '@iiif/presentation-3';
import mime from 'mime';
import { Settings } from '../config/settings';
import { IIIFItem } from '../models/IIIF/iiif-item.model';
import { ImageService } from './image.service';
import { SparqlService } from './sparql.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class IIIFService {
  private _blobUrls: Set<string> = new Set();

  public replaceIiifWithDevIiif(url: string): string {
    return url.replace('iiif.razu', 'dev.iiif.razu');
  }

  constructor(
    private sparql: SparqlService,
    private url: UrlService,
    private imageService: ImageService,
  ) {}

  private async _getCanvasesFromUrls(imgUrls: string[]): Promise<Canvas[]> {
    // imgUrls = [
    //   'https://placehold.co/600x400/png',
    //   'https://placehold.co/500x400/jpg',
    //   'https://placehold.co/400x400/gif',
    //   'https://www.dummyimg.in/placeholder?format=BMP',
    //   'https://placehold.co/300x400/svg',
    //   'https://placehold.co/200x400/webp',
    // ];

    const makeCanvas = (
      url: string,
      index: number,
      width: number,
      height: number,
    ): Canvas => ({
      id: `https://example.org/canvas/p${index + 1}`,
      type: 'Canvas',
      label: {
        en: [(index + 1).toString()],
      },
      height,
      width,
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
                format: mime.getType(url) ?? 'image/jpeg',
                height,
                width,
              },
              target: `https://example.org/canvas/p${index + 1}`,
            },
          ],
        },
      ],
    });

    const canvases: Canvas[] = [];
    for (let [index, url] of imgUrls.entries()) {
      try {
        const { width, height } =
          await this.imageService.getImageDimensions(url);
        canvases.push(makeCanvas(url, index, width, height));
      } catch (e) {
        console.error(`Failed to get dimensions for image ${url} :`, e);
      }
    }
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
        label: { en: [item.position.toString()] },
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
                  id: `${this.replaceIiifWithDevIiif(item.iiifService)}/full/${item.width},/0/default.jpg`,
                  type: 'Image',
                  format: 'image/jpeg',
                  service: [
                    {
                      id: `${this.replaceIiifWithDevIiif(item.iiifService)}`,
                      type: 'ImageService2',
                      profile: 'http://iiif.io/api/image/2/level2.json',
                    },
                  ],
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
            id: `${this.replaceIiifWithDevIiif(item.iiifService)}/full/200,/0/default.jpg`,
            type: 'Image',
            format: 'image/jpeg',
            service: [
              {
                id: `${this.replaceIiifWithDevIiif(item.iiifService)}`,
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
    const copyrightNotice: string | null =
      await this.sparql.getCopyrightNotice(id);

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
          en: ['Copyright'],
        },
        value: {
          en: [copyrightNotice ?? ''],
        },
      },
    };

    return manifest;
  }

  async createManifestBlob(
    nodeId?: string,
    nodeLabel?: string,
    imageUrls?: string[],
  ): Promise<string | null> {
    let canvases: Canvas[] = [];
    if (imageUrls) {
      console.log('Creating manifest from image URLs', imageUrls);
      canvases = await this._getCanvasesFromUrls(imageUrls);
    } else if (nodeId) {
      console.log('Creating manifest from node ID using SPARQL', nodeId);
      canvases = await this._retrieveCanvasesUsingSparql(nodeId);
    }

    if (!canvases || canvases.length === 0) {
      return null;
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
