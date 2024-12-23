import { Component, Input, OnInit } from '@angular/core';
import { SparqlService } from '../../../../../services/sparql.service';
import {
  intersects,
  wrapWithAngleBrackets,
} from '../../../../../helpers/util.helper';
import { ApiService } from '../../../../../services/api.service';
import { Settings } from '../../../../../config/settings';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { NodeImagesComponent } from '../../../node-images/node-images.component';
import { NgIf } from '@angular/common';
import {
  EndpointModel,
  EndpointUrlsModel,
} from '../../../../../models/endpoint.model';
import { EndpointService } from '../../../../../services/endpoint.service';

@Component({
  selector: 'app-mdto-url-bestand',
  standalone: true,
  imports: [NodeLinkComponent, NodeImagesComponent, NgIf],
  templateUrl: './mdto-url-bestand.component.html',
  styleUrl: './mdto-url-bestand.component.scss',
})
export class MdtoUrlBestandComponent implements OnInit {
  @Input() nodeId?: string;
  @Input() fileUrl?: string;
  fileFormats?: string[];

  // TODO: Add complete list here
  imgFileFormats: string[] = ['fmt/44'];

  constructor(
    public api: ApiService,
    public sparql: SparqlService,
    public endpoints: EndpointService,
  ) {}

  ngOnInit() {
    void this.initFileFormat();
  }

  async initFileFormat() {
    if (!this.nodeId) {
      return;
    }

    const queryTemplate = `
${wrapWithAngleBrackets(this.nodeId)} <http://www.nationaalarchief.nl/mdto#bestandsformaat> ?b .
?b <http://schema.org/identifier> ?bestandsformaat .`;

    const endpointUrls: EndpointUrlsModel[] =
      this.endpoints.getAllEnabledUrls();

    const query = `
  SELECT ?bestandsformaat WHERE {
    ${this.sparql.getFederatedQuery(queryTemplate, endpointUrls)}
  } LIMIT 100`;

    const response = await this.api.postData<{ bestandsformaat: string }[]>(
      Settings.endpoints.razu.endpointUrls[0].sparql,
      {
        query: query,
      },
    );
    if (!response) {
      return;
    }
    this.fileFormats = response.map((r) => r.bestandsformaat);
  }

  get isImage(): boolean {
    if (!this.fileFormats) {
      return false;
    }
    return intersects(this.imgFileFormats, this.fileFormats);
  }
}
