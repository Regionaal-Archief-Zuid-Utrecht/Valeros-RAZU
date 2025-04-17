import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxMasonryModule } from 'ngx-masonry';
import { filter } from 'rxjs';
import { Settings } from '../../../config/settings';
import { FilterPanelLocation } from '../../../models/settings/filter-panel-location.enum';
import { ViewMode } from '../../../models/view-mode.enum';
import { DetailsService } from '../../../services/details.service';
import { NodeService } from '../../../services/node/node.service';
import { ScrollService } from '../../../services/scroll.service';
import { SearchService } from '../../../services/search/search.service';
import { SettingsService } from '../../../services/settings.service';
import { ViewModeService } from '../../../services/view-mode.service';
import { FilterOptionsComponent } from '../../features/filters/filter-options/filter-options.component';
import { NodeComponent } from '../../features/node/node.component';
import { LoadMoreSearchResultsButtonComponent } from '../../features/search/load-more-search-results-button/load-more-search-results-button.component';
import { SearchHitsCounterComponent } from '../../features/search/search-hits-counter/search-hits-counter.component';
import { SearchInputComponent } from '../../features/search/search-input/search-input.component';
import { DetailsBackButtonComponent } from '../../ui/details-back-button/details-back-button.component';
import { HeaderComponent } from '../../ui/header/header.component';
import { LangSwitchComponent } from '../../ui/lang-switch/lang-switch.component';
import { SortSelectComponent } from '../../ui/sort-select/sort-select.component';
import { DetailsComponent } from '../details/details.component';
import { ViewContainerComponent } from '../view-container/view-container.component';
import { HomeIntroBelowSearchComponent } from './home-intro/home-intro-below-search/home-intro-below-search.component';
import { HomeIntroComponent } from './home-intro/home-intro.component';
import { NodesGridComponent } from './nodes-grid/nodes-grid.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    NodeComponent,
    NgForOf,
    SearchInputComponent,
    NgClass,
    NgxMasonryModule,
    NgIf,
    NodesGridComponent,
    FilterOptionsComponent,
    HeaderComponent,
    ViewContainerComponent,
    HomeIntroComponent,
    CommonModule,
    HomeIntroBelowSearchComponent,
    DetailsComponent,
    SortSelectComponent,
    LoadMoreSearchResultsButtonComponent,
    SearchHitsCounterComponent,
    DetailsBackButtonComponent,
    LangSwitchComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    public search: SearchService,
    public viewModes: ViewModeService,
    public router: Router,
    public nodes: NodeService,
    public scroll: ScrollService,
    public details: DetailsService,
    public settings: SettingsService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.scroll.initScrollContainer(this.scrollContainer);
  }

  get shouldShowHomeIntro(): boolean {
    // TODO: Better way to determine whether or not to show home
    if (this.router.url === '' || this.router.url === '/') {
      return true;
    }

    return (
      !this.details.showing.value &&
      !this.search.hasDoneInitialSearch &&
      this.search.queryStr === ''
    );
  }

  protected readonly ViewMode = ViewMode;
  protected readonly Settings = Settings;
  protected readonly FilterPanelLocation = FilterPanelLocation;
  protected readonly filter = filter;
}
