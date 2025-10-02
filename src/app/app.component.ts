import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { AriaLiveComponent } from './components/accessibility/aria-live/aria-live.component';
import { PageTitleService } from './services/page-title.service';
import { RoutingService } from './services/routing.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    PdfJsViewerModule,
    AriaLiveComponent,
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
  ) {
    this.translate.addLangs(['nl', 'en']);
    this.translate.setDefaultLang('nl');
    this.translate.use('nl');
    this.routing.initHistoryTracking();
    this.pageTitle.initPageTitleUpdates();
  }
}
