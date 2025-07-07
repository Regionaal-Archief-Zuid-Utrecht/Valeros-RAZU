import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DetailsService } from '../../../services/details.service';
import { NodeService } from '../../../services/node/node.service';
import { SearchService } from '../../../services/search/search.service';
import { SettingsService } from '../../../services/settings.service';
import { ScrollService } from '../../../services/ui/scroll.service';
import { ViewModeService } from '../../../services/view-mode.service';
import { SearchInputComponent } from '../../features/search/search-input/search-input.component';
import { HeaderComponent } from '../../ui/header/header.component';
import { LangSwitchComponent } from '../../ui/lang-switch/lang-switch.component';
import { ViewContainerComponent } from '../view-container/view-container.component';
import { NavButtonsComponent } from "../../ui/nav-buttons/nav-buttons.component";

@Component({
  selector: 'app-home',
  imports: [
    LangSwitchComponent,
    HeaderComponent,
    SearchInputComponent,
    HeaderComponent,
    ViewContainerComponent,
    CommonModule,
    LangSwitchComponent,
    NavButtonsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  backgroundArray = ['assets/img/backgrounds/001.jpg', 'assets/img/backgrounds/002.jpg', 'assets/img/backgrounds/003.jpg', 'assets/img/backgrounds/004.jpg'];
  backgroundImageUrl = "";
  constructor(
    public search: SearchService,
    public viewModes: ViewModeService,
    public router: Router,
    public nodes: NodeService,
    public scroll: ScrollService,
    public details: DetailsService,
    public settings: SettingsService,
  ) { }

  ngOnInit() {
    this.backgroundImageUrl = this.backgroundArray[Math.floor(Math.random() * this.backgroundArray.length)];
  }

  ngAfterViewInit() { }
}
