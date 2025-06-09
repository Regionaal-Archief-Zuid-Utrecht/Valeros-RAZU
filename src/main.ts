import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import esriConfig from '@arcgis/core/config';

// Configure ArcGIS to use assets from the correct path
esriConfig.assetsPath = '/assets/arcgis';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
