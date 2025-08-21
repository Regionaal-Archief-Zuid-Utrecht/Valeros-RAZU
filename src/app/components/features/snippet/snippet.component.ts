import { JsonPipe } from '@angular/common';
import { Component, inject, Input, type OnInit } from '@angular/core';
import { NodeModel } from '../../../models/node.model';
import { SearchService } from '../../../services/search/search.service';

@Component({
  selector: 'app-snippet',
  imports: [JsonPipe],
  templateUrl: './snippet.component.html',
})
export class SnippetComponent implements OnInit {
  @Input() node?: NodeModel;
  loading = false;
  snippet?: string;

  searchService = inject(SearchService);

  ngOnInit(): void {
    void this.retrieveSnippet();
  }

  async retrieveSnippet(): Promise<void> {
    const urlBestand = this.node?.['URL_bestand']?.[0]?.value;
    if (!urlBestand) {
      return;
    }

    this.loading = true;
    try {
      const snippetUrl = `https://ontwikkel.viewer.razu.nl/snippet`;
      const query = this.searchService.queryStr;
      const response = await fetch(snippetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlBestand, q: `*${query}*` }),
      });

      if (!response.ok) {
        console.error('Failed to fetch snippet:', response.statusText);
        this.snippet = undefined;
        return;
      }

      const data = await response.json();
      this.snippet = data.html ?? undefined;
    } catch (error) {
      console.error('An error occurred while retrieving the snippet:', error);
      this.snippet = undefined;
    } finally {
      this.loading = false;
    }
  }
}
