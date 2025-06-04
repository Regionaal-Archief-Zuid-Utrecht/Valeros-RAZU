import { EndpointsModel } from '../endpoint.model';

export interface EndpointSettings {
  maxNumParallelRequests: number;
  data: EndpointsModel;
  pdfConversionUrl?: string;
  urlProcessor?: {
    url: string;
    matchSubstring: string;
  };
}
