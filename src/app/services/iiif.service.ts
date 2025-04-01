import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IIIFService {
  private _blobUrls: Set<string> = new Set();

  constructor() {}

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
    const newspaperManifestSample = {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      id: 'https://k3.digitopia.nl/manifest/razu_manifest_4c.json',
      type: 'Manifest',
      label: {
        nl: ['De Amerongsche Courant, jaarg. 4, nr. 183 (1878-04-04)'],
      },
      items: [
        {
          id: 'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-1',
          type: 'Canvas',
          height: 4659,
          width: 3364,
          items: [
            {
              id: 'https://data.razu.nl/iiif/page/NL-WbDRAZU-K50907905-689-1/painting-annotation-page',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://data.razu.nl/iiif/annotation/NL-WbDRAZU-K50907905-689-1',
                  type: 'Annotation',
                  motivation: 'painting',
                  body: {
                    id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-2.tif/full/max/0/default.jpg',
                    type: 'Image',
                    format: 'image/jpeg',
                    service: [
                      {
                        id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-2.tif',
                        type: 'ImageService2',
                        profile: 'http://iiif.io/api/image/2/level2.json',
                      },
                    ],
                  },
                  target:
                    'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-1',
                },
              ],
            },
          ],
          annotations: [
            {
              id: 'https://data.razu.nl/iiif/page/NL-WbDRAZU-K50907905-689-1/supplementing-annotation-page',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://data.razu.nl/iiif/annotation/NL-WbDRAZU-K50907905-689-1-alto',
                  type: 'Annotation',
                  motivation: 'supplementing',
                  body: {
                    id: 'https://data.razu.nl/alto/NL-WbDRAZU-K50907905-689-3.alto.xml',
                    type: 'Dataset',
                    format: 'application/xml',
                    label: {
                      nl: ['ALTO XML'],
                    },
                  },
                  target:
                    'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-1',
                },
              ],
            },
          ],
          thumbnail: [
            {
              id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-2.tif/full/200,/0/default.jpg',
              type: 'Image',
              format: 'image/jpeg',
              service: [
                {
                  id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-2.tif',
                  type: 'ImageService2',
                  profile: 'http://iiif.io/api/image/2/level2.json',
                },
              ],
            },
          ],
        },
        {
          id: 'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-2',
          type: 'Canvas',
          height: 4743,
          width: 3514,
          items: [
            {
              id: 'https://data.razu.nl/iiif/page/NL-WbDRAZU-K50907905-689-2/painting-annotation-page',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://data.razu.nl/iiif/annotation/NL-WbDRAZU-K50907905-689-2',
                  type: 'Annotation',
                  motivation: 'painting',
                  body: {
                    id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-5.tif/full/max/0/default.jpg',
                    type: 'Image',
                    format: 'image/jpeg',
                    service: [
                      {
                        id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-5.tif',
                        type: 'ImageService2',
                        profile: 'http://iiif.io/api/image/2/level2.json',
                      },
                    ],
                  },
                  target:
                    'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-2',
                },
              ],
            },
          ],
          annotations: [
            {
              id: 'https://data.razu.nl/iiif/page/NL-WbDRAZU-K50907905-689-2/supplementing-annotation-page',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://data.razu.nl/iiif/annotation/NL-WbDRAZU-K50907905-689-2-alto',
                  type: 'Annotation',
                  motivation: 'supplementing',
                  body: {
                    id: 'https://data.razu.nl/alto/NL-WbDRAZU-K50907905-689-6.alto.xml',
                    type: 'Dataset',
                    format: 'application/xml',
                    label: {
                      nl: ['ALTO XML'],
                    },
                  },
                  target:
                    'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-2',
                },
              ],
            },
          ],
          thumbnail: [
            {
              id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-5.tif/full/200,/0/default.jpg',
              type: 'Image',
              format: 'image/jpeg',
              service: [
                {
                  id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-5.tif',
                  type: 'ImageService2',
                  profile: 'http://iiif.io/api/image/2/level2.json',
                },
              ],
            },
          ],
        },
        {
          id: 'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-3',
          type: 'Canvas',
          height: 4741,
          width: 3434,
          items: [
            {
              id: 'https://data.razu.nl/iiif/page/NL-WbDRAZU-K50907905-689-3/painting-annotation-page',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://data.razu.nl/iiif/annotation/NL-WbDRAZU-K50907905-689-3',
                  type: 'Annotation',
                  motivation: 'painting',
                  body: {
                    id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-8.tif/full/max/0/default.jpg',
                    type: 'Image',
                    format: 'image/jpeg',
                    service: [
                      {
                        id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-8.tif',
                        type: 'ImageService2',
                        profile: 'http://iiif.io/api/image/2/level2.json',
                      },
                    ],
                  },
                  target:
                    'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-3',
                },
              ],
            },
          ],
          annotations: [
            {
              id: 'https://data.razu.nl/iiif/page/NL-WbDRAZU-K50907905-689-3/supplementing-annotation-page',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://data.razu.nl/iiif/annotation/NL-WbDRAZU-K50907905-689-3-alto',
                  type: 'Annotation',
                  motivation: 'supplementing',
                  body: {
                    id: 'https://data.razu.nl/alto/NL-WbDRAZU-K50907905-689-9.alto.xml',
                    type: 'Dataset',
                    format: 'application/xml',
                    label: {
                      nl: ['ALTO XML'],
                    },
                  },
                  target:
                    'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-3',
                },
              ],
            },
          ],
          thumbnail: [
            {
              id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-8.tif/full/200,/0/default.jpg',
              type: 'Image',
              format: 'image/jpeg',
              service: [
                {
                  id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-8.tif',
                  type: 'ImageService2',
                  profile: 'http://iiif.io/api/image/2/level2.json',
                },
              ],
            },
          ],
        },
        {
          id: 'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-4',
          type: 'Canvas',
          height: 4697,
          width: 3385,
          items: [
            {
              id: 'https://data.razu.nl/iiif/page/NL-WbDRAZU-K50907905-689-4/painting-annotation-page',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://data.razu.nl/iiif/annotation/NL-WbDRAZU-K50907905-689-4',
                  type: 'Annotation',
                  motivation: 'painting',
                  body: {
                    id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-11.tif/full/max/0/default.jpg',
                    type: 'Image',
                    format: 'image/jpeg',
                    service: [
                      {
                        id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-11.tif',
                        type: 'ImageService2',
                        profile: 'http://iiif.io/api/image/2/level2.json',
                      },
                    ],
                  },
                  target:
                    'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-4',
                },
              ],
            },
          ],
          annotations: [
            {
              id: 'https://data.razu.nl/iiif/page/NL-WbDRAZU-K50907905-689-4/supplementing-annotation-page',
              type: 'AnnotationPage',
              items: [
                {
                  id: 'https://data.razu.nl/iiif/annotation/NL-WbDRAZU-K50907905-689-4-alto',
                  type: 'Annotation',
                  motivation: 'supplementing',
                  body: {
                    id: 'https://data.razu.nl/alto/NL-WbDRAZU-K50907905-689-12.alto.xml',
                    type: 'Dataset',
                    format: 'application/xml',
                    label: {
                      nl: ['ALTO XML'],
                    },
                  },
                  target:
                    'https://data.razu.nl/iiif/canvas/NL-WbDRAZU-K50907905-689-4',
                },
              ],
            },
          ],
          thumbnail: [
            {
              id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-11.tif/full/200,/0/default.jpg',
              type: 'Image',
              format: 'image/jpeg',
              service: [
                {
                  id: 'https://dev.iiif.razu.nl/iiif/2/NL-WbDRAZU-K50907905-689-11.tif',
                  type: 'ImageService2',
                  profile: 'http://iiif.io/api/image/2/level2.json',
                },
              ],
            },
          ],
        },
      ],
    };
    return newspaperManifestSample;
  }

  createManifestBlob(imgUrls: string[]) {
    const manifest = this.generateManifest(imgUrls);
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
