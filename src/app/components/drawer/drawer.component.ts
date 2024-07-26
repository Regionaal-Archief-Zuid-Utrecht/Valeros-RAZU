import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
} from '@angular/core';
import { DrawerService } from '../../services/drawer.service';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import '@ulb-darmstadt/shacl-form';
import { OriginalRecordService } from '../../services/originalrecord.service';
import { DownloadablesComponent } from '../downloadables/downloadables.component';
import { featherMeh } from '@ng-icons/feather-icons';

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
  imports: [NgIcon, NgIf, CommonModule, DownloadablesComponent],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DrawerComponent implements OnInit, OnDestroy {
  data: Data = {};
  drawerSubscription: Subscription = new Subscription();
  opened = false;

  constructor(
    private drawerService: DrawerService,
    private originalRecordService: OriginalRecordService,
  ) {}

  ngOnInit(): void {
    this.originalRecordService.dataGenerated.subscribe((data) => {
      this.data = data;
      console.log('Data at the drawer:', data);
      this.openDrawer();
    });
  }

  ngOnDestroy(): void {
    if (this.originalRecordService.dataGenerated) {
      this.originalRecordService.dataGenerated.unsubscribe();
    }
  }

  openDrawer(): void {
    this.opened = true;
  }
  protected readonly featherMeh = featherMeh;
}
