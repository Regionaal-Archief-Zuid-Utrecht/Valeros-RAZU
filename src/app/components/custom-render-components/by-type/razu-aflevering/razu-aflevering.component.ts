import { JsonPipe, NgFor, NgIf, DatePipe } from '@angular/common';
import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { TypeRenderComponent } from '../type-render-component.component';
import { HopLinkComponent } from '../../../features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { HopLinkSettings } from '../../../../models/settings/hop-link-settings.model';
import { TypeRenderComponentInput } from '../../../../models/type-render-component-input.model';
import { SparqlService } from '../../../../services/sparql.service';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { featherHelpCircle } from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';

// Register Dutch locale
registerLocaleData(localeNl);

@Component({
    selector: 'app-razu-aflevering',
    imports: [JsonPipe, NgIf, NgFor, HopLinkComponent, DatePipe, NgIcon],
    templateUrl: './razu-aflevering.component.html',
    styleUrls: ['./razu-aflevering.component.css']
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
    copyrightNoticeMap: Map<string, string[]> = new Map();
    noteMap: Map<string, string[]> = new Map();
    beperkingGebruikTypeMap: Map<string, string[]> = new Map();
    beperkingGebruikTermijnMap: Map<string, string[]> = new Map();
    copyrightNoteMap: Map<string, string[]> = new Map();
    termijnEinddatumMap: Map<string, string> = new Map();
    hasBeginDate = false;
    hasEndDate = false;
    hasType = false;

    // Loading state
    loading = false;

    // UI state
    showCopyrightInfo = false;

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
        preds: ['https://data.razu.nl/def/ldto/beperkingGebruikType', 'http://schema.org/copyrightNotice'],
        showHops: false,
        showOriginalLink: false
    };

    noteSettings: HopLinkSettings = {
        preds: ['https://data.razu.nl/def/ldto/beperkingGebruikType', 'http://www.w3.org/2004/02/skos/core#note'],
        showHops: false,
        showOriginalLink: false
    };

    constructor(private sparqlService: SparqlService) {
        super();
    }

    ngOnInit(): void {
        // Fetch onderdeelVanIds directly in the component
        if (this.data?.node?.['@id']?.[0]?.value) {
            this.loading = true;

            // Create a Promise array for all data fetching
            const allPromises: Promise<any>[] = [];

            // Fetch onderdeelVanIds and related data
            const onderdeelVanPromise = this.sparqlService
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
                });

            allPromises.push(onderdeelVanPromise);

            // Fetch beperkingGebruikIds and related data
            const beperkingGebruikPromise = this.sparqlService
                .getObjIds(
                    this.data.node['@id'][0].value,
                    this.beperkingGebruikSettings.preds
                )
                .then(ids => {
                    this.beperkingGebruikIds = ids;
                    console.log("Found beperkingGebruikIds:", ids);

                    // Create an array of promises for all data fetching
                    const promises: Promise<void>[] = [];

                    // Fetch data for each beperkingGebruikId
                    ids.forEach(id => {
                        // get copyrightNotice
                        const copyrightNoticePromise = this.sparqlService
                            .getObjIds(id, this.copyrightNoticeSettings.preds)
                            .then(copyrightNoticeIds => {
                                if (copyrightNoticeIds.length > 0) {
                                    console.log(`Found copyright notices for ${id}:`, copyrightNoticeIds);
                                    this.copyrightNoticeMap.set(id, copyrightNoticeIds);
                                }
                            });
                        promises.push(copyrightNoticePromise);

                        const copyrightNotePromise = this.sparqlService
                            .getObjIds(id, this.noteSettings.preds)
                            .then(noteIds => {
                                if (noteIds.length > 0) {
                                    console.log(`Found notes for ${id}:`, noteIds);
                                    this.copyrightNoteMap.set(id, noteIds);
                                }
                            });
                        promises.push(copyrightNotePromise);

                        const beperkingGebruikTypePromise = this.sparqlService
                            .getObjIds(id, ["https://data.razu.nl/def/ldto/beperkingGebruikType"])
                            .then(typeIds => {
                                if (typeIds.length > 0) {
                                    console.log(`Found types for ${id}:`, typeIds);
                                    this.beperkingGebruikTypeMap.set(id, typeIds);
                                }
                            });
                        promises.push(beperkingGebruikTypePromise);

                        const beperkingGebruikTermijnPromise = this.sparqlService
                            .getObjIds(id, ["https://data.razu.nl/def/ldto/beperkingGebruikTermijn"])
                            .then(termijnIds => {
                                if (termijnIds.length > 0) {
                                    this.beperkingGebruikTermijnMap.set(id, termijnIds);
                                    termijnIds.forEach(termijnId => {
                                        const termijnEinddatumPromise = this.sparqlService
                                            .getObjIds(termijnId, ["https://data.razu.nl/def/ldto/termijnEinddatum"])
                                            .then(dateIds => {
                                                if (dateIds.length > 0) {
                                                    this.termijnEinddatumMap.set(termijnId, dateIds[0]);
                                                }
                                            });
                                    });
                                }
                            });
                        promises.push(beperkingGebruikTermijnPromise);
                    });

                    return Promise.all(promises);
                });

            allPromises.push(beperkingGebruikPromise);

            // Wait for all promises to complete
            Promise.all(allPromises)
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    this.loading = false;
                    console.log("Final data:");
                    console.log("beperkingGebruikIds", this.beperkingGebruikIds);
                    console.log("copyrightNoticeMap", this.copyrightNoticeMap);
                    console.log("copyrightNoteMap", this.copyrightNoteMap);
                    console.log("beperkingGebruikTypeMap", this.beperkingGebruikTypeMap);
                    console.log("beperkingGebruikTermijnMap", this.beperkingGebruikTermijnMap);
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

    getTermijnEinddatum(termijnId: string): string {
        return this.termijnEinddatumMap.get(termijnId) || '';
    }
    protected readonly featherHelpCircle = featherHelpCircle;
}