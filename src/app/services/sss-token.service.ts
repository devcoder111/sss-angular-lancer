import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { tokenUrl } from '../helpers/urls';

@Injectable({
  providedIn: 'root'
})
export class SSSTokenService {

	token: string;

	constructor(private http: HttpClient) { }

	setToken(): Observable<string> {

		const headerDict = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Access-Control-Allow-Headers': 'Content-Type',
		}

		return this.http.get(tokenUrl, {
			headers: new HttpHeaders(headerDict),
			responseType: 'text'
		}).pipe(
			tap(token => console.log(token)),
			tap(token => this.token = token)
		);
	}

	getToken(): string {
		return this.token;
	}
}
