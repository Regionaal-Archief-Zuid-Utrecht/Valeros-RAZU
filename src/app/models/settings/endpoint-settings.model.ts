import { EndpointsModel } from '../endpoint.model';

export interface EndpointSettingsModel {
  maxNumParallelRequests: number;
  data: EndpointsModel;
  pdfConversionUrl: string;
  urlProcessor?: {
    url: string;
    matchSubstring: string;
  };
}
