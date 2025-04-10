import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AsyncPipe, Location, NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Direction, NodeModel } from '../../models/node.model';
import { SparqlNodeParentModel } from '../../models/sparql/sparql-node-parent.model';
import { NodeService } from '../../services/node.service';
import { Settings } from '../../config/settings';
import { SparqlService } from '../../services/sparql.service';
import { DataService } from '../../services/data.service';
import { ThingWithLabelModel } from '../../models/thing-with-label.model';
import { NodeHierarchyComponent } from './node-hierarchy/node-hierarchy.component';
import { NodeTypesComponent } from './node-types/node-types.component';
import { LabelsCacheService } from '../../services/cache/labels-cache.service';
import { NodeLinkComponent } from './node-link/node-link.component';
import { NodeRendererComponent } from './node-renderer/node-renderer.component';
import { SettingsService } from '../../services/settings.service';
import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { TypeModel } from '../../models/type.model';
import { NodeEndpointComponent } from './node-endpoint/node-endpoint.component';
import { NodeTableRowComponent } from './node-table-row/node-table-row.component';
import {
  featherArrowLeft,
  featherArrowRight,
  featherChevronRight,
} from '@ng-icons/feather-icons';
import { DetailsService } from '../../services/details.service';
import { NodeDetailsButtonComponent } from './node-details-button/node-details-button.component';
import { NodePermalinkButtonComponent } from './node-permalink-button/node-permalink-button.component';
import { RoutingService } from '../../services/routing.service';
import { TranslatePipe } from '@ngx-translate/core';
import { FileRendererComponent } from './node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { NodeSectionService } from '../../services/node-section.service';
import { NodeFileService } from '../../services/node-file.service';
import { MiradorComponent } from '../mirador/mirador.component';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [
    NgIf,
    NodeHierarchyComponent,
    NodeTypesComponent,
    AsyncPipe,
    NodeLinkComponent,
    NodeRendererComponent,
    NodeEndpointComponent,
    NodeTableRowComponent,
    NgClass,
    NodeDetailsButtonComponent,
    NodePermalinkButtonComponent,
    RouterLink,
    TranslatePipe,
    FileRendererComponent,
    MiradorComponent,
  ],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss',
})
export class NodeComponent implements OnInit, OnChanges {
  @Input() node?: NodeModel;
  parents: ThingWithLabelModel[] = [];

  id?: string;
  title = '';
  types: TypeModel[] = [];
  files: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  filesLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canShowUsingFileRenderer: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  showTitle = this.settings.hasViewModeSetting(ViewModeSetting.ShowTitle);
  showParents = this.settings.hasViewModeSetting(ViewModeSetting.ShowParents);
  showTypes = this.settings.hasViewModeSetting(ViewModeSetting.ShowTypes);
  showOrganization = this.settings.hasViewModeSetting(
    ViewModeSetting.ShowOrganization,
  );

  private shouldShowIIIFSubject = new BehaviorSubject<boolean>(false);
  shouldShowIIIF$ = this.shouldShowIIIFSubject.asObservable();

  constructor(
    public nodes: NodeService,
    public sparql: SparqlService,
    public data: DataService,
    public cache: LabelsCacheService,
    public settings: SettingsService,
    public details: DetailsService,
    public router: Router,
    public routing: RoutingService,
    public location: Location,
    public labelsCache: LabelsCacheService,
    public nodeSection: NodeSectionService,
    public nodeFile: NodeFileService,
  ) {}

  ngOnInit() {
    void this.retrieveParents();
    void this.checkShouldShowIIIF();
    this.initTitle();
    this.initTypes();
    this.initFiles();

    if (!this.node) {
      return;
    }

    this.id = this.nodes.getId(this.node);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['node']) {
      void this.checkShouldShowIIIF();
    }
  }

  initTitle() {
    const titles = this.nodes
      .getObjValues(this.node, Settings.predicates.label)
      .map((title) => title.trim());

    if (!titles || titles.length === 0) {
      return;
    }

    this.title = titles[0];
  }

  async getHopImageUrls(nodeId: string): Promise<string[]> {
    const hopImagePromises = Settings.predicates.hopImages.map(
      (hopImagePreds) => this.sparql.getObjIds(nodeId, hopImagePreds),
    );

    const hopImageUrls = await Promise.all(hopImagePromises);
    return hopImageUrls.flat();
  }

  async initFiles() {
    if (!this.node) {
      return;
    }

    let files = this.nodeFile.getFiles(this.node);

    if (this.details.isShowing()) {
      const nodeId = this.nodes.getId(this.node);
      const hopImageUrls = await this.getHopImageUrls(nodeId);
      files = [...files, ...hopImageUrls];
    }

    this.files.next(files);
  }

  initTypes() {
    // TODO: Render incoming types in the table view?
    const types: TypeModel[] = this.nodes
      .getObjValues(this.node, Settings.predicates.type, Direction.Outgoing)
      .map((typeId) => {
        return { id: typeId };
      });

    types.forEach((type) => {
      void this.cache.cacheLabelForId(type.id);
    });

    this.types = types;
  }

  async retrieveParents() {
    if (!this.node || !this.showParents) {
      return;
    }

    const response: SparqlNodeParentModel[] = await this.sparql.getAllParents(
      this.node,
    );

    this.parents = this.data.getOrderedParentsFromSparqlResults(
      this.nodes.getId(this.node),
      response,
    );
  }

  get sectionNextToTableWidth(): string {
    if (window.innerWidth < 640) {
      return '100%';
    }

    return this.details.showing.value
      ? Settings.sectionNextToTableWidth.details
      : Settings.sectionNextToTableWidth.search;
  }

  shouldShowFileNextToTable(): boolean {
    return this.nodeSection.shouldShowFileNextToTable(
      this.files.value,
      this.canShowUsingFileRenderer.value,
    );
  }

  shouldShowSectionNextToTable(): Observable<boolean> {
    return this.nodeSection.shouldShowSectionNextToTable(
      this.files.value,
      this.canShowUsingFileRenderer.value,
      this.shouldShowIIIF$,
    );
  }

  async checkShouldShowIIIF() {
    const shouldShow = await this.nodeSection.checkShouldShowIIIF(
      this.node,
      this.files.value,
      this.canShowUsingFileRenderer.value,
    );
    this.shouldShowIIIFSubject.next(shouldShow);
  }

  getSectionNextToTableWidth(): string {
    return this.details.showing.value
      ? Settings.sectionNextToTableWidth.details
      : Settings.sectionNextToTableWidth.search;
  }

  protected readonly Settings = Settings;
  protected readonly featherChevronRight = featherChevronRight;
  protected readonly featherArrowRight = featherArrowRight;
  protected readonly featherArrowLeft = featherArrowLeft;
  protected readonly encodeURIComponent = encodeURIComponent;
}
