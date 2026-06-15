import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  featherChevronLeft,
  featherChevronRight,
} from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { NodeService } from '../../../../services/node/node.service';
import { SearchService } from '../../../../services/search/search.service';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, TranslatePipe, NgIcon],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  private search = inject(SearchService);
  private nodes = inject(NodeService);

  constructor() {
    effect(() => {
      const page = this.currentPage();
      if (page > 0) {
        this.focusOnFirstResult();
      }
    });
  }

  currentPage = input.required<number>();
  totalItems = input.required<number>();
  pageSize = input.required<number>();

  protected readonly totalPages = computed(() => {
    return Math.ceil(this.totalItems() / this.pageSize());
  });

  protected readonly hasPrevious = computed(() => {
    return this.currentPage() > 1;
  });

  protected readonly hasNext = computed(() => {
    return this.currentPage() < this.totalPages();
  });

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push('...');
      }

      pages.push(total);
    }

    return pages;
  });

  goToPage(page: number): void {
    const isInvalidPage = page < 1 || page > this.totalPages();
    const isAlreadyOnPage = page === this.currentPage();
    if (isInvalidPage || isAlreadyOnPage) {
      return;
    }

    this.search.setPage(page);
  }

  goToPrevious(): void {
    if (this.hasPrevious()) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  goToNext(): void {
    if (this.hasNext()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  private focusOnFirstResult(): void {
    setTimeout(() => {
      const firstNode = this.search.results.value.nodes?.[0];
      if (!firstNode) {
        return;
      }
      const firstNodeId = this.nodes.getId(firstNode);
      const firstResultElem: HTMLElement | null = document.querySelector(
        `[data-scroll-id="${encodeURIComponent(firstNodeId)}"] a.node-result-item`,
      );
      firstResultElem?.focus();
    }, 100);
  }

  protected readonly featherChevronLeft = featherChevronLeft;
  protected readonly featherChevronRight = featherChevronRight;
}
