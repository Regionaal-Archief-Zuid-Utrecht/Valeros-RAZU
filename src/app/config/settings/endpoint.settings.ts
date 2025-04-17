import { EndpointsModel } from '../../models/endpoint.model';

export const endpointSettings: EndpointsModel = {
  razu: {
    label: 'Regionaal Archief Zuid-Utrecht',
    endpointUrls: [
      {
        elastic: 'https://ontwikkel.search.razu.nl/ldto-objects/_search',
        sparql: 'https://api.data.razu.nl/datasets/id/object/sparql',
      },
    ],
  },
};
