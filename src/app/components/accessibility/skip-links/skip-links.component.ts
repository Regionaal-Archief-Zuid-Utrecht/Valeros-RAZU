import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-skip-links',
  imports: [TranslatePipe],
  templateUrl: './skip-links.component.html',
  styleUrl: './skip-links.component.scss',
})
export class SkipLinksComponent {
  skipToSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      const input = searchInput.querySelector('input');
      input?.focus();
    }
  }

  skipToFilters() {
    this.focusElement('filter-panel');
  }

  skipToResults() {
    this.focusElement('search-results', true);
  }

  private focusElement(elementId: string, scrollIntoView = false) {
    const element = document.getElementById(elementId);
    if (element) {
      element.setAttribute('tabindex', '-1');
      element.focus();
      if (scrollIntoView) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}
