import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnChanges
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import '@ulb-darmstadt/shacl-form';
import { FetchJsonService } from '../../services/fetchjson.service';
import { NodeModel } from '../../models/node.model';
import { UrlService } from '../../services/url.service';

@Component({
  selector: 'app-original-record',
  standalone: true,
  imports: [NgIcon, NgIf, CommonModule],
  templateUrl: './original-record.component.html',
  styleUrls: ['./original-record.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OriginalRecordComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  constructor(private fetchjson: FetchJsonService, private urlservice: UrlService) {}
  
  @ViewChild('shaclForm', { static: false })
  shaclForm!: ElementRef;

  @Input() node?: NodeModel;

  drawerData: string[] = [];
  drawerSubscription: Subscription = new Subscription();

  vurl = 'http://localhost:3000/NL-WbDRAZU-G999.json';
  surl = 'http://localhost:3000/mdto-shcl.ttl';
  ssu = 'http://www.nationaalarchief.nl/mdto-shacl#InformatieobjectShape';
  vsu = 'https://test.data.razu.nl/Kasteel-Amerongen/PoC/NL-WbDRAZU-72-249';
  loading = true;

  

  ngOnInit(): void {
    this.getJson();
  }

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
  ngOnChanges(): void {
    setTimeout(() => {
      // Your if-statement code here
      if (this.shaclForm) {
        this.shaclForm.nativeElement.setAttribute('data-shape-subject', this.ssu);
        this.shaclForm.nativeElement.setAttribute('data-shapes-url', this.surl);
        this.shaclForm.nativeElement.setAttribute('data-values-url', this.vurl);
        this.shaclForm.nativeElement.setAttribute('data-values-subject', this.vsu);
      }
      this.loading = false;
    }, 1000);
  }

  openRecord(): void {
    // this.opened = true;
  }
  
  async getJson() {
    console.log(this.node);
    if (this.node ) {
      this.vsu = this.node['@id'][0]['value'];
      (await this.fetchjson.fetchJson(this.node['@id'][0]['value'], 'mdto')).subscribe((result) => {
        if (typeof result === 'string') {
          console.log(result);
          this.urlservice.getProxiedDocument(result).subscribe(
            (response) => {
              console.log(response);
              this.vurl = response.proxyUrl; // Assign the proxy URL instead of the blob URL
              console.log(this.vurl);
            })
        }
      });
    }
  }
}
