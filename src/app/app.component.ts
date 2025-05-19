import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { RoutingService } from './services/routing.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule, PdfJsViewerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'view-a-LOD';

  constructor(
    private titleService: Title,
    private translate: TranslateService,
    private routing: RoutingService,
  ) {
    this.translate.addLangs(['nl', 'en']);
    this.translate.setDefaultLang('nl');
    this.translate.use('nl');
    this.translate.get('general.page-title').subscribe((res: string) => {
      this.titleService.setTitle(res);
    });
    this.routing.initHistoryTracking();
  }
}
