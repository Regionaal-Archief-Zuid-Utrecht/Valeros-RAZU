import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { featherArrowLeft } from '@ng-icons/feather-icons';
import { NodeModel } from '../../../models/node.model';
import { DetailsService } from '../../../services/details.service';
import { NodeService } from '../../../services/node/node.service';
import { RoutingService } from '../../../services/routing.service';
import { SparqlService } from '../../../services/sparql.service';
import { ScrollService } from '../../../services/ui/scroll.service';
import { NodeComponent } from '../../features/node/node.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NodeComponent, NgIf],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  nodeId: string | null = null;
  node?: NodeModel;

  loadingNodeData = false;

  constructor(
    private route: ActivatedRoute,
    public nodes: NodeService,
    public sparql: SparqlService,
    public routing: RoutingService,
    public details: DetailsService,
    public scroll: ScrollService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let nodeId = params.get('id');
      if (!nodeId) {
        return;
      }

      
      // TODO: de hash uit onderstaande moet wel gebruikt worden om naar de juiste pagina te springen
      // TODO: de URLs zijn onwenselijk lelijk,
      // Dit:  http://localhost:4200/details/https%253A%252F%252Fdata.razu.nl%252Fid%252Fobject%252Fnl-wbdrazu-k50907905-689-2454%232
      // moet: http://localhost:4200/details/https://data.razu.nl/id/object/nl-wbdrazu-k50907905-689-2454#2  
      // zijn.

      // Controleer eerst op geëncodeerde fragmenten (%23) voordat we decoderen
      let hashIndex = nodeId.indexOf('%23');
      if (hashIndex !== -1) {
        nodeId = nodeId.substring(0, hashIndex);
        console.log('details.component: geëncodeerd fragment (%23) verwijderd uit URL, nieuwe nodeId:', nodeId);
      }

      // Decodeer de URL
      nodeId = decodeURIComponent(nodeId);

      // Controleer op normale fragmenten (#) na decoderen
      hashIndex = nodeId.indexOf('#');
      if (hashIndex !== -1) {
        nodeId = nodeId.substring(0, hashIndex);
        console.log('details.component: fragment (#) verwijderd uit URL, nieuwe nodeId:', nodeId);
      }

      this.scroll.onNavigateToDetails(nodeId);
      void this.initNodeById(nodeId);
    });
  }

  async initNodeById(id: string) {
    this.node = undefined;
    this.nodeId = null;

    this.loadingNodeData = true;

    setTimeout(async () => {
      this.nodeId = id;
      const node = await this.sparql.getNode(this.nodeId);
      const enrichedNodes = await this.nodes.enrichWithIncomingRelations([
        node,
      ]);
      this.node = enrichedNodes[0] ?? node;
      this.loadingNodeData = false;
    });
  }

  protected readonly featherArrowLeft = featherArrowLeft;
}
