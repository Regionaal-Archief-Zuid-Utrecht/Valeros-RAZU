import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Settings } from '../../../../config/settings';
import { NodeModel } from '../../../../models/node.model';
import { RenderMode } from '../../../../models/settings/render-component-settings.type';
import { NodeService } from '../../../../services/node/node.service';
import { RenderComponentService } from '../../../../services/render-component.service';
import { NodeTableViewComponent } from '../node-render-components/node-table-view/node-table-view.component';
import { SampleTypeRenderComponentComponent } from "../node-render-components/type-render-components/sample-type-render-component/sample-type-render-component.component";

@Component({
  selector: 'app-node-renderer',
  standalone: true,
  imports: [NodeTableViewComponent, NgIf, SampleTypeRenderComponentComponent],
  templateUrl: './node-renderer.component.html',
  styleUrl: './node-renderer.component.scss',
})
export class NodeRendererComponent implements OnInit {
  @Input() node?: NodeModel;

  renderComponentIdsToShow: string[] = [];
  renderComponentIsDefined = false;

  constructor(
    public nodes: NodeService,
    public renderComponents: RenderComponentService,
  ) {}

  ngOnInit() {
    this.initRenderComponentIds();
  }

  initRenderComponentIds() {
    if (!this.node) {
      return;
    }
    this.renderComponentIdsToShow = this.renderComponents.getIdsToShow(
      this.node,
      RenderMode.ByType,
    );

    this.renderComponentIsDefined = this.renderComponents.isDefined(
      this.node,
      RenderMode.ByType,
    );
  }

  protected readonly Settings = Settings;
  protected readonly RenderMode = RenderMode;
}
