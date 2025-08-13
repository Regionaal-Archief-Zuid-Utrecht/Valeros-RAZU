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
    selector: 'app-hemiw-story',
    imports: [NgIf, DocViewerComponent, NodeTableViewComponent],
    templateUrl: './hemiw-story.component.html',
    styleUrls: ['./hemiw-story.component.css']
})
export class HemiwStoryComponent extends TypeRenderComponent implements OnInit {
    // Arrays to store IDs retrieved from hop-link components
    public FileType = FileType;
    shownInTableCell = true;
    @Output() hasViewer = new EventEmitter<boolean>();
    // Loading state
    loading = false;
    documentUrl = '';

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

        const documentUrl = this.data?.node?.['@id']?.[0]?.value;

        if (documentUrl) {
            this.urlService.proxyUrl(documentUrl).then(url => {
                this.documentUrl = url;
            });
        } else {
            console.warn('No document URL on node:', this.data?.node);
        }
        this.loading = false;
    }


    protected readonly featherHelpCircle = featherHelpCircle;
}