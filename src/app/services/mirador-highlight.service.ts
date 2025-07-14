import { Injectable } from '@angular/core';
import { SearchService } from './search/search.service';

@Injectable({
  providedIn: 'root',
})
export class MiradorHighlightService {
  private _mutationObserver?: MutationObserver;

  constructor(private search: SearchService) {}

  init() {
    this.stopCheckingForTextElementsInDOM();
    this._mutationObserver = new MutationObserver((mutations, obs) => {
      const textElements = document.querySelectorAll('text');

      if (textElements.length > 0) {
        this.stopCheckingForTextElementsInDOM();

        this.addHighlights();
      }
    });

    this._mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  stopCheckingForTextElementsInDOM() {
    if (this._mutationObserver) {
      console.log('Stopping check for text elements in DOM');
      this._mutationObserver.disconnect();
      this._mutationObserver = undefined;
    }
  }

  addHighlights() {
    const highlightStr = this.search.queryStr;
    console.log('Adding highlights', highlightStr);

    if (!highlightStr || highlightStr.trim() === '') {
      console.warn('No highlight string provided');
      return;
    }

    const highlightWords = highlightStr
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    console.log('Highlight words:', highlightWords);

    const textElements = document.querySelectorAll('text');
    if (textElements.length === 0) {
      console.log('No text elements found');
      return;
    }

    const matchingElements: Element[] = [];
    textElements.forEach((textElement) => {
      const textContent = textElement.textContent;
      if (textContent) {
        const normalizedText = textContent.trim().toLowerCase();

        const shouldHighlight = highlightWords.some(
          (highlightWord) => normalizedText === highlightWord,
        );

        if (shouldHighlight) {
          matchingElements.push(textElement);
        }
      }
    });

    console.log(`Found ${matchingElements.length} matching text elements`);

    if (matchingElements.length === 0) {
      return;
    }

    let svgParent = null;
    for (const element of matchingElements) {
      svgParent = this._findSvgParent(element);
      if (svgParent) break;
    }

    if (!svgParent) {
      console.log('No SVG parent found');
      return;
    }

    this._addFilterDefinition(svgParent);

    matchingElements.forEach((textElement) => {
      textElement.setAttribute('filter', 'url(#highlight)');
    });
  }

  private _findSvgParent(element: Element): SVGSVGElement | null {
    let currentElement: Element | null = element;

    while (currentElement && currentElement.tagName.toLowerCase() !== 'svg') {
      currentElement = currentElement.parentElement;
    }

    return currentElement as SVGSVGElement;
  }

  private _addFilterDefinition(svgElement: SVGSVGElement): void {
    if (svgElement.querySelector('#highlight')) {
      return;
    }

    let defsElement = svgElement.querySelector('defs');
    if (!defsElement) {
      defsElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'defs',
      );
      svgElement.insertBefore(defsElement, svgElement.firstChild);
    }

    const filterHTML = `
      <filter x="0" y="0" width="1" height="1" id="highlight">
        <feFlood flood-color="yellow" result="bg" />
        <feMerge>
          <feMergeNode in="bg"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;

    defsElement.innerHTML += filterHTML;
  }
}
