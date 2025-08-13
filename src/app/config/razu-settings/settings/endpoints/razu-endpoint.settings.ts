import { EndpointSettings } from '../../../../models/settings/endpoint-settings.model';
import { endpointSettings } from '../../../default-settings/settings/endpoint.settings';

// Default endpoint settings for development, replaced (see angular.json) for different environments (test, acceptance, production)
export const razuEndpointSettings: EndpointSettings = {
  ...endpointSettings,
  data: {
    razu: {
      label: 'Regionaal Archief Zuid-Utrecht',
      endpointUrls: [
        // {
        //   elastic: 'https://ontwikkel.search.razu.nl/amerongsche-courant/_search',
        //   sparql: 'https://api.data.razu.nl/datasets/id/object/sparql',
        // // },
        // {
        //   elastic: 'https://huizenenmenseninwijk.nl/elasticsearch/picoext/_search',
        //   sparql: 'https://api.data.razu.nl/datasets/WietseBakker/mehiw/sparql',
        // },
        {
          elastic: 'https://huizenenmenseninwijk.nl/elasticsearch/picoext/_search',
          sparql: 'https://api.data.razu.nl/datasets/WietseBakker/mehiw/sparql',
        },
      ],
    },
  },
  pdfConversionUrl: 'https://ontwikkel.viewer.razu.nl/gotenberg/convert?url=',
  urlProcessor: {
    url: 'https://ontwikkel.viewer.razu.nl/sura/process-url', // Used for token generation, see https://github.com/Regionaal-Archief-Zuid-Utrecht/SURA
    matchSubstring: 'opslag.razu.nl',
  },
  proxyUrl: 'https://huizenenmenseninwijk.nl/cors-proxy',
};
