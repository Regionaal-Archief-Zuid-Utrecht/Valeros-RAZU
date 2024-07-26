import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import '@ulb-darmstadt/shacl-form';

@Component({
  selector: 'app-original-record',
  standalone: true,
  imports: [NgIcon, NgIf, CommonModule],
  templateUrl: './original-record.component.html',
  styleUrls: ['./original-record.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OriginalRecordComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('shaclForm')
  shaclForm!: ElementRef;

  drawerData: string[] = [];
  drawerSubscription: Subscription = new Subscription();
  //ssu = 'http://www.nationaalarchief.nl/mdto-shacl#PersonShape';
  //vsu = 'http://data.bibliotheken.nl/id/thes/p068842368';
  //vurl = 'http://localhost:3000/NL-WbDRAZU-G999-001-001-001.mdto.json';
  //surl = 'http://localhost:3000/mdto.shacl';
  vurl = 'http://localhost:3000/NL-WbDRAZU-G999.json';
  surl = 'http://localhost:3000/mdto-shcl.ttl';
  ssu = 'http://www.nationaalarchief.nl/mdto-shacl#InformatieobjectShape';
  vsu = 'https://test.data.razu.nl/Kasteel-Amerongen/PoC/NL-WbDRAZU-72-249';

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.shaclForm.nativeElement.setAttribute('data-shape-subject', this.ssu);
    this.shaclForm.nativeElement.setAttribute('data-shapes-url', this.surl);
    this.shaclForm.nativeElement.setAttribute('data-values-url', this.vurl);
    this.shaclForm.nativeElement.setAttribute('data-values-subject', this.vsu);
  }

  ngOnDestroy(): void {
    if (true) {
    }
  }

  openRecord(): void {
    // this.opened = true;
  }
}
