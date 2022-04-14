import { InjectData } from '../models/injectData';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SortData, InsertData, DeleteDataById, DeleteDataByIndex, MoveData, SwapData, Command, Pointer } from '../models';
import { mutationUrl } from '../helpers/urls';
import { Action } from '@ngrx/store';
import { SSSTokenService } from './sss-token.service';

@Injectable({
  providedIn: 'root'
})
export class SSSMutateService {

	constructor(private http: HttpClient,
				private sssTokenService: SSSTokenService) { }

	triggerSort(direction: boolean): Observable<any> {

		const payload 	= new SortData( direction ? 1 : -1 );
		const command 	= new Command("SORT", payload);
		const data 		= encodeURIComponent(JSON.stringify(command));

		return this.http.post<any>( `${mutationUrl}${data}`, {} );
	}

	triggerInsert(insertName: string, id: string): Observable<any> {

		const payload 	= new InsertData(insertName, id);
		const command 	= new Command("INSERT", payload);
		const data 		= encodeURIComponent(JSON.stringify(command));

		return this.http.post<any>( `${mutationUrl}${data}`, {} );
	}

	triggerInject(pointer: Pointer, idx: number, tabid: string, revision: number): Observable<any> {

		const payload 	= new InjectData(pointer, idx);
		const command 	= new Command("INJECT", payload);
		const data 		= encodeURIComponent(JSON.stringify(command));

		return this.http.post<any>( `${mutationUrl}${data}`, {} );
	}

	triggerDeleteById(id: string): Observable<any> {

		const payload 	= new DeleteDataById(id);
		const command 	= new Command("DELETE_BY_ID", payload);
		const data 		= encodeURIComponent(JSON.stringify(command));

		return this.http.post<any>( `${mutationUrl}${data}`, {} );
	}

	triggerDeleteByIndex(idx: number, tabid: string, revision: number): Observable<any> {

		const payload 	= new DeleteDataByIndex(idx);
		const command 	= new Command("DELETE_BY_INDEX", payload);
		const data 		= encodeURIComponent(JSON.stringify(command));

		return this.http.post<any>( `${mutationUrl}${data}`, {} );
	}


	triggerMove(from: number, to: number, tabid: string, revision: number): Observable<Action[]> {

		const headerDict = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Access-Control-Allow-Headers': 'Content-Type',
		}

		const requestOptions = {
			headers: new HttpHeaders(headerDict),
		};

		const payload 	= new MoveData(from, to);
		const command 	= new Command("MOVE", {...payload, revision});
		const data 		= { ...command, 'e-data': this.sssTokenService.getToken() };

		return this.http.post<Action[]>( `${mutationUrl}/${tabid}`, data );
	}

	triggerSwap(indexA: number, indexB: number): Observable<any> {

		const payload = new SwapData(indexA, indexB);
		const command = new Command("SWAP", payload);
		const data = encodeURIComponent(JSON.stringify(command));

		return this.http.post<any>( `${mutationUrl}${data}`, {} );
	}
}
