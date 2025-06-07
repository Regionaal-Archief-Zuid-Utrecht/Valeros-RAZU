import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TypeRenderComponent } from '../type-render-component.component';
import { SparqlService } from '../../../../services/sparql.service';
import { NodeService } from '../../../../services/node/node.service';
import { HopLinkComponent } from '../../../features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { NodeModel } from '../../../../models/node.model';
import { HopLinkSettings } from '../../../../models/settings/hop-link-settings.model';
import { LdtoDekkingInTijdComponent } from '../../../custom-render-components/by-predicate/ldto-dekking-in-tijd/ldto-dekking-in-tijd.component';

interface RelatedData {
    id: string;
    naam?: string;
    dekkingInRuimte?: string;
    omschrijving?: string;
}

interface BeperkingGebruik {
    id: string;
    prefLabel?: string;
    copyrightNotice?: string;
    note?: string;
}

@Component({
    selector: 'app-razu-aflevering',
    standalone: true,
    imports: [JsonPipe, NgIf, NgFor, HopLinkComponent, LdtoDekkingInTijdComponent],
    templateUrl: './razu-aflevering.component.html',
    styleUrls: ['./razu-aflevering.component.scss'],
})
export class RazuAfleveringComponent
    extends TypeRenderComponent
    implements OnInit {

    // Related data
    onderdeelVanIds: string[] = [];
    relatedData: RelatedData[] = [];

    // Beperking gebruik data
    beperkingGebruikIds: string[] = [];
    beperkingGebruikData: BeperkingGebruik[] = [];

    loading = false;

    constructor(
        private sparql: SparqlService,
        private nodeService: NodeService
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.data?.node) {
            this.initRelatedData();
        }
    }

    async initRelatedData(): Promise<void> {
        this.loading = true;

        // Get isOnderdeelVan IDs
        this.onderdeelVanIds = this.nodeService.getObjValues(
            this.data?.node,
            ['https://data.razu.nl/def/ldto/isOnderdeelVan']
        );

        // Get beperkingGebruik IDs
        this.beperkingGebruikIds = this.nodeService.getObjValues(
            this.data?.node,
            ['https://data.razu.nl/def/ldto/beperkingGebruik']
        );

        // Fetch related data for isOnderdeelVan
        if (this.onderdeelVanIds.length > 0) {
            await this.fetchOnderdeelVanData();
        }

        // Fetch related data for beperkingGebruik
        if (this.beperkingGebruikIds.length > 0) {
            await this.fetchBeperkingGebruikData();
        }

        this.loading = false;
    }

    async fetchOnderdeelVanData(): Promise<void> {
        const promises = this.onderdeelVanIds.map(async (id) => {
            const relatedItem: RelatedData = { id };

            // Get naam
            const naamIds = await this.sparql.getObjIds(id, ['https://data.razu.nl/def/ldto/naam']);
            if (naamIds.length > 0) {
                const nodeData = await this.sparql.getNode(naamIds[0]);
                const literals = this.nodeService.getObjValues(nodeData, ['http://www.w3.org/1999/02/22-rdf-syntax-ns#value']);
                if (literals.length > 0) {
                    relatedItem.naam = literals[0];
                }
            }

            // Get dekkingInRuimte
            const dekkingInRuimteIds = await this.sparql.getObjIds(id, ['https://data.razu.nl/def/ldto/dekkingInRuimte']);
            if (dekkingInRuimteIds.length > 0) {
                const nodeData = await this.sparql.getNode(dekkingInRuimteIds[0]);
                const literals = this.nodeService.getObjValues(nodeData, ['http://www.w3.org/1999/02/22-rdf-syntax-ns#value']);
                if (literals.length > 0) {
                    relatedItem.dekkingInRuimte = literals[0];
                }
            }

            // Get omschrijving
            const omschrijvingIds = await this.sparql.getObjIds(id, ['https://data.razu.nl/def/ldto/omschrijving']);
            if (omschrijvingIds.length > 0) {
                const nodeData = await this.sparql.getNode(omschrijvingIds[0]);
                const literals = this.nodeService.getObjValues(nodeData, ['http://www.w3.org/1999/02/22-rdf-syntax-ns#value']);
                if (literals.length > 0) {
                    relatedItem.omschrijving = literals[0];
                }
            }

            return relatedItem;
        });

        this.relatedData = await Promise.all(promises);
    }

    async fetchBeperkingGebruikData(): Promise<void> {
        const promises = this.beperkingGebruikIds.map(async (id) => {
            const beperkingItem: BeperkingGebruik = { id };

            // Get prefLabel
            const prefLabelIds = await this.sparql.getObjIds(id, ['http://www.w3.org/2004/02/skos/core#prefLabel']);
            if (prefLabelIds.length > 0) {
                beperkingItem.prefLabel = prefLabelIds[0];
            }

            // Get copyrightNotice
            const copyrightIds = await this.sparql.getObjIds(id, ['http://schema.org/copyrightNotice']);
            if (copyrightIds.length > 0) {
                beperkingItem.copyrightNotice = copyrightIds[0];
            }

            // Get note
            const noteIds = await this.sparql.getObjIds(id, ['http://www.w3.org/2004/02/skos/core#note']);
            if (noteIds.length > 0) {
                beperkingItem.note = noteIds[0];
            }

            return beperkingItem;
        });

        this.beperkingGebruikData = await Promise.all(promises);
    }
}