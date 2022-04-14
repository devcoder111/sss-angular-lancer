import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { withLatestFrom, map, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { dqNextAction, PushActions, UnshiftActions} from '../actions/beacon.actions';
import { getQueue } from '../selectors/beacon.selector';
import { realizeAction } from '../reducers/helper';

@Injectable()
export class BeaconEffects {

	constructor(private actions$: Actions,
				private store: Store<AppState>) {}

	AllTheActions$ = createEffect(() =>
		this.actions$.pipe(
			filter(action =>
				[ 	'[Beacon] DQ Next Action',
					'[Beacon] Unshift Action',
					'[Beacon] Push Action'
				].indexOf(action.type) == -1
			),
			map(action => dqNextAction() )
		)
	);

	dqNextAction$ = createEffect(() =>
		this.actions$.pipe(
			ofType(dqNextAction),
			withLatestFrom(this.store.select(getQueue)),
			filter(([action, queue]) => queue.length > 0),
			map(([action, queue]) => realizeAction( queue[0][0] || queue[0] ) )
		)
	);

	UnshiftActionsPushActions$ = createEffect(() =>
		this.actions$.pipe(
			ofType(UnshiftActions, PushActions),
			withLatestFrom(this.store.select(getQueue)),
			filter(([action, queue]) => queue.length > 0),
			map(([action, queue]) => {

				if(!action.payload) { debugger; }

				const insertedAction 	= action.payload[0] || action.payload;
				const topAction 		= queue[0][0] || queue[0];

				if(insertedAction === topAction) { this.store.dispatch( realizeAction( topAction ) ); }
			})
		),
		{ dispatch: false}
	);
}
