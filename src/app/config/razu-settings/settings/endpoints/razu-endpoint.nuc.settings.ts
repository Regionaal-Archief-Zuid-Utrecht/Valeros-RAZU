import { EndpointSettings } from '../../../../models/settings/endpoint-settings.model';
import { endpointSettings } from '../../../default-settings/settings/endpoint.settings';

// Default endpoint settings for development, replaced (see angular.json) for different environments
export const razuEndpointSettings: EndpointSettings = {
  ...endpointSettings,
  data: {
    razu: {
      label: 'Regionaal Archief Zuid-Utrecht',
      endpointUrls: [
        {
          elastic: 'https://ontwikkel.search.razu.nl/ldto/_search',
          sparql: 'https://api.data.razu.nl/datasets/id/object/sparql',
        },
      ],
    },
  },
  pdfConversionUrl: 'http://linuc.local:5000/convert?url=',
  urlProcessor: {
    url: 'http://linuc.local:8001/process-url',
    matchSubstring: 'opslag.razu.nl',
  },
  snippetServer: 'http://linuc.local:8002',
};
