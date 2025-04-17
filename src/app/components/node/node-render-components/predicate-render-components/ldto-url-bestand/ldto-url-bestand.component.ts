import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  intersects,
  wrapWithAngleBrackets,
} from '../../../../../helpers/util.helper';
import { ApiService } from '../../../../../services/api.service';
import { EndpointService } from '../../../../../services/endpoint.service';
import { SparqlService } from '../../../../../services/sparql.service';
import { NodeImagesComponent } from '../../../node-images/node-images.component';
import { NodeLinkComponent } from '../../../node-link/node-link.component';

@Component({
  selector: 'app-ldto-url-bestand',
  standalone: true,
  imports: [NodeLinkComponent, NodeImagesComponent, NgIf],
  templateUrl: './ldto-url-bestand.component.html',
  styleUrl: './ldto-url-bestand.component.scss',
})
export class LdtoUrlBestandComponent implements OnInit {
  @Input() nodeId?: string;
  @Input() fileUrl?: string;
  fileFormats?: string[];

  // TODO: Add complete list here
  imgFileFormats: string[] = ['fmt/44', 'fmt/645'];

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
${wrapWithAngleBrackets(this.nodeId)} <https://data.razu.nl/def/ldto/bestandsformaat> ?b .
?b <http://schema.org/identifier> ?bestandsformaat .`;

    const razuUrls = this.endpoints.getEndpointUrls('razu');
    if (!razuUrls) {
      return;
    }

    const query = `
  SELECT ?bestandsformaat WHERE {
      ${this.sparql.getFederatedQuery(queryTemplate, razuUrls)}
    } LIMIT 100`;

    const response = await this.api.postData<{ bestandsformaat: string }[]>(
      razuUrls[0].sparql,
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
