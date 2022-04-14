import { SSSSelectorService } from 'src/app/services/sss-selector.service';
import { getListeners } from './../selectors/graph.selector';
import { UnshiftActions, PushActions } from './../actions/beacon.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { map, filter, withLatestFrom } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { RegisterListener,
		 UnRegisterListener,
		 UnRegisterParent } from '../actions/listener.actions';
import { ReloadNode } from '../actions/node.actions';
import { SSSCookieService } from 'src/app/services/sss-cookie.service';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { SSSListenerService } from 'src/app/services/sss-listener.service';


@Injectable()
export class ListenerEffects {

	constructor(private actions$: Actions,
				private store: Store<AppState>,
				private sssCookieService: SSSCookieService,
				private sssListenerService: SSSListenerService,
				private SSSSelectorService: SSSSelectorService,
				@Inject(PLATFORM_ID) protected platformId: Object) {}

	RegisterListener$ = createEffect(() =>
		this.actions$.pipe(
			ofType(RegisterListener),
			filter(action => isPlatformBrowser(this.platformId)),
			withLatestFrom(this.store.select(getListeners)),
			map(([action, listenerHash]) => {

				this.sssCookieService.setCookie("listeners", JSON.stringify(listenerHash), 5);

				const pointer 				= action.payload;
				const first 				= this.sssListenerService.compareListenerSlice(listenerHash, pointer);
				const moreThanOneExists 	= this.SSSSelectorService.nodeHash[ pointer.name ] > 1;

				return PushActions( { payload: first && moreThanOneExists ? ReloadNode( { payload: pointer.name } ) : [] } );
				// return PushActions( { payload: [] } );
			})	// so potential followers can register
		)
	);

	UnRegisterListener$ = createEffect(() =>
		this.actions$.pipe(
			ofType(UnRegisterListener),
			filter(action => isPlatformBrowser(this.platformId)),
			withLatestFrom(this.store.select(getListeners)),
			map(([action, listenerHash]) => {

				this.sssCookieService.setCookie("listeners", JSON.stringify(listenerHash), 5);
			})
		),
		{ dispatch: false }
	);

	UnRegisterParent$ = createEffect(() =>
		this.actions$.pipe(
			ofType(UnRegisterParent),
			filter(action => isPlatformBrowser(this.platformId)),
			map(action => {

				// const cmpref                = this.domService.getCmpRefInMemoryByInstanceKey( action.payload ).node;
				// const parentTimelinePointer = cmpref.instance.parent_tab_cmpref.instance.parent_node_cmpref.instance.pointerobj;
				// const parentTimelineTabid   = cmpref.instance.parent_tab_cmpref.instance.tabid;
				// const parentTimelineNodeid  = cmpref.instance.parent_tab_cmpref.instance.parent_node_cmpref.instance.nodeid;
				// const payload               = { tabid : parentTimelineTabid, nodeid : parentTimelineNodeid };
				// const transaction           = [ new listener.UnRegister( payload ) ];

				// if( parentTimelinePointer.urlnodelistener == false ) {
				// 	this.store.dispatch( new beacon.PushActions( { transaction } ));
				// } // a push so that all followers can first be registered into the store slice
			})
		),
		{ dispatch: false }
	);
}
