import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { featherSearch, featherX } from '@ng-icons/feather-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Settings } from '../../../config/settings';
import { AboutSettings, AboutPosition } from '../../../models/settings/about-settings.model';
import { UrlService } from '../../../services/url.service';

export enum AboutView {
  ShowingColofon,
  ShowingSearch,
  ShowingAbout,
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgIcon, NgIf, TranslatePipe, NgClass],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  @Input() view: AboutView = AboutView.ShowingSearch;
  readonly settings: AboutSettings = Settings.ui.about;

  constructor(
    public router: Router,
    public url: UrlService,
    public translate: TranslateService,
  ) { }

  get buttonUrl() {
    return this.view === AboutView.ShowingSearch ? 'colofon' : this.view === AboutView.ShowingAbout ? 'about' : '';
  }

  async onButtonClicked(url: string) {
    this.url.ignoreQueryParamChange = true;
    await this.router.navigateByUrl(url);
    this.url.ignoreQueryParamChange = false;
  }

  protected readonly featherSearch = featherSearch;
  protected readonly featherX = featherX;
  protected readonly AboutView = AboutView;
  protected readonly AboutPosition = AboutPosition;
}
