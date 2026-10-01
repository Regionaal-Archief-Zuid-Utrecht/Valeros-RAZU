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
          elastic: 'http://localhost:9200/demo-kranten_m6/_search',
          sparql: 'http://localhost:7001',
        },
      ],
    },
  },
  pdfConversionUrl: 'http://localhost:5000/convert?url=',
  urlProcessor: {
    url: 'http://localhost:8001/process-url',
    matchSubstring: 'opslag.razu.nl',
  },
  snippetServer: 'http://localhost:8002/snippet',
};
