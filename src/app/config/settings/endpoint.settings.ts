import { EndpointSettings } from '../../models/settings/endpoint-settings.model';

export const endpointSettings: EndpointSettings = {
  maxNumParallelRequests: 4, // 4 SPARQL workers max for Triply
  data: {
    razu: {
      label: 'Regionaal Archief Zuid-Utrecht',
      endpointUrls: [
        {
          elastic: 'https://ontwikkel.search.razu.nl/ldto-objects/_search',
          sparql: 'https://api.data.razu.nl/datasets/id/object/sparql',
        },
      ],
    },
  },
  pdfConversionUrl: 'https://ontwikkel.viewer.razu.nl/gotenberg/convert?url=',
  urlProcessor: {
    url: 'https://ontwikkel.viewer.razu.nl/sura/process-url', // Used for token generation, see https://github.com/Regionaal-Archief-Zuid-Utrecht/SURA
    matchSubstring: 'opslag.razu.nl',
  },
};
