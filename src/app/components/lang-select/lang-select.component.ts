import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-lang-select',
  standalone: true,
  imports: [NgIcon, NgIf, CommonModule, TranslocoModule],
  templateUrl: './lang-select.component.html',
  styleUrls: ['./lang-select.component.scss'],
})
export class LangSelectComponent implements OnInit, OnDestroy {
  currentLanguage: string;
  availableLanguages: any;
  flagUrl = `assets/i18n/flags.json`;
  flags: { [key: string]: string } = {};

  constructor(private translocoService: TranslocoService) {
    this.currentLanguage = this.translocoService.getActiveLang();
    this.availableLanguages = this.translocoService.getAvailableLangs();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  getCurrentLanguage(): string {
    return this.translocoService.getActiveLang();
  }

  changeLanguage(languageTag: string): void {
    this.translocoService.setActiveLang(languageTag);
    this.currentLanguage = this.translocoService.getActiveLang();
    this.availableLanguages = this.translocoService.getAvailableLangs();
  }
}
