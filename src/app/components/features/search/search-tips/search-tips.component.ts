import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherInfo } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchTipInputComponent } from './search-tip-input/search-tip-input.component';
import { SearchTipComponent } from './search-tip/search-tip.component';

@Component({
  selector: 'app-search-tips',
  standalone: true,
  imports: [TranslatePipe, NgIcon, SearchTipInputComponent, SearchTipComponent],
  templateUrl: './search-tips.component.html',
  styleUrls: ['./search-tips.component.scss'],
})
export class SearchTipsComponent {
  @ViewChild('modal') modal: ElementRef<HTMLDialogElement> | undefined;
  @ViewChild('triggerButton') triggerButton:
    | ElementRef<HTMLButtonElement>
    | undefined;

  protected readonly featherInfo = featherInfo;

  constructor(private renderer: Renderer2) {}

  focusOnModalTitle() {
    const titleElement =
      this.modal?.nativeElement.querySelector('#search-tips-title');
    (titleElement as HTMLElement).focus();
  }
  openModal() {
    if (this.modal && this.triggerButton) {
      this.renderer.setAttribute(
        this.triggerButton.nativeElement,
        'aria-expanded',
        'true',
      );

      setTimeout(() => {
        this.focusOnModalTitle();
      }, 100);

      this.modal.nativeElement.addEventListener(
        'close',
        () => {
          this.renderer.setAttribute(
            this.triggerButton!.nativeElement,
            'aria-expanded',
            'false',
          );

          this.renderer.setAttribute(this.modal?.nativeElement, 'inert', '');
        },
        { once: true },
      );

      this.modal.nativeElement.showModal();

      this.renderer.removeAttribute(this.modal?.nativeElement, 'inert');
    }
  }
}
