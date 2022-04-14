import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { Observable, timer, Subject, EMPTY } from 'rxjs';
import { retryWhen, tap, delayWhen, switchAll, catchError } from 'rxjs/operators';
import { SortData, Command, SwapData, MoveData, DeleteDataByIndex, DeleteDataById, InsertData, Tab } from '../models';
import { HttpClient } from '@angular/common/http';
import { websocketSubscribeUrl } from '../helpers/urls';
import { AppState } from '../ngrx/reducers';
import { Store, Action } from '@ngrx/store';
import { PushActions } from '../ngrx/actions/beacon.actions';
import { SSSTokenService } from './sss-token.service';
export const WS_ENDPOINT = environment.wsEndpoint;
export const RECONNECT_INTERVAL = environment.reconnectInterval;


@Injectable({
  providedIn: 'root'
})
export class SSSWebsocketService {

	private socket$: WebSocketSubject<any> | null = null;
	private messagesSubject$ = new Subject();
	private messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));

	constructor(private http: HttpClient,
				private store: Store<AppState>,
				private sssTokenService: SSSTokenService,) {

		this.messages$.pipe(
			catchError(error => { throw error }),
			tap({
				error: error => console.log('[Live Table component] Error:', error),
				complete: () => console.log('[Live Table component] Connection Closed')
			})
		).subscribe((batch: any) => {
			console.log("WEBSOCKET Message Received", batch);
			console.log("ACTION Generated", this.generateAction(batch));
			// this.store.dispatch(PushActions( { payload: batch.actions } ) );
			this.store.dispatch(PushActions( { payload: this.generateAction(batch) } ) );
		});
	}

	generateAction(inventory: Tab[]): Action[] {

		const tabAction = {
			"classString": "LoadFetched",
			"slice": "tabs",
			"type": "FETCHED_POPULATE",
			"payload": {
				"qatest-stubfarm_ALLRESOURCES_primero_master": {
					"_id" : "qatest-stubfarm_ALLRESOURCES_primero_master",
					"antes" : null,
					"despues" : null,
					inventory
				}
			}
		} as Action;

		return [ tabAction ];
	}

	async connect(cfg: { reconnect: boolean } = { reconnect: false }): Promise<void> {

		if(!this.socket$ || this.socket$.closed) {

			this.socket$ = this.getNewWebSocket();

			const messages = this.socket$.pipe(
				cfg.reconnect ? this.reconnect : o => o,
				tap({ error: error => console.log(error), }),
				catchError(_ => EMPTY)
			)

			this.messagesSubject$.next(messages);
		}
	}

	subscribeToSocket(id: string) {

		this.http.post<string>(`${websocketSubscribeUrl}/${id}/subscription/${this.sssTokenService.getToken()}`, {}).toPromise();
	}

	unSubscribeToSocket(id: string) {

		// this.http.delete(`${websocketSubscribeUrl}/${id}/subscription/${this.sssTokenService.getToken()}`, {}).toPromise();
	}

	// https://golb.hplar.ch/2020/04/rxjs-websocket.html
	// https://javascript-conference.com/blog/real-time-in-angular-a-journey-into-websocket-and-rxjs/
	// https://github.com/ralscha/blog2020/tree/master/rxjs-websocket

	private reconnect(observable: Observable<any>): Observable<any> {

		return observable.pipe(retryWhen(errors => errors.pipe(
			tap(val => console.log('[Data Service] Try to reconnect', val)),
			delayWhen(_ => timer(RECONNECT_INTERVAL))))
		);
	}

	private getNewWebSocket() {
		return webSocket({
			url: `${WS_ENDPOINT}/${this.sssTokenService.getToken()}`,
			openObserver: {
				next: () => console.log('[DataService]: connection ok')
			},
			closeObserver: {
				next: () => {
					console.log('[DataService]: connection closed');
					this.socket$ = undefined;
					this.connect({ reconnect: true });
				}
			}
		});
	}

	triggerSort(direction: boolean): void {

		const payload = new SortData( direction ? 1 : -1 );
		const command = new Command("SORT", payload);

		this.socket$.next(command);
	}


	triggerInsert(insertName: string, id: string) {

		const payload = new InsertData(insertName, id);
		const command = new Command("INSERT", payload);

		this.socket$.next(command);
	}

	triggerDeleteById(id: string) {

		const payload = new DeleteDataById(id);
		const command = new Command("DELETE_BY_ID", payload);

		this.socket$.next(command);
	}

	triggerDeleteByIndex(idx: number) {

		const payload = new DeleteDataByIndex(idx);
		const command = new Command("DELETE_BY_INDEX", payload);

		this.socket$.next(command);
	}

	triggerMove(from: number, to: number) {

		const payload = new MoveData(from, to);
		const command = new Command("MOVE", payload);

		this.socket$.next(command);
	}

	triggerSwap(indexA: number, indexB: number) {

		const payload = new SwapData(indexA, indexB);
		const command = new Command("SWAP", payload);

		this.socket$.next(command);
	}

	close(): void {
		this.socket$.complete();
		this.socket$ = undefined;
	}

	sendMessage(msg: any): void {
		this.socket$.next(msg);
	}
}
