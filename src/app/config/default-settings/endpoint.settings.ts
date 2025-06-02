import { EndpointSettings } from '../../models/settings/endpoint-settings.model';

export const endpointSettings: EndpointSettings = {
  maxNumParallelRequests: 4, // 4 SPARQL workers max for Triply
  data: {},
};
