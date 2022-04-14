import { switchMap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	pushAnonBranchUrl,
	pushAuthBranchUrl,
	fetchInstanceUrl,
	fetchExistingInstanceUrl,
	traverseUrl,
	mockInstanceUrl,
	feeedDataStoreUrl} from '../helpers/urls';
import { mock } from '../helpers/mock-instance';

@Injectable({
  providedIn: 'root'
})
export class SSSApiService {

	headerDict = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Access-Control-Allow-Headers': 'Content-Type',
	}

	requestOptions = {
		headers: new HttpHeaders(this.headerDict),
	};

	constructor(private http: HttpClient) { }

	fetchInstance( instanceid: string, argarray: Array<string> ): Observable<any> {

		// const testing_state = this.cookieService.getCookie("testing") ? this.cookieService.getCookie("testing").split("/").slice(-1)[0] : ""

		return this.http.post(traverseUrl, {
				"rootid" : "mysyllabi_application",
				"argarray" : [],
				"testing_state" : "",
				"client_date" : new Date().setHours(12,0,0,0)
				}, this.requestOptions);

		// return this.http.get('./assets/_fetch-instance.json');
		// return this.http.get('./assets/_anon_first_urlpaths.json');
	}

	fetchExistingAnonymousInstance( url: string, argarray: Array<string>, listeners: Array<string>, appid: string ): Observable<any> {

		// const payload = { argarray, listeners, appid, client_date: new Date().setHours(12,0,0,0) }

        // return this.http.post<any>( fetchExistingInstanceUrl, payload )

		return this.http.get(`./assets/${url}`)
					.pipe(
						switchMap((res: any) => {
							if(res && res.actions) { res.actions[2].payload = appid; }
							return of(res);
						})
					);
	}

	pushAnonBranch( argarray: Array<string>, listeners: Array<string>, url?: string ): Observable<any> {

		// const payload = { argarray, listeners, client_date: new Date().setHours(12,0,0,0) }

        // return this.http.post<any>( pushAnonBranchUrl, payload )

		return this.http.get(url)
	}

	pushAuthBranch( instanceid: string, argarray: Array<string>, listeners: Array<string> ) {

		const payload = { argarray, instanceid, listeners, client_date: new Date().setHours(12,0,0,0) }

        return this.http.post<any>( pushAuthBranchUrl, payload )
    }

    feedTestData( setName: string ) {

        const payload = {setName, client_date: new Date().setHours(12,0,0,0) }

        return this.http.post<any>( feeedDataStoreUrl, payload);
    }
}
