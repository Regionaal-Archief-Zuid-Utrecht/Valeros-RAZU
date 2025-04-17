import { Component, Input } from '@angular/core';
import { ThingWithLabelModel } from '../../../models/thing-with-label.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NodeService } from '../../../services/node/node.service';
import { NgIcon } from '@ng-icons/core';
import { Config } from '../../../config/config';
import { SettingsService } from '../../../services/settings.service';
import { NodeLinkComponent } from '../node-link/node-link.component';
import { featherChevronRight } from '@ng-icons/feather-icons';
import { Settings } from '../../../config/settings';
import { AccessibleIconDirective } from '../../../directives/accessible-icon.directive';

@Component({
  selector: 'app-node-hierarchy',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    NgIcon,
    NodeLinkComponent,
    AccessibleIconDirective,
  ],
  templateUrl: './node-hierarchy.component.html',
  styleUrl: './node-hierarchy.component.scss',
})
export class NodeHierarchyComponent {
  @Input() nodes: ThingWithLabelModel[] = [];
  collapsed = false;

  constructor(
    public nodeService: NodeService,
    public settings: SettingsService,
  ) {}

  get hasLoadedNodes(): boolean {
    return this.nodes !== undefined;
  }

  get showNodes(): boolean {
    return this.hasLoadedNodes && this.nodes.length > 0;
  }

  get allowExpand(): boolean {
    return (
      this.hasLoadedNodes &&
      this.nodes.length >= Config.minNumParentsToAllowTreeExpand
    );
  }

  protected readonly featherChevronRight = featherChevronRight;
  protected readonly Settings = Settings;
}
