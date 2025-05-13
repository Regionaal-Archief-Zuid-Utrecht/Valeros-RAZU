import { NgComponentOutlet, NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherArrowUpLeft } from '@ng-icons/feather-icons';
import { Config } from '../../../../../../../config/config';
import { Settings } from '../../../../../../../config/settings';
import { Direction, NodeModel } from '../../../../../../../models/node.model';
import { PredicateRenderComponentInput } from '../../../../../../../models/predicate-render-component-input.model';
import { RenderMode } from '../../../../../../../models/settings/render-component-settings.type';
import { NodeService } from '../../../../../../../services/node/node.service';
import { RenderComponentService } from '../../../../../../../services/render-component.service';
import { PREDICATE_RENDER_COMPONENT_REGISTRY } from '../../../../../../custom-render-components/by-predicate/predicate-render-component-registry';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';
import { NodeTypeComponent } from '../../../../node-types/node-type/node-type.component';
import { FileRendererComponent } from '../../../predicate-render-components/file-renderer/file-renderer.component';
import { MapThumbComponent } from '../../../predicate-render-components/map-thumb/map-thumb.component';

export enum TableCellShowOptions {
  Pred,
  Obj,
}

@Component({
  selector: 'app-node-table-cell',
  standalone: true,
  imports: [
    NgForOf,
    NgIcon,
    NgIf,
    NodeLinkComponent,
    MapThumbComponent,
    NodeTypeComponent,
    FileRendererComponent,
    NgComponentOutlet,
  ],
  templateUrl: './node-table-cell.component.html',
  styleUrl: './node-table-cell.component.scss',
})
export class NodeTableCellComponent implements OnInit {
  public readonly componentRegistry = PREDICATE_RENDER_COMPONENT_REGISTRY;

  @Input() pred?: string;
  @Input() node?: NodeModel;
  @Input() direction?: Direction;
  @Input() show?: TableCellShowOptions;

  numObjValuesToShow = Config.numObjValuesToShowDefault;
  shouldRenderComponentIds: string[] = [];
  renderComponentIsDefined = false;

  objValues: string[] = [];

  constructor(
    public nodes: NodeService,
    public renderComponent: RenderComponentService,
  ) {}

  ngOnInit() {
    this.initRenderComponentIds();
    this.initObjValues();
  }

  getPredicateRenderComponentInput(
    objValue: string,
  ): PredicateRenderComponentInput | null {
    if (!this.node || !this.pred) {
      return null;
    }
    return {
      nodeId: this.nodes.getId(this.node),
      value: objValue,
      hopLinkSettings: this.renderComponent.getSettingByKey(
        'hopLinkSettings',
        this.node,
        RenderMode.ByPredicate,
        [this.pred],
        this.direction,
      ),
    };
  }

  initObjValues() {
    if (this.direction === undefined || !this.pred) {
      return;
    }

    this.objValues = this.nodes.getObjValuesByDirection(
      this.node,
      [this.pred],
      this.direction,
    );
  }

  initRenderComponentIds() {
    if (!this.node) {
      return;
    }

    const preds = this.pred ? [this.pred] : [];

    this.shouldRenderComponentIds = this.renderComponent.getIdsToShow(
      this.node,
      RenderMode.ByPredicate,
      preds,
      this.direction,
    );

    this.renderComponentIsDefined = this.renderComponent.isDefined(
      this.node,
      RenderMode.ByPredicate,
      preds,
      this.direction,
    );
  }

  get isIncoming() {
    return this.direction === Direction.Incoming;
  }

  get objValuesToShow(): string[] {
    return this.objValues.slice(0, this.numObjValuesToShow);
  }

  get numObjValuesNotShown(): number {
    return this.objValues.length - this.numObjValuesToShow;
  }

  loadMoreObjValues() {
    this.numObjValuesToShow += Config.additionalNumObjValuesToShowOnClick;
  }

  get showMoreLabel(): string {
    return `Laad nog ${Math.min(
      this.numObjValuesNotShown,
      Config.additionalNumObjValuesToShowOnClick,
    )} resultaten`;
  }

  protected readonly TableCellShowOptions = TableCellShowOptions;
  protected readonly RenderMode = RenderMode;
  protected readonly Settings = Settings;
  protected readonly featherArrowUpLeft = featherArrowUpLeft;
}
