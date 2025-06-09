import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import './arcgis-styles';
import config from '@arcgis/core/config';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div #mapViewNode style="height: 100%; width: 100%;"></div>
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
export class MapComponent implements OnInit {
    @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
    loading = true;
    error = false;
    view: MapView | null = null;

    ngOnInit(): void {
        this.initializeMap();
    }

    initializeMap(): void {
        this.loading = true;
        this.error = false;

        try {
            // Configure ArcGIS to use assets from the correct path
            config.assetsPath = '/assets/arcgis';

            // Use the WebMap from the ArcGIS sidebar app
            const webmap = new WebMap({
                portalItem: {
                    id: 'f2e9b762544945f390ca4ac3671cfa72'
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
