import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import {
  featherChevronLeft,
  featherChevronRight,
  featherFilter,
  featherX,
} from '@ng-icons/feather-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { AriaLiveComponent } from './components/accessibility/aria-live/aria-live.component';
import { FilterOptionsComponent } from './components/features/filters/filter-options/filter-options.component';
import { PageTitleService } from './services/page-title.service';
import { RoutingService } from './services/routing.service';
import { UiService } from './services/ui/ui.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    PdfJsViewerModule,
    AriaLiveComponent,
    FilterOptionsComponent,
    NgIcon,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Valeros';

  constructor(
    private translate: TranslateService,
    private routing: RoutingService,
    private pageTitle: PageTitleService,
    public ui: UiService,
    private router: Router,
  ) {
    this.translate.addLangs(['nl', 'en']);
    this.translate.setDefaultLang('nl');
    this.translate.use('nl');
    this.routing.initHistoryTracking();
    this.pageTitle.initPageTitleUpdates();
  }

  // TODO: Reduce calls if necessary for performance reasons
  isSearchPage() {
    return this.router.url.startsWith('/search');
  }

  protected readonly featherChevronLeft = featherChevronLeft;
  protected readonly featherChevronRight = featherChevronRight;
  protected readonly featherFilter = featherFilter;
  protected readonly featherX = featherX;
}
