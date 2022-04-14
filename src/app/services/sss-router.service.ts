import { SSSAccountService } from './sss-account.service';
import { getAppNodeId, getUrl } from 'src/app/ngrx/selectors/graph.selector';
import { SSSListenerService } from './sss-listener.service';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'
import { switchMap, first } from 'rxjs/operators';
import { SSSCookieService } from './sss-cookie.service';
import { SSSApiService } from './sss-api.service';
import { of, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../ngrx/reducers';
import { PushActions } from '../ngrx/actions/beacon.actions';

@Injectable({
  providedIn: 'root'
})
export class SSSRouterService {

	previous			: string;
    url_subscription$	: Observable<string>;

  	constructor(@Inject(PLATFORM_ID) 	protected platformId: Object,
										private sssCookieService: SSSCookieService,
										private sssApiService: SSSApiService,
										private store: Store<AppState>,
										private sssListenerService: SSSListenerService,
										private sssAccountService: SSSAccountService) {

        if( isPlatformBrowser(this.platformId) ) {

            this.url_subscription$ = this.store.select( getUrl );

            this.url_subscription$.pipe(
				switchMap((url: string) => this.handleUrlChange(url))
			).subscribe( batch => {
				this.store.dispatch(PushActions( { payload: batch.actions } ) )
             });
		}
	}

	handleUrlChange( url: string ): Observable<any> {

		const empty 	=  url == '';
		const rerun 	=  this.previous == url;
		const auth 		=  this.sssAccountService.determineIfLoggedIn();
		const anon 		= !this.sssAccountService.determineIfLoggedIn();

		const argarray 	=  [url]; // url.split('/').slice(1)
        const cookie 	=  this.sssCookieService.getCookie("listeners");
        const listeners =  cookie ? JSON.parse( cookie ) : {};

		this.previous   =  url;

		switch(true) {

			case empty 	:  return of();
			case rerun 	:  return of();
			case auth 	:  return this.handleAuth( argarray, listeners );
			case anon 	:  return this.handleAnon( argarray, listeners );
		}
	}

	handleAuth( instantiations: string[], listeners: Array<string> ): Observable<any> {

		return this.store.pipe(
			first(),
			select(getAppNodeId),
			switchMap(appId => {

				listeners = this.sssListenerService.decorate( listeners );

				return this.sssApiService.pushAuthBranch( appId, instantiations, listeners );
			})
		);
	}

	handleAnon( instantiations: string[], listeners: Array<string> ): Observable<any> {

		let url;

		switch(instantiations[0]) {
			case "GUEST_sister-history"					: url = './assets/_anon-following-click-timeline-comandeered.json'; 	break;
			case "sister-history"						: url = './assets/_anon-following-click-timeline.json'; 				break;
			case "GUEST_language-arts" 					: url = './assets/_anon-following-click-multiple-comandeered.json';		break;
			case "language-arts"						: url = './assets/_anon-following-click-multiple.json';					break;
			case "GUEST_special-education-resources" 	: url = './assets/_anon-following-click-comandeered.json'; 				break;
			default 									: url = './assets/_anon-following-click.json'; 							break;
		}

		return this.sssApiService.pushAnonBranch( instantiations, listeners, url);

		// return this.sssApiService.pushAnonBranch( instantiations, listeners );
	}
}
