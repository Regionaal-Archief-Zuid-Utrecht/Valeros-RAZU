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

    shownInTableCell = true;
    @Output() hasViewer = new EventEmitter<boolean>();
    // Loading state
    loading = false;

    // UI state
    showCopyrightInfo = false;

    // Explicitly declare data property from parent class for template access
    override data?: TypeRenderComponentInput;



    constructor(public fileRenderService: FileRenderService) {
        super();
    }

    ngOnInit(): void {

    }


    protected readonly featherHelpCircle = featherHelpCircle;
}