import { Observable, of } from 'rxjs';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Node } from 'src/app/models/node';
import { Tab } from 'src/app/models/tab';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SSSLocalService {

	constructor(@Inject(PLATFORM_ID) protected platformId: Object) { }

	checkIfExists( tabid: string, username: string ) : boolean {

        return isPlatformBrowser(this.platformId) &&
               !!localStorage.getItem( tabid ) &&
               username == "GUEST" &&
               username == tabid.split("_")[0];
    }

    flush(): void {

        if( isPlatformBrowser(this.platformId) ) { localStorage.clear(); }
    };

    removeObjByKey( id : string ): void {

        if( isPlatformBrowser(this.platformId) ) {

			localStorage.removeItem( id );

            localStorage.setItem( "lastUpdate", JSON.stringify( Date.now() ) );
		}
    }

    replacementByKey( old_id: string, new_id: string, new_obj: (Tab | Node) ): void {

        if( isPlatformBrowser(this.platformId) ) {

			localStorage.removeItem( old_id );

            localStorage.setItem( new_id, JSON.stringify( new_obj ) );

            localStorage.setItem( "lastUpdate", JSON.stringify( Date.now() ) );
        }
    }

    updateObjByKey( id: string, val: (Tab | Node | string) ): void {

        if( isPlatformBrowser(this.platformId) && !!val ) {
            localStorage.setItem(id, JSON.stringify( val ) );
            localStorage.setItem("lastUpdate", JSON.stringify( Date.now() ) );
        }
	}

    getObjByKey( id: string ): void {

        if( isPlatformBrowser(this.platformId) ) {
            return JSON.parse( localStorage.getItem(id) );
        }
	}

	restoreTree(): Observable<any> {

		return of( Object.keys(localStorage).reduce((accum, key) => {

			const obj = JSON.parse( localStorage[key] );

			accum.actions[ obj.inventory ? 1 : 0 ].payload[ key ] = obj;

			return accum;

		}, {
			actions: [
				{
					classString: "LoadFetched",
					payload: {},
					slice: "nodes",
					type: "FETCHED_POPULATE"
				}, {
					classString: "LoadFetched",
					payload: {},
					slice: "tabs",
					type: "FETCHED_POPULATE"
				}
			]
		}));
	}
}
