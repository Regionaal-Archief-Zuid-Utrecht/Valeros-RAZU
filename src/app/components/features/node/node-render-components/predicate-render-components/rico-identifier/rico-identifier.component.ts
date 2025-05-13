import { Component, Input, OnInit } from '@angular/core';
import { wrapWithAngleBrackets } from '../../../../../../helpers/util.helper';
import { EndpointUrlsModel } from '../../../../../../models/endpoint.model';
import { ApiService } from '../../../../../../services/api.service';
import { EndpointService } from '../../../../../../services/endpoint.service';
import { SparqlService } from '../../../../../../services/sparql.service';
import { NodeLinkComponent } from '../../../node-link/node-link.component';

@Component({
  selector: 'app-rico-identifier',
  standalone: true,
  imports: [NodeLinkComponent],
  templateUrl: './rico-identifier.component.html',
  styleUrl: './rico-identifier.component.scss',
})
export class RicoIdentifierComponent implements OnInit {
  @Input() id?: string;

  label?: string;

  constructor(
    public api: ApiService,
    public sparql: SparqlService,
    private endpointService: EndpointService,
  ) {}

  ngOnInit(): void {
    void this.initLabel();
  }

  async initLabel() {
    if (!this.id) {
      return;
    }

    const prefixes = {
      rico: 'https://www.ica.org/standards/RiC/ontology#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    };
    const endpointUrls: EndpointUrlsModel[] | null =
      this.endpointService.getEndpointUrls('hua');
    if (!endpointUrls) {
      return;
    }

    const queryTemplate = `
    ${wrapWithAngleBrackets(this.id)} <${prefixes.rico}hasIdentifierType>/<${prefixes.rdfs}label> ?typeLabel ; <${prefixes.rico}textualValue> ?value .`;

    // TODO: Add type
    const query = `
SELECT distinct ?typeLabel ?value WHERE {
${this.sparql.getFederatedQuery(queryTemplate, endpointUrls)}
} LIMIT 1`;

    // TODO: Add type
    const response = await this.api.postData<
      { typeLabel: string; value: string }[]
    >(endpointUrls[0].sparql, {
      query: query,
    });
    if (!response || response.length === 0) {
      return;
    }

    this.label = `${response[0].typeLabel} ${response[0].value}`;
  }
}
