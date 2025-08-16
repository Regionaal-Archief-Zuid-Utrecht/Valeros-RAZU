import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EndpointService } from '../../../../services/endpoint.service';
import { NodeLinkComponent } from '../node-link/node-link.component';

@Component({
  selector: 'app-node-endpoint',
  imports: [NgIf, NodeLinkComponent],
  templateUrl: './node-endpoint.component.html',
  styleUrl: './node-endpoint.component.css'
})
export class NodeEndpointComponent {
  @Input() endpointId?: string;

  constructor(public endpoints: EndpointService) { }
}
