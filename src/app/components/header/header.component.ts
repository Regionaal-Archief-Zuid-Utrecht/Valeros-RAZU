import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { featherSearch, featherX } from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { UrlService } from '../../services/url.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LangSwitchComponent } from '../lang-switch/lang-switch.component';
import { Settings } from '../../config/settings';
import { HeaderPositionService } from '../../services/header-position.service';
import { HeaderSettings } from '../../models/header/header-position.types';

export enum HeaderView {
  ShowingColofon,
  ShowingSearch,
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIcon,
    NgIf,
    TranslatePipe,
    NgClass,
    LangSwitchComponent,
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() view: HeaderView = HeaderView.ShowingSearch;
  readonly settings: HeaderSettings = Settings.header;

  constructor(
    public router: Router,
    public url: UrlService,
    public translate: TranslateService,
    private headerPosition: HeaderPositionService
  ) {}

  // Navigation methods
  get buttonUrl() {
    return this.view === HeaderView.ShowingSearch ? 'colofon' : '';
  }

  async onButtonClicked(url: string) {
    this.url.ignoreQueryParamChange = true;
    await this.router.navigateByUrl(url);
    this.url.ignoreQueryParamChange = false;
  }

  // Styling methods
  getScaleClasses(): string {
    const baseClasses = ['w-fit']; // Always add width class
    
    // Add text size classes based on scale
    switch (this.settings.scale) {
      case 'small':
        baseClasses.push('text-sm');
        break;
      case 'large':
        baseClasses.push('text-lg');
        break;
    }

    return baseClasses.join(' ');
  }

  getPositionClasses(): string {
    return this.headerPosition.getPositionClasses(this.settings);
  }

  getRoundedClasses(): string {
    return this.headerPosition.getRoundedClasses(this.settings);
  }

  // Height and spacing methods
  getHeaderHeight(): string {
    switch (this.settings.scale) {
      case 'small':
        return 'h-12'; // 3rem
      case 'large':
        return 'h-20'; // 5rem
      default:
        return 'h-16'; // 4rem
    }
  }

  getContentGap(): string {
    switch (this.settings.gapBeforeContent) {
      case 'small':
        return 'h-12'; // 3rem 
      case 'large':
        return 'h-20'; // 5rem 
      default:
        return 'h-16'; // 4rem 
    }
  }

  getPlaceholderClasses(): string {
    return this.headerPosition.getPlaceholderClasses(
      this.settings,
      this.getHeaderHeight(),
      this.getContentGap()
    );
  }

  needsSpaceReservation(): boolean {
    const position = this.headerPosition.getPosition(this.settings);
    return position.effectiveVerticalPosition === 'top';
  }

  // Icons
  protected readonly featherSearch = featherSearch;
  protected readonly featherX = featherX;
  protected readonly HeaderView = HeaderView;
}
