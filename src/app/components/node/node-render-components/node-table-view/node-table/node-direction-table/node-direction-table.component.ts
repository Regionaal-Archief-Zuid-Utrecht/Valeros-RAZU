import { Component, Input } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Direction, NodeModel } from '../../../../../../models/node.model';
import {
  PredicateSection,
  PredicateVisibility,
} from '../../../../../../models/settings/predicate-visibility-settings.model';
import { NodeService } from '../../../../../../services/node.service';
import { SettingsService } from '../../../../../../services/settings.service';
import { sortByArrayOrder } from '../../../../../../helpers/util.helper';
import { TranslatePipe } from '@ngx-translate/core';
import {
  NodeTableCellComponent,
  TableCellShowOptions,
} from '../node-table-cell/node-table-cell.component';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';

@Component({
  selector: 'app-node-direction-table',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NodeTableCellComponent,
    NgIf,
    NodeLinkComponent,
    TranslatePipe,
  ],
  templateUrl: './node-direction-table.component.html',
  styleUrl: './node-direction-table.component.scss',
})
export class NodeDirectionTableComponent {
  @Input() node?: NodeModel;
  @Input() visibility!: PredicateVisibility;
  @Input() direction!: Direction;

  predicateSections: PredicateSection[] = [];
  predicateVisibilities: { [pred: string]: PredicateVisibility } = {};
  numPredValues: {
    [pred: string]: { [direction in Direction]: number };
  } = {};

  constructor(
    public nodes: NodeService,
    public settings: SettingsService,
  ) {}

  ngOnInit() {
    this.initPredData();
    this.initNodePreds();
  }

  initNodePreds() {
    if (!this.node) {
      return;
    }
    const nodePreds = Object.keys(this.node);
    // const sortedNodePreds = sortByArrayOrder(
    //   nodePreds,
    //   this.settings.getVisiblePredicatesFlattened(this.visibility),
    // );

    // Get all predicate sections for current visibility
    const settingsSections = this.settings.getVisiblePredicates()[this.visibility];

    // Initialize sections in the order they appear in settings
    const orderedSections = settingsSections.map(section => ({
      ...section,
      predicates: [] as string[] // Start with empty predicates array
    }));

    // Find the wildcard section if it exists
    const wildcardSectionIndex = settingsSections.findIndex(section => 
      section.predicates.includes('*')
    );

    // For each predicate in node
    nodePreds.forEach((pred) => {
      // First try to find section that explicitly lists this predicate
      const explicitSectionIndex = settingsSections.findIndex(section => 
        section.predicates.includes(pred)
      );
      
      const sectionIndex = explicitSectionIndex >= 0 ? explicitSectionIndex : wildcardSectionIndex;
      if (sectionIndex >= 0) {
        orderedSections[sectionIndex].predicates.push(pred);
      }
    });

    // Sort predicates within each section according to settings order
    orderedSections.forEach((section, index) => {
      const settingsPredicates = settingsSections[index].predicates;
      section.predicates = sortByArrayOrder(section.predicates, settingsPredicates);
    });

    // Set the ordered sections
    this.predicateSections = orderedSections;
  }

  initPredData() {
    if (!this.node) {
      return;
    }
    for (const pred of Object.keys(this.node)) {
      this.predicateVisibilities[pred] =
        this.settings.getPredicateVisibility(pred);

      for (const direction of [Direction.Outgoing, Direction.Incoming]) {
        if (!this.numPredValues[pred]) {
          (this.numPredValues[pred] as any) = {};
        }
        this.numPredValues[pred][direction] =
          this.nodes.getObjValuesByDirection(
            this.node,
            [pred],
            direction,
          ).length;
      }
    }
  }

  getNumPredValues(pred: string, direction: Direction) {
    if (!pred || direction === undefined || !this.numPredValues[pred]) {
      return 0;
    }

    return this.numPredValues[pred][direction];
  }

  hasPredsToShow(direction: Direction, visibility: PredicateVisibility) {
    return Object.entries(this.numPredValues).some(
      ([pred, numValuesByDirection]) => {
        return (
          this.predicateVisibilities[pred] === visibility &&
          numValuesByDirection[direction] > 0
        );
      },
    );
  }

  get smallFontSize(): boolean {
    return false;
    // return this.visibility === PredicateVisibility.Details;
  }

  sectionHasPredsToShow(section: PredicateSection, direction: Direction): boolean {
    return section.predicates.some(
      pred =>
        this.predicateVisibilities[pred] === this.visibility &&
        this.getNumPredValues(pred, direction) > 0
    );
  }

  protected readonly Direction = Direction;
  protected readonly TableCellShowOptions = TableCellShowOptions;
}
