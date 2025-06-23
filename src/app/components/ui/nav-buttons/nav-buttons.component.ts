import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { RoutingService } from '../../../services/routing.service';
import { Subscription } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import {
    featherSearch,
    featherHome,
    featherMap,
    featherBook,
    featherInfo,
    featherMail,
    featherStar,
    featherNavigation,
    featherUsers
} from '@ng-icons/feather-icons';

interface NavButton {
    label: string;
    icon: any; // feather icon reference
    route: string | { path: string, queryParams?: any };
}

@Component({
    selector: 'razu-nav-buttons',
    standalone: true,
    imports: [CommonModule, RouterModule, NgIcon],
    templateUrl: './nav-buttons.component.html',
    styleUrls: ['./nav-buttons.component.scss']
})
export class NavButtonsComponent implements OnInit, OnDestroy {
    constructor(private router: Router, private routing: RoutingService) {
        console.log('[NavButtonsComponent] constructed');
    }

    @Input() layout: 'center-grid' | 'bottom-tabs' | undefined;

    buttons: NavButton[] = [
        { label: 'Onderzochte panden', icon: featherSearch, route: '/onderzochte-panden' },
        {
            label: 'Alle panden', icon: featherHome, route: {
                path: '/search',
                queryParams: {
                    filters: JSON.stringify({
                        type: {
                            type: 2,
                            fieldIds: ['type'],
                            valueIds: ['https://w3id.org/italia/onto/CLV/Feature']
                        }
                    }),
                    q: ''
                }
            }
        },
        {
            label: 'Alle straten', icon: featherNavigation, route: {
                path: '/search',
                queryParams: {
                    filters: JSON.stringify({
                        type: {
                            type: 2,
                            fieldIds: ['type'],
                            valueIds: ['https://w3id.org/italia/onto/CLV/StreetToponym']
                        }
                    }),
                    q: ''
                }
            }
        },

        { label: 'Kaart', icon: featherMap, route: '/map' },
        {
            label: 'Verhalen', icon: featherBook, route: {
                path: '/search',
                queryParams: {
                    filters: JSON.stringify({
                        type: {
                            type: 2,
                            fieldIds: ['type'],
                            valueIds: ['https://schema.org/CreativeWork']
                        }
                    }),
                    q: ''
                }
            }
        },
        { label: 'Over', icon: featherInfo, route: '/colofon' },
        { label: 'Contact', icon: featherMail, route: '/contact' },
        { label: 'Referenties', icon: featherStar, route: '/referenties' },
    ];

    private routeSub?: Subscription;

    debugRoute(btn: NavButton) {
        console.log('[NavButtonsComponent] Navigating with route:', btn.route);
    }

    isRouteObject(route: any): route is { path: string, queryParams?: any } {
        return typeof route === 'object' && route !== null && 'path' in route;
    }

    ngOnInit() {
        this.setLayout(this.router.url);
        this.routeSub = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.setLayout(event.urlAfterRedirects || event.url);
            }
        });
        console.log('[NavButtonsComponent] button routes:', this.buttons.map(b => b.route));
    }

    ngOnDestroy() {
        this.routeSub?.unsubscribe();
    }

    private setLayout(url: string) {
        // Home page is '/', or you can adapt if needed
        if (this.layout === undefined) {
            this.layout = (url === '/' || url.startsWith('/home')) ? 'center-grid' : 'bottom-tabs';
        }
    }

    navigate(route: string) {
        // Special case for Verhalen
        if (route === '/verhalen') {
            this.router.navigateByUrl('/search?filters=%7B%7D&q=');
        } else {
            this.router.navigate([route]);
        }
    }
}
