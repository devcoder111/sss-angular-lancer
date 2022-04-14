import { Injectable, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class SSSCookieService {

	constructor(@Optional() @Inject('requestObj')  protected requestObj    : any,
				@Inject(PLATFORM_ID)               protected platformId    : Object) { }

    setGuestUserCookie() {

		this.setUserCookie({
                            _id     : "GUEST",
                            email   : null,
                            level   : "user",
                            token   : null
                        });
    }

    setUserCookie( userObj ) {

        this.setCookie("token", userObj.token, 5);
        this.setCookie("_id", userObj._id, 5);
        this.setCookie("level", userObj.level, 5);
        this.setCookie("email", userObj.email, 5);
    }

	getCookie( name: string ) {

        if( !isPlatformBrowser(this.platformId) ) {

            return this.requestObj.cookies[ name ];

        } else {

            let ca: Array<string> = document.cookie.split(';');
            let caLen: number     = ca.length;
            let cookieName        = `${name}=`;
            let c: string;

            for (let i: number = 0; i < caLen; i += 1) {

                c = ca[i].replace(/^\s+/g, '');

                if (c.indexOf(cookieName) == 0) { return c.substring(cookieName.length, c.length); }
            }

            return '';
        }
    }

    setCookie( name: string, value: string, expireDays: number, path: string = '' ){

        let d:Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        let expires:string = `expires=${d.toUTCString()}`;
        let cpath:string = path ? `; path=${path}` : '';
        let datestring = new String( d.toUTCString() );
        document.cookie = `${name}=${value}; ${expires}${cpath}`;
    }

	removeCookie(name) { this.setCookie(name, '', 6); }

    flush(): void {

		var cookies = document.cookie.split(";");

		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf("=");
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	}
}
