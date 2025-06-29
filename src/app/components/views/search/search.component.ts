import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Settings } from '../../../config/settings';
import { FilterPanelLocation } from '../../../models/settings/filter-panel-location.enum';
import { ViewMode } from '../../../models/view-mode.enum';
import { DetailsService } from '../../../services/details.service';
import { NodeService } from '../../../services/node/node.service';
import { SearchService } from '../../../services/search/search.service';
import { SettingsService } from '../../../services/settings.service';
import { ScrollService } from '../../../services/ui/scroll.service';
import { ViewModeService } from '../../../services/view-mode.service';
import { FilterOptionsComponent } from '../../features/filters/filter-options/filter-options.component';
import { NodeComponent } from '../../features/node/node.component';
import { LoadMoreSearchResultsButtonComponent } from '../../features/search/load-more-search-results-button/load-more-search-results-button.component';
import { SearchHitsCounterComponent } from '../../features/search/search-hits-counter/search-hits-counter.component';
import { SearchInputComponent } from '../../features/search/search-input/search-input.component';
import { SortSelectComponent } from '../../features/sort/sort-select/sort-select.component';
import { DetailsBackButtonComponent } from '../../ui/details-back-button/details-back-button.component';
import { HeaderComponent } from '../../ui/header/header.component';
import { LangSwitchComponent } from '../../ui/lang-switch/lang-switch.component';
import { DetailsComponent } from '../details/details.component';
import { ViewContainerComponent } from '../view-container/view-container.component';
import { NodesGridComponent } from './nodes-grid/nodes-grid.component';
import { NavButtonsComponent } from "../../ui/nav-buttons/nav-buttons.component";

@Component({
  selector: 'app-search',
  imports: [
    NodeComponent,
    NgForOf,
    SearchInputComponent,
    NgClass,
    NgIf,
    NodesGridComponent,
    FilterOptionsComponent,
    HeaderComponent,
    CommonModule,
    DetailsComponent,
    SortSelectComponent,
    LoadMoreSearchResultsButtonComponent,
    SearchHitsCounterComponent,
    DetailsBackButtonComponent,
    LangSwitchComponent,
    ViewContainerComponent,
    NavButtonsComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private static DEBUG = false;

  constructor(
    public search: SearchService,
    public viewModes: ViewModeService,
    public router: Router,
    public nodes: NodeService,
    public scroll: ScrollService,
    public details: DetailsService,
    public settings: SettingsService,
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (SearchComponent.DEBUG) {
          console.log('[Router] NavigationEnd:', event.urlAfterRedirects, window.location.search);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.scroll.initScrollContainer(this.scrollContainer);
  }

  protected readonly ViewMode = ViewMode;
  protected readonly Settings = Settings;
  protected readonly FilterPanelLocation = FilterPanelLocation;
  protected readonly filter = filter;
}
