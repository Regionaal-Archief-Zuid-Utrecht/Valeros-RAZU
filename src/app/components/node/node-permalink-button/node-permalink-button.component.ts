import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NodeModel } from '../../../models/node.model';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { UrlService } from '../../../services/url.service';
import { NodeService } from '../../../services/node.service';
import { EndpointService } from '../../../services/endpoint.service';

@Component({
  selector: 'app-node-permalink-button',
  standalone: true,
  imports: [NgIcon, NgIf],
  templateUrl: './node-permalink-button.component.html',
  styleUrl: './node-permalink-button.component.scss',
})
export class NodePermalinkButtonComponent implements OnChanges {
  @Input() node: NodeModel | undefined;
  processedUrl: string = '';

  constructor(
    public urlService: UrlService,
    public nodes: NodeService,
    public endpoints: EndpointService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['node']) {
      this.processUrl();
    }
  }

  async processUrl() {
    if (!this.node) {
      return;
    }

    this.processedUrl = await this.urlService.processUrl(
      this.nodes.getId(this.node),
      false,
    );
  }

  get endpointName(): string {
    if (!this.node) {
      return '';
    }
    return (
      this.endpoints.getById(this.nodes.getEndpointId(this.node))?.label ??
      'Onbekend'
    );
  }
}
