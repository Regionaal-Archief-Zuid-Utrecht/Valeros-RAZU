import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TypeRenderComponent } from '../type-render-component.component';
import { HopLinkComponent } from '../../../features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { LdtoDekkingInTijdComponent } from '../../../custom-render-components/by-predicate/ldto-dekking-in-tijd/ldto-dekking-in-tijd.component';
import { HopLinkSettings } from '../../../../models/settings/hop-link-settings.model';
import { TypeRenderComponentInput } from '../../../../models/type-render-component-input.model';

@Component({
    selector: 'app-razu-aflevering',
    standalone: true,
    imports: [JsonPipe, NgIf, NgFor, HopLinkComponent, LdtoDekkingInTijdComponent],
    templateUrl: './razu-aflevering.component.html',
    styleUrls: ['./razu-aflevering.component.scss'],
})
export class RazuAfleveringComponent extends TypeRenderComponent implements OnInit {
    // Arrays to store IDs retrieved from hop-link components
    onderdeelVanIds: string[] = [];
    beperkingGebruikIds: string[] = [];
    dekkingInTijdIds: string[] = [];
    dekkingInRuimteIds: string[] = [];
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

    constructor() {
        super();
    }

    ngOnInit(): void {
        // No initialization needed as the hop-link components will handle data fetching
    }
}