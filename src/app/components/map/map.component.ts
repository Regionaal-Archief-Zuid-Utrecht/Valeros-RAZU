import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import config from '@arcgis/core/config';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';
import esriConfig from '@arcgis/core/config';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div #mapViewNode style="height: 100vh; width: 100vw; position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></div>
        <div *ngIf="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <div class="loading-text">Kaart laden...</div>
        </div>
        <div *ngIf="error" class="error-overlay">
            <div class="error-message">
                Er is een fout opgetreden bij het laden van de kaart.
                <button (click)="initializeMap()">Opnieuw proberen</button>
            </div>
        </div>
    `,
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
    @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
    loading = true;
    error = false;
    view: MapView | null = null;

    ngOnInit(): void {
        // Load the ArcGIS CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://js.arcgis.com/4.28/esri/themes/light/main.css';
        document.head.appendChild(link);

        this.initializeMap();
    }

    ngOnDestroy(): void {
        if (this.view) {
            // Destroy the map view when the component is destroyed
            this.view.destroy();
        }
    }

    initializeMap(): void {
        this.loading = true;
        this.error = false;

        try {
            // Configure ArcGIS to use assets from the correct path
            esriConfig.assetsPath = '/assets/arcgis';

            // Use the WebMap from the ArcGIS sidebar app
            const webmap = new WebMap({
                portalItem: {
                    id: 'e18c7c66b3da441199d5b3334890016a'
                }
            });

            // Create a map view with the web map
            this.view = new MapView({
                container: this.mapViewEl.nativeElement,
                map: webmap,
                padding: {
                    top: 50,
                    bottom: 0
                }
            });

            // When the view is ready, hide the loading indicator
            this.view.when(() => {
                this.loading = false;
                console.log('Map loaded successfully');

                // Make sure view is not null before adding widgets
                if (this.view) {

                    // Add Legend widget in an Expand container
                    const legend = new Legend({
                        view: this.view
                    });

                    const legendExpand = new Expand({
                        view: this.view,
                        content: legend,
                        expanded: false,
                        expandIcon: "legend-right",
                        expandTooltip: "Legenda"
                    });

                    // Add the widgets to the bottom-right corner of the view
                    this.view.ui.add(legendExpand, "bottom-right");

                    // Move zoom buttons to bottom-right
                    this.view.ui.move(["zoom"], "bottom-right");
                }
            }, (error: any) => {
                console.error('Error loading map:', error);
                this.loading = false;
                this.error = true;
            });
        } catch (err) {
            console.error('Error initializing map:', err);
            this.loading = false;
            this.error = true;
        }
    }
}
