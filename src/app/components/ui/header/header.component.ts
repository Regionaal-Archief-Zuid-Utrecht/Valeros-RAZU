import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { featherSearch, featherX } from '@ng-icons/feather-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Settings } from '../../../config/settings';
import {
  HeaderPosition,
  HeaderSettings,
} from '../../../models/settings/header-settings.model';
import { UrlService } from '../../../services/url.service';
import { AboutSettings, AboutPosition } from '../../../models/settings/about-settings.model';


export enum HeaderView {
  ShowingColofon,
  ShowingSearch,
  ShowingAbout,
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIcon, NgIf, TranslatePipe, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() view: HeaderView = HeaderView.ShowingSearch;
  readonly settings: HeaderSettings = Settings.ui.header;
  readonly aboutSettings: AboutSettings = Settings.ui.about;

  constructor(
    public router: Router,
    public url: UrlService,
    public translate: TranslateService,
  ) { }

  get buttonUrl() {
    return this.view === HeaderView.ShowingSearch ? 'colofon' : '';
  }
  get aboutButtonUrl() {
    return this.view === HeaderView.ShowingAbout ? 'about' : '';
  }

  async onButtonClicked(url: string) {
    this.url.ignoreQueryParamChange = true;
    await this.router.navigateByUrl(url);
    this.url.ignoreQueryParamChange = false;
  }

  protected readonly featherSearch = featherSearch;
  protected readonly featherX = featherX;
  protected readonly HeaderView = HeaderView;
  protected readonly HeaderPosition = HeaderPosition;
  protected readonly AboutPosition = AboutPosition;
}
