import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { RoutingService } from '../../../services/routing.service';
import { Subscription } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import {
    featherHome,
    featherMap,
    featherBook,
    featherInfo,
    featherNavigation,
    featherUsers
} from '@ng-icons/feather-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

interface NavButton {
    label: string;
    icon: any; // feather icon reference
    route: string | { path: string, queryParams?: any };
}

@Component({
    selector: 'app-nav-buttons',
    imports: [CommonModule, RouterModule, NgIcon, TranslatePipe],
    templateUrl: './nav-buttons.component.html',
    styleUrls: ['./nav-buttons.component.css']
})
export class NavButtonsComponent implements OnInit, OnDestroy {
    private static DEBUG = false;

    constructor(private router: Router, private routing: RoutingService, private translate: TranslateService) {
        if (NavButtonsComponent.DEBUG) {
            console.log('[NavButtonsComponent] constructed');
        }
    }

    @Input() layout: 'center-grid' | 'bottom-tabs' | undefined;

    topButtons: NavButton[] = [];
    middleButtons: NavButton[] = [];
    bottomButtons: NavButton[] = [];

    // These are the single grid buttons
    buttons: NavButton[] = [
        // { label: 'Onderzochte panden', icon: featherSearch, route: '/onderzochte-panden' },
        // {
        //     label: 'Alle panden', icon: featherHome, route: {
        //         path: '/search',
        //         queryParams: {
        //             filters: JSON.stringify({
        //                 type: {
        //                     type: 2,
        //                     fieldIds: ['type'],
        //                     valueIds: ['https://w3id.org/italia/onto/CLV/Address']
        //                 }
        //             }),
        //             q: ''
        //         }
        //     }
        // },
        // {
        //     label: 'Alle straten', icon: featherNavigation, route: {
        //         path: '/search',
        //         queryParams: {
        //             filters: JSON.stringify({
        //                 type: {
        //                     type: 2,
        //                     fieldIds: ['type'],
        //                     valueIds: ['https://w3id.org/italia/onto/CLV/StreetToponym']
        //                 }
        //             }),
        //             q: ''
        //         }
        //     }
        // },

        // { label: 'Kaart', icon: featherMap, route: '/map' },
        // {
        //     label: 'Verhalen', icon: featherBook, route: {
        //         path: '/search',
        //         queryParams: {
        //             filters: JSON.stringify({
        //                 type: {
        //                     type: 2,
        //                     fieldIds: ['type'],
        //                     valueIds: ['https://schema.org/CreativeWork']
        //                 }
        //             }),
        //             q: ''
        //         }
        //     }
        // },
        // { label: 'Over', icon: featherInfo, route: '/colofon' },
        // { label: 'Contact', icon: featherMail, route: '/contact' },
        // {
        //     label: 'Referenties', icon: featherStar, route: {
        //         path: '/search',
        //         queryParams: {
        //             filters: JSON.stringify({
        //                 type: {
        //                     type: 2,
        //                     fieldIds: ['type'],
        //                     valueIds: ['https://schema.org/ArchiveComponent']
        //                 }
        //             }),
        //             q: ''
        //         }
        //     },
        // }
    ];

    private routeSub?: Subscription;

    debugRoute(btn: NavButton) {
        if (NavButtonsComponent.DEBUG) {
            console.log('[NavButtonsComponent] Navigating with route:', btn.route);
        }
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

        this.translate.get([
            'hemiw-theme.stories',
            'hemiw-theme.all_buildings',
            'hemiw-theme.all_streets',
            'hemiw-theme.all_people',
            'hemiw-theme.about_and_contact'
        ]).subscribe(translations => {
            this.topButtons = [
                { label: 'Kaart', icon: featherMap, route: '/map' },
                {
                    label: translations['hemiw-theme.stories'], icon: featherBook, route: {
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
            ];
            this.middleButtons = [
                {
                    label: translations['hemiw-theme.all_buildings'], icon: featherHome, route: {
                        path: '/search',
                        queryParams: {
                            filters: JSON.stringify({
                                type: {
                                    type: 2,
                                    fieldIds: ['type'],
                                    valueIds: ['https://w3id.org/italia/onto/CLV/Address']
                                }
                            }),
                            q: ''
                        }
                    }
                },
                {
                    label: translations['hemiw-theme.all_streets'], icon: featherNavigation, route: {
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
                {
                    label: translations['hemiw-theme.all_people'], icon: featherUsers, route: {
                        path: '/search',
                        queryParams: {
                            filters: JSON.stringify({
                                type: {
                                    type: 2,
                                    fieldIds: ['type'],
                                    valueIds: ['https://personsincontext.org/model#PersonObservation']
                                }
                            }),
                            q: ''
                        }
                    }
                },
            ];
            this.bottomButtons = [
                { label: translations['hemiw-theme.about_and_contact'], icon: featherInfo, route: '/colofon' },
            ];
        });

        if (NavButtonsComponent.DEBUG) {
            console.log('[NavButtonsComponent] button routes:', this.buttons.map(b => b.route));
        }
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

}
