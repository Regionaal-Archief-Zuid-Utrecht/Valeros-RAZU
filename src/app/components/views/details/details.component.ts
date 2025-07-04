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
      nodeId = decodeURIComponent(nodeId);

      // TODO: Move to service itself, instead of calling from component
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
