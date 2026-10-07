import { EndpointsModel } from '../endpoint.model';

export interface EndpointSettings {
  maxNumParallelRequests: number;
  data: EndpointsModel;
  pdfConversionUrl?: string;
  urlProcessor?: {
    url: string;
    matchSubstring: string;
  };
  urlRewrites?: { from: string; to: string }[];
  snippetServer?: string;
}
