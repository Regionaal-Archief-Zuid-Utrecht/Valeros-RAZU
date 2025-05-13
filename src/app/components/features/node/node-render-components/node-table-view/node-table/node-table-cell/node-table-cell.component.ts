import { NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherArrowUpLeft } from '@ng-icons/feather-icons';
import { Config } from '../../../../../../../config/config';
import { Settings } from '../../../../../../../config/settings';
import { Direction, NodeModel } from '../../../../../../../models/node.model';
import { RenderMode } from '../../../../../../../models/settings/render-component-settings.type';
import { NodeService } from '../../../../../../../services/node/node.service';
import { RenderComponentService } from '../../../../../../../services/render-component.service';
import { LdtoDekkingInTijdComponent } from '../../../../../../custom-render-components/by-predicate/ldto-dekking-in-tijd/ldto-dekking-in-tijd.component';
import { LdtoEventComponent } from '../../../../../../custom-render-components/by-predicate/ldto-event/ldto-event.component';
import { LdtoOmvangComponent } from '../../../../../../custom-render-components/by-predicate/ldto-omvang/ldto-omvang.component';
import { LdtoUrlBestandComponent } from '../../../../../../custom-render-components/by-predicate/ldto-url-bestand/ldto-url-bestand.component';
import { RicoIdentifierComponent } from '../../../../../../custom-render-components/by-predicate/rico-identifier/rico-identifier.component';
import { NodeImagesComponent } from '../../../../node-images/node-images.component';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';
import { NodeTypeComponent } from '../../../../node-types/node-type/node-type.component';
import { FileRendererComponent } from '../../../predicate-render-components/file-renderer/file-renderer.component';
import { HopImageComponent } from '../../../predicate-render-components/hop-components/hop-image/hop-image.component';
import { HopLinkComponent } from '../../../predicate-render-components/hop-components/hop-link/hop-link.component';
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
    NodeImagesComponent,
    MapThumbComponent,
    NodeTypeComponent,
    HopLinkComponent,
    LdtoDekkingInTijdComponent,
    LdtoUrlBestandComponent,
    HopImageComponent,
    RicoIdentifierComponent,
    LdtoOmvangComponent,
    LdtoEventComponent,
    FileRendererComponent,
  ],
  templateUrl: './node-table-cell.component.html',
  styleUrl: './node-table-cell.component.scss',
})
export class NodeTableCellComponent implements OnInit {
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
