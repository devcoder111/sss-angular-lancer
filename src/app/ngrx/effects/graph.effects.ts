import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { map, filter, mergeMap, first, switchMap, withLatestFrom } from 'rxjs/operators';
import { LoadNewRootInstantiation, Reset, SetApplicationNodeID, SubstituteAppNode } from '../actions/application.actions';
import { isPlatformBrowser } from '@angular/common';
import { SSSCookieService } from 'src/app/services/sss-cookie.service';
import { SSSLocalService } from 'src/app/services/sss-local.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { getAppNodeId, getTabById } from '../selectors/graph.selector';
import { Tab } from 'src/app/models';
import { SubstitutePointer, RemoveTab } from '../actions/tab.actions';
import { RemoveNode } from '../actions/node.actions';


@Injectable()
export class GraphEffects {

	constructor(private actions$: Actions,
				private sssLocalService: SSSLocalService,
				private sssCookieService: SSSCookieService,
				private store: Store<AppState>,
				@Inject(PLATFORM_ID) protected platformId: Object) {}

	LoadNewRootInstantiation$ = createEffect(() =>
		this.actions$.pipe(
			ofType(LoadNewRootInstantiation),
			filter((action) => isPlatformBrowser(this.platformId)),
			map(action => {

				return SetApplicationNodeID( { payload: action.payload.root_nodeid } );
			})
		)
	);

	AppId$ = createEffect(() =>
		this.actions$.pipe(
			ofType(SetApplicationNodeID, SubstituteAppNode),
			withLatestFrom(this.store.select(getAppNodeId)),
			filter(([action, appid]) => isPlatformBrowser(this.platformId)),
			map(([action, appid]) => { this.sssCookieService.setCookie("applicationNodeId", appid, 5); })
		),
		{ dispatch: false }
	);

	Reset$ = createEffect(() =>
		this.actions$.pipe(
			ofType(Reset),
			filter((action) => isPlatformBrowser(this.platformId)),
			map(action => { this.sssCookieService.removeCookie("applicationNodeId");
 							this.sssLocalService.flush(); })
		),
		{ dispatch: false }
	);

	SubstitutePointer$ = createEffect(() =>
		this.actions$.pipe(
			ofType(SubstitutePointer),
			filter((action) => isPlatformBrowser(this.platformId)),
			switchMap((action: any) => this.store.pipe(select(getTabById, { id: action.payload.id }))),
			filter((tabobj: Tab) => isPlatformBrowser(!!tabobj)),
			map((tabobj: Tab) => this.sssLocalService.updateObjByKey( tabobj._id, tabobj ) )
		),
		{ dispatch: false }
	);

	// RemoveTab$ = createEffect(() =>
	// 	this.actions$.pipe(
	// 		ofType(RemoveTab, RemoveNode),
	// 		filter((action) => isPlatformBrowser(this.platformId)),
	// 		map((action: any) => this.sssLocalService.removeObjByKey( action.payload.id ) )
	// 	),
	// 	{ dispatch: false }
	// );
}
