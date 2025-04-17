import { IIIFSettings } from '../../models/settings/iiif-settings.model';

export const iiifSettings: IIIFSettings = {
  fileFormats: {
    jpg: 'https://data.razu.nl/id/bestandsformaat/9e03fffdb1f119a3a36a76d19c610218',
    tif: 'https://data.razu.nl/id/bestandsformaat/52410efcd26ac40a20810e62984b87a1',
    alto: 'https://data.razu.nl/id/bestandsformaat/63e8775df9a69fa0aadbb461fafe4c1e',
  },
  preferredImageFormats: [
    'https://data.razu.nl/id/bestandsformaat/9e03fffdb1f119a3a36a76d19c610218', // JPG
    'https://data.razu.nl/id/bestandsformaat/52410efcd26ac40a20810e62984b87a1', // TIF
  ], // Preferred formats for IIIF, only one is chosen, processed in order
};
