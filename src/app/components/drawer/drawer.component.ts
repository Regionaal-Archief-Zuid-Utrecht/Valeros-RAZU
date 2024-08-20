import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import '@ulb-darmstadt/shacl-form';
import { OriginalRecordService } from '../../services/originalrecord.service';
import { DownloadablesComponent } from '../downloadables/downloadables.component';
import { featherMeh } from '@ng-icons/feather-icons';
import { NodeDocumentComponent } from '../node/node-document/node-document.component';

interface Representation {
  id: string;
  label: string;
  url: string[];
}

interface Child {
  id: string;
  label: string;
  children: Child[];
  representations: Representation[];
  selected?: boolean;
  selectAssociated?: boolean;
}
interface Data {
  [key: string]: {
    label: string;
    children: Child[];
    representations: Representation[];
  };
}

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [
    NgIcon,
    NgIf,
    CommonModule,
    DownloadablesComponent,
    NodeDocumentComponent,
  ],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DrawerComponent implements OnInit, OnDestroy {
  data: Data = {};
  drawerSubscription: Subscription = new Subscription();
  opened = false;

  constructor(private originalRecordService: OriginalRecordService) {}

  ngOnInit(): void {
    this.drawerSubscription =
      this.originalRecordService.dataGenerated.subscribe((data) => {
        this.data = data;
        this.openDrawer();
      });
  }

  ngOnDestroy(): void {
    if (this.drawerSubscription) {
      this.drawerSubscription.unsubscribe();
    }
  }

  openDrawer(): void {
    this.opened = true;
  }

  closeDrawer(): void {
    this.opened = false;
  }

  protected readonly featherMeh = featherMeh;
}
