import { EndpointSettings } from '../../../models/settings/endpoint-settings.model';
import { endpointSettings } from '../../default-settings/settings/endpoint.settings';

export const triplyEndpointSettings: EndpointSettings = {
  ...endpointSettings,
  data: {
    pokemon: {
      label: 'Triply',
      endpointUrls: [
        {
          elastic:
            'https://triplydb.com/_api/datasets/academy/pokemon/services/search/_search',
          sparql: 'https://api.triplydb.com/datasets/academy/pokemon/sparql',
        },
      ],
    },
  },
};
