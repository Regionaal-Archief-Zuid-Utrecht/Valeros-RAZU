import { EndpointSettings } from '../../../../models/settings/endpoint-settings.model';
import { endpointSettings } from '../../../default-settings/settings/endpoint.settings';

export const razuEndpointSettings: EndpointSettings = {
  ...endpointSettings,
  data: {
    razu: {
      label: 'Regionaal Archief Zuid-Utrecht',
      endpointUrls: [
        {
          elastic: 'https://search.razu.nl/ldto-objects/_search',
          sparql: 'https://api.data.razu.nl/datasets/id/object/sparql',
        },
      ],
    },
  },
  pdfConversionUrl: 'https://viewer.razu.nl/gotenberg/convert?url=',
  urlProcessor: {
    url: 'https://viewer.razu.nl/sura/process-url', // Used for token generation, see https://github.com/Regionaal-Archief-Zuid-Utrecht/SURA
    matchSubstring: 'opslag.razu.nl',
  },
};
