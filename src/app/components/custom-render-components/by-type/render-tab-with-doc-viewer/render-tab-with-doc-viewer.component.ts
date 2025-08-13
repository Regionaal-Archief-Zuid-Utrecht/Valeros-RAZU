import { NgIf } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TypeRenderComponent } from '../type-render-component.component';
import { TypeRenderComponentInput } from '../../../../models/type-render-component-input.model';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { featherHelpCircle } from '@ng-icons/feather-icons';
import { DocViewerComponent } from "../../../features/file-viewers/doc-viewer/doc-viewer.component";
import { FileRenderService } from '../../../../services/file-render.service';
import { NodeTableViewComponent } from "../../../features/node/node-render-components/node-table-view/node-table-view.component";
import { UrlService } from '../../../../services/url.service';
import { FileType } from '../../../../models/file-type.model';

// Register Dutch locale
registerLocaleData(localeNl);

@Component({
    selector: 'app-render-tab-with-doc-viewer',
    imports: [NgIf, DocViewerComponent, NodeTableViewComponent],
    templateUrl: './render-tab-with-doc-viewer.component.html',
    styleUrls: ['./render-tab-with-doc-viewer.component.css']
})
export class RenderTabWithDocViewerComponent extends TypeRenderComponent implements OnInit {
    // Arrays to store IDs retrieved from hop-link components
    public FileType = FileType;
    shownInTableCell = true;
    @Output() hasViewer = new EventEmitter<boolean>();
    // Loading state
    loading = false;
    buildinghistoryPDF = '';
    peoplehistoryPDF = '';

    // UI state
    showCopyrightInfo = false;

    // Explicitly declare data property from parent class for template access
    override data?: TypeRenderComponentInput;



    constructor(public fileRenderService: FileRenderService, public urlService: UrlService) {
        super();
    }
    //
    ngOnInit(): void {
        this.loading = true;
        console.log(this.data);
        const bouwgeschiedenisIri = 'https://huizenenmenseninwijk.nl/def/hemiw/bouwgeschiedenis';
        const rawUrlBuildingHistory = this.data?.node?.[bouwgeschiedenisIri]?.[0]?.value;

        if (rawUrlBuildingHistory) {
            this.urlService.proxyUrl(rawUrlBuildingHistory).then(url => {
                this.buildinghistoryPDF = url;
            });
        } else {
            console.warn('No bouwgeschiedenis URL on node:', this.data?.node);
        }
        const peoplehistoryIri = 'https://huizenenmenseninwijk.nl/def/hemiw/mensengeschiedenis';
        const rawUrlPeopleHistory = this.data?.node?.[peoplehistoryIri]?.[0]?.value;

        if (rawUrlPeopleHistory) {
            this.urlService.proxyUrl(rawUrlPeopleHistory).then(url => {
                this.peoplehistoryPDF = url;
            });
        } else {
            console.warn('No peoplehistory URL on node:', this.data?.node);
        }
        this.loading = false;
    }


    protected readonly featherHelpCircle = featherHelpCircle;
}