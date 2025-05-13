import { IIIFSettings } from '../../models/settings/iiif-settings.model';

export const iiifSettings: IIIFSettings = {
  fileFormats: {
    jpg: [
      'https://data.razu.nl/id/bestandsformaat/127b5ecb9c9f8ff3b43d69ba014e4f6d',
      'https://data.razu.nl/id/bestandsformaat/159f7f525dd2df49645de2b16beeb731',
      'https://data.razu.nl/id/bestandsformaat/9e03fffdb1f119a3a36a76d19c610218',
    ],
    tif: [
      'https://data.razu.nl/id/bestandsformaat/73f62e441010a9dca6ed8c46f9f4e331',
      'https://data.razu.nl/id/bestandsformaat/52410efcd26ac40a20810e62984b87a1',
    ],
    alto: [
      'https://data.razu.nl/id/bestandsformaat/63e8775df9a69fa0aadbb461fafe4c1e',
    ],
  },
  preferredImageFormats: [
    'https://data.razu.nl/id/bestandsformaat/127b5ecb9c9f8ff3b43d69ba014e4f6d', // JPG
    'https://data.razu.nl/id/bestandsformaat/159f7f525dd2df49645de2b16beeb731', // JPG
    'https://data.razu.nl/id/bestandsformaat/9e03fffdb1f119a3a36a76d19c610218', // JPG

    'https://data.razu.nl/id/bestandsformaat/73f62e441010a9dca6ed8c46f9f4e331', // TIF
    'https://data.razu.nl/id/bestandsformaat/52410efcd26ac40a20810e62984b87a1', // TIF
  ], // Preferred formats for IIIF, only one is chosen, processed in order
};
