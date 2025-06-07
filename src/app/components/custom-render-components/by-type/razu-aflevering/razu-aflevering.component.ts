import { JsonPipe, NgFor, NgIf, DatePipe, registerLocaleData } from '@angular/common';
import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { TypeRenderComponent } from '../type-render-component.component';
import { HopLinkComponent } from '../../../features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { HopLinkSettings } from '../../../../models/settings/hop-link-settings.model';
import { TypeRenderComponentInput } from '../../../../models/type-render-component-input.model';
import { SparqlService } from '../../../../services/sparql.service';
import localeNl from '@angular/common/locales/nl';

// Register Dutch locale
registerLocaleData(localeNl);

@Component({
    selector: 'app-razu-aflevering',
    standalone: true,
    imports: [JsonPipe, NgIf, NgFor, HopLinkComponent, DatePipe],
    templateUrl: './razu-aflevering.component.html',
    styleUrls: ['./razu-aflevering.component.scss'],
})
export class RazuAfleveringComponent extends TypeRenderComponent implements OnInit {
    // Arrays to store IDs retrieved from hop-link components
    onderdeelVanIds: string[] = [];
    beperkingGebruikIds: string[] = [];
    dekkingInTijdIds: string[] = [];
    // Map to store dekkingInRuimteIds for each onderdeelVanId
    dekkingInRuimteMap: Map<string, string[]> = new Map();
    // Maps to store begin and end dates for each onderdeelVanId
    beginDateMap: Map<string, string> = new Map();
    endDateMap: Map<string, string> = new Map();
    hasBeginDate = false;
    hasEndDate = false;
    hasType = false;

    // Loading state
    loading = false;

    // Explicitly declare data property from parent class for template access
    override data?: TypeRenderComponentInput;

    // Hop settings for isOnderdeelVan
    onderdeelVanSettings: HopLinkSettings = {
        preds: ['https://data.razu.nl/def/ldto/isOnderdeelVan'],
        showHops: false,
        showOriginalLink: false
    };

    // Hop settings for beperkingGebruik
    beperkingGebruikSettings: HopLinkSettings = {
        preds: ['https://data.razu.nl/def/ldto/beperkingGebruik'],
        showHops: false,
        showOriginalLink: false
    };

    // Hop settings for related properties
    naamSettings: HopLinkSettings = {
        preds: ['https://data.razu.nl/def/ldto/naam'],
        showHops: false,
        showOriginalLink: false
    };

    dekkingInRuimteSettings: HopLinkSettings = {
        preds: ['https://data.razu.nl/def/ldto/dekkingInRuimte'],
        showHops: false,
        showOriginalLink: false
    };

    beginDateSettings: HopLinkSettings = {
        preds: ['https://data.razu.nl/def/ldto/dekkingInTijd', 'https://data.razu.nl/def/ldto/dekkingInTijdBeginDatum'],
        showHops: false,
        showOriginalLink: false
    };

    endDateSettings: HopLinkSettings = {
        preds: ['https://data.razu.nl/def/ldto/dekkingInTijd', 'https://data.razu.nl/def/ldto/dekkingInTijdEindDatum'],
        showHops: false,
        showOriginalLink: false
    };

    omschrijvingSettings: HopLinkSettings = {
        preds: ['https://data.razu.nl/def/ldto/omschrijving'],
        showHops: false,
        showOriginalLink: false
    };

    prefLabelSettings: HopLinkSettings = {
        preds: ['http://www.w3.org/2004/02/skos/core#prefLabel'],
        showHops: false,
        showOriginalLink: false
    };

    copyrightNoticeSettings: HopLinkSettings = {
        preds: ['http://schema.org/copyrightNotice'],
        showHops: false,
        showOriginalLink: false
    };

    noteSettings: HopLinkSettings = {
        preds: ['http://www.w3.org/2004/02/skos/core#note'],
        showHops: false,
        showOriginalLink: false
    };

    constructor(private sparqlService: SparqlService, @Inject(LOCALE_ID) private locale: string) {
        super();
    }

    ngOnInit(): void {
        // Fetch onderdeelVanIds directly in the component
        if (this.data?.node?.['@id']?.[0]?.value) {
            this.loading = true;
            this.sparqlService
                .getObjIds(
                    this.data.node['@id'][0].value,
                    this.onderdeelVanSettings.preds
                )
                .then(ids => {
                    this.onderdeelVanIds = ids;

                    // Create an array of promises for all data fetching
                    const promises: Promise<void>[] = [];

                    // Fetch dekkingInRuimteIds for each onderdeelVanId
                    ids.forEach(id => {
                        // Get dekkingInRuimte data
                        const ruimtePromise = this.sparqlService
                            .getObjIds(id, this.dekkingInRuimteSettings.preds)
                            .then(ruimteIds => {
                                this.dekkingInRuimteMap.set(id, ruimteIds);
                            });
                        promises.push(ruimtePromise);

                        // Get begin date data
                        const beginDatePromise = this.sparqlService
                            .getObjIds(id, this.beginDateSettings.preds)
                            .then(dateIds => {
                                if (dateIds.length > 0) {
                                    this.beginDateMap.set(id, dateIds[0]);
                                }
                            });
                        promises.push(beginDatePromise);

                        // Get end date data
                        const endDatePromise = this.sparqlService
                            .getObjIds(id, this.endDateSettings.preds)
                            .then(dateIds => {
                                if (dateIds.length > 0) {
                                    this.endDateMap.set(id, dateIds[0]);
                                }
                            });
                        promises.push(endDatePromise);
                    });

                    return Promise.all(promises);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }

    // Helper method to get labels for dekkingInRuimteIds
    getDekkingInRuimteIds(onderdeelVanId: string): string[] {
        return this.dekkingInRuimteMap.get(onderdeelVanId) || [];
    }

    // Helper methods for date handling
    hasBeginDateForId(onderdeelVanId: string): boolean {
        return this.beginDateMap.has(onderdeelVanId);
    }

    hasEndDateForId(onderdeelVanId: string): boolean {
        return this.endDateMap.has(onderdeelVanId);
    }

    getBeginDate(onderdeelVanId: string): string {
        return this.beginDateMap.get(onderdeelVanId) || '';
    }

    getEndDate(onderdeelVanId: string): string {
        return this.endDateMap.get(onderdeelVanId) || '';
    }
}